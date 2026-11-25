import { UMAMI_HOST_URL, UMAMI_SCRIPT_PATH, resolveUmamiWebsiteId } from '@/lib/analytics';

/**
 * The tracker tag, or nothing.
 *
 * Nothing is the default: outside a Vercel production build this renders no
 * element at all, so `pnpm dev`, the test suite and every preview deployment
 * stay out of the dashboard without a flag to remember. `lib/analytics.ts`
 * decides which builds count.
 *
 * **A plain `<script async>` rather than `next/script`.** Umami's docs
 * recommend the latter for Next.js, and the recommendation does not survive
 * this page: `next/script`'s default `afterInteractive` strategy injects the
 * tag from the client once hydration is underway, and this page ships around
 * 278 KB of JavaScript because every section animates on scroll. The beacon
 * would queue behind all of it, and the visitors most likely to be missed are
 * the ones who leave quickly — which on a portfolio is most of them. In
 * `<head>` as served markup the request starts with the document's other
 * subresources and owes nothing to hydration, and being `async` it blocks
 * neither parsing nor paint. It also ships no client runtime of its own, which
 * `next/script` cannot claim.
 *
 * Only two attributes, both load-bearing:
 *
 *   - `data-website-id` names the site in Umami.
 *   - `data-host-url` redirects the beacon from Umami Cloud's gateway to this
 *     origin. It is a bare `/` on purpose — `lib/analytics.ts` explains why a
 *     relative path and not `SITE_URL`.
 *
 * `data-domains` is deliberately absent. It would guard against the id leaking
 * to another host, which the production-only gate already does, and it
 * would do it by matching a hostname fixed at build time — so adding a custom
 * domain without updating the environment would stop tracking silently. One
 * silent failure mode is not worth trading for a guard against a condition
 * that cannot arise.
 */
export function UmamiAnalytics() {
  const websiteId = resolveUmamiWebsiteId();
  if (!websiteId) return null;

  return (
    <script
      async
      src={UMAMI_SCRIPT_PATH}
      data-website-id={websiteId}
      data-host-url={UMAMI_HOST_URL}
    />
  );
}
