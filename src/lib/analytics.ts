/**
 * Umami analytics, served and collected through this origin.
 *
 * Umami Cloud's own instructions are two third-party requests: a script from
 * `cloud.umami.is` and a beacon to `gateway.umami.is`. Both are proxied here
 * instead, for the same reason `next/font` self-hosts the two typefaces rather
 * than loading them from the Google CDN — a third origin costs a DNS lookup
 * and a TLS handshake before anything useful happens, and in this case it is
 * also the first thing a content blocker drops. Proxied, the script and the
 * beacon are ordinary first-party requests to the host already connected.
 *
 * Two paths carry it, and only one of them is ours to name:
 *
 *   - the script, rewritten in `next.config.ts` to Umami Cloud's copy. The
 *     path is arbitrary; `/stats/script.js` says what it is.
 *   - the beacon, forwarded by `src/app/api/send/route.ts`. The tracker builds
 *     this one itself as `<host-url>/api/send`, so the route's location is
 *     fixed by the tracker rather than chosen by us.
 *
 * The tracker renders on Vercel production builds only, which is what keeps
 * `pnpm dev`, the test suite and preview deployments out of the numbers. See
 * `resolveUmamiWebsiteId` for why that is decided here rather than by a
 * dashboard setting.
 */

/**
 * Umami Cloud's tracker script, fetched by the rewrite.
 *
 * The script and the collector are on different hosts, which the setup
 * instructions do not make obvious: the script comes from `cloud.umami.is`,
 * and the data it sends goes to `gateway.umami.is`. Proxying only the first
 * one would leave every beacon still going to a third party.
 */
export const UMAMI_CLOUD_SCRIPT_URL = 'https://cloud.umami.is/script.js';

/** Umami Cloud's collection gateway — where `/api/send` forwards to. */
export const UMAMI_CLOUD_COLLECT_URL = 'https://gateway.umami.is/api/send';

/** Where this origin serves the proxied tracker. Ours to choose; see the rewrite. */
export const UMAMI_SCRIPT_PATH = '/stats/script.js';

/**
 * `data-host-url`, the prefix the tracker puts in front of `/api/send`.
 *
 * A single slash, not this site's absolute URL, and that is the whole trick.
 * Read from the shipped script (`cloud.umami.is/script.js`, inspected rather
 * than inferred from the docs), the collect URL is built as:
 *
 *     `${(hostUrl || 'https://gateway.umami.is').replace(/\/$/, '')}/api/send`
 *
 * so `'/'` is stripped to the empty string and leaves the relative path
 * `/api/send`, which `fetch` resolves against whatever origin is serving the
 * page. An absolute URL here would have worked too — and would have had to
 * come from `SITE_URL`, pinning the beacon to the domain known at build time.
 * On the day a custom domain is added without `NEXT_PUBLIC_SITE_URL` being
 * updated to match, that beacon becomes a cross-origin POST to the old host,
 * the preflight finds no CORS headers on our route, and analytics stops
 * recording with nothing anywhere saying so. A relative path cannot drift:
 * it is same-origin on the production domain, on a preview URL and on
 * localhost, with nothing to keep in sync.
 *
 * The empty string would have the same effect and read as an accident, so the
 * slash is deliberate and the falsy check in the script is why it matters.
 */
export const UMAMI_HOST_URL = '/';

/**
 * Request headers the beacon proxy passes upstream.
 *
 * The tracker sends three of its own (`x-umami-website-id`, `x-umami-hostname`
 * and, after the first response, `x-umami-cache`), which the documented Express
 * proxy example drops — it forwards only the user agent and the client IP.
 * `x-umami-cache` carries the session state the gateway handed back, so losing
 * it silently costs session continuity rather than failing outright, which is
 * exactly the kind of bug that never gets found. Matching the prefix rather
 * than listing the three names means a fourth one added upstream travels too.
 */
export const UMAMI_FORWARDED_HEADER_PREFIX = 'x-umami-';

/**
 * This site's id in Umami Cloud.
 *
 * Committed rather than read from an environment variable, because it is not a
 * secret — it ships in the HTML of every page, so anyone can read it from the
 * source — and because this repo prefers configuration that is committed over
 * configuration that has to be remembered (`vercel.json` exists for the same
 * reason). A dashboard variable is one more thing that can be missing on a
 * fresh project or scoped to the wrong environment, and either mistake fails
 * silently: no tracker, and an empty dashboard that looks like no visitors.
 *
 * The cost of committing it is that a fork deployed to its own Vercel
 * production would report into this dashboard. For a personal portfolio that
 * is noise at worst, and Umami can filter it by hostname after the fact.
 */
export const UMAMI_WEBSITE_ID = '8a599202-e3c6-4272-ac3f-7d7fe5b1c65d';

/**
 * The website id to render, or `null` to render no tracker at all.
 *
 * Gated on `VERCEL_ENV === 'production'`: Vercel sets it to `production`,
 * `preview` or `development` on its own builds, and it is absent everywhere
 * else. So production deployments track, and preview URLs, `pnpm dev`,
 * `pnpm start` on a local build and the test suite do not — the author's own
 * visits while working on the site stay out of the numbers without a flag to
 * remember. It is a system variable, so it depends on "Automatically expose
 * System Environment Variables" staying on, as `lib/site.ts` already does.
 *
 * Read when called rather than captured in a module constant, so a test can
 * set the variable and render the component. On this statically prerendered
 * page "when called" is build time.
 */
export function resolveUmamiWebsiteId(): string | null {
  return process.env.VERCEL_ENV === 'production' ? UMAMI_WEBSITE_ID : null;
}
