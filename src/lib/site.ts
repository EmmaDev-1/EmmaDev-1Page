/**
 * The site's public origin.
 *
 * Every absolute URL the page publishes derives from this: `metadataBase`, the
 * canonical link, the Open Graph `url`, the sitemap entry, the robots sitemap
 * pointer and the JSON-LD author URL. Getting it wrong does not fail a build —
 * it quietly tells search engines the wrong thing.
 *
 * Resolved rather than guessed, in three steps:
 *
 *   1. NEXT_PUBLIC_SITE_URL — set this once a custom domain exists. It wins
 *      over everything else.
 *   2. VERCEL_PROJECT_PRODUCTION_URL — injected by Vercel at build time and
 *      stable across deployments (unlike VERCEL_URL, which is unique per
 *      deployment and would make every preview claim to be canonical). Preview
 *      builds get the production domain here, which is what canonical URLs
 *      should point at.
 *   3. localhost, for `pnpm dev` and tests.
 *
 * There is deliberately no hardcoded production fallback. The previous one was
 * a guess — `emmadev.vercel.app` — and that domain belongs to somebody else's
 * portfolio, so every canonical URL and sitemap entry pointed at a stranger's
 * site whenever the env var was absent. A wrong constant is worse than no
 * constant: it fails silently and looks correct.
 *
 * All three consumers run at build time (static generation), so these are
 * ordinary server-side variables — no NEXT_PUBLIC_ prefix is required for the
 * Vercel one to be readable.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return stripTrailingSlash(explicit);

  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProduction) return `https://${stripTrailingSlash(vercelProduction)}`;

  return 'http://localhost:3000';
}

/** `new URL()` and string concatenation disagree about trailing slashes. */
function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

export const SITE_URL = resolveSiteUrl();
