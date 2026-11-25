import { UMAMI_CLOUD_COLLECT_URL, UMAMI_FORWARDED_HEADER_PREFIX } from '@/lib/analytics';

/**
 * The analytics beacon, forwarded to Umami Cloud from this origin.
 *
 * The path is not a choice. The tracker builds its collect URL as
 * `<data-host-url>/api/send`, so pointing `data-host-url` at this site fixes
 * the route here; renaming it would mean forking the script.
 *
 * This is the one piece of the site that runs on a request rather than at
 * build time. Everything else prerenders, and it stays that way — the page is
 * still fully static, and this function is reached only by the tracker.
 *
 * ## Why a route handler and not a rewrite
 *
 * The script is proxied with a `rewrite` in `next.config.ts`, which is all a
 * `GET` of a static file needs. The beacon cannot use one, because the
 * forwarded request has to be assembled by hand:
 *
 *   - **The visitor's IP.** Umami Cloud resolves country and city from the IP
 *     reaching the gateway. Behind a proxy that is the proxy's IP, and Umami's
 *     own documentation is explicit that a reverse proxy which omits the
 *     original IP leaves location "missing, less precise, or reflect[ing] the
 *     proxy instead". Forwarding it deliberately is the difference between a
 *     country breakdown and a column that says Washington for everyone.
 *   - **The user agent.** Umami's API docs state a request without a proper
 *     `User-Agent` is not registered at all. It is also what the browser and
 *     OS breakdowns are derived from.
 *   - **The tracker's own headers.** `x-umami-website-id`, `x-umami-hostname`
 *     and `x-umami-cache` are sent by the script and are not in the body.
 *     `x-umami-cache` in particular echoes state the gateway returned, so
 *     dropping it degrades session stitching quietly rather than loudly.
 *
 * The documented Express proxy forwards the first two and drops the third.
 * This forwards all of them, and passes the gateway's response back intact
 * because the script reads `cache` and `disabled` out of it.
 */

/**
 * Nothing the tracker sends comes close to this. Its payloads are a few
 * hundred bytes, and the largest field it will ever send — a captured error
 * stack — is truncated to 16,000 characters at the source. The cap is here
 * because the route is a publicly reachable proxy: without one, this endpoint
 * would relay a request of any size to a third party on demand.
 */
const MAX_BODY_BYTES = 64 * 1024;

export async function POST(request: Request): Promise<Response> {
  const body = await request.text();

  if (body.length > MAX_BODY_BYTES) {
    return new Response(null, { status: 413 });
  }

  const headers = new Headers({
    'Content-Type': 'application/json',
    // Empty rather than absent when the client sent none: the gateway wants
    // the header present, and inventing a plausible one would put a visitor
    // in the browser breakdown under a browser they are not using.
    'User-Agent': request.headers.get('user-agent') ?? '',
  });

  const ip = clientIp(request.headers);
  if (ip) headers.set('X-Forwarded-For', ip);

  for (const [name, value] of request.headers) {
    if (name.toLowerCase().startsWith(UMAMI_FORWARDED_HEADER_PREFIX)) {
      headers.set(name, value);
    }
  }

  let upstream: Response;
  try {
    upstream = await fetch(UMAMI_CLOUD_COLLECT_URL, {
      method: 'POST',
      headers,
      body,
      cache: 'no-store',
    });
  } catch {
    // The gateway being unreachable is Umami's problem, not the reader's: the
    // tracker already swallows a failed beacon. Reported as a gateway error
    // rather than a silent 204 so that it is visible in the function logs if
    // it ever stops being occasional.
    return new Response(null, { status: 502 });
  }

  // Returned verbatim. The script parses this and reads `cache` and `disabled`
  // from it — a 204 here would work until Umami starts using either.
  return new Response(await upstream.text(), {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('content-type') ?? 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

/**
 * The visitor's address, as the platform reports it.
 *
 * `x-real-ip` first: on Vercel the edge sets it to the connecting address, and
 * unlike `x-forwarded-for` it is a single value a client cannot prepend its
 * own entry to. The fallback takes the first entry of `x-forwarded-for`, which
 * is the conventional position for the original client.
 *
 * A spoofed value here mislabels one visit's country in a personal
 * portfolio's dashboard. That is the whole blast radius, and it is why this
 * stays a header read rather than anything more elaborate — but it is also why
 * the more trustworthy header is preferred where it exists.
 */
function clientIp(headers: Headers): string | null {
  const real = headers.get('x-real-ip')?.trim();
  if (real) return real;

  const forwarded = headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded ? forwarded : null;
}
