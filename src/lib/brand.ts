/**
 * The only place in the app allowed to hold literal brand values.
 *
 * Exempted from the adherence lint by path (see eslint.adherence.config.mjs)
 * rather than by an inline disable comment, so the exemption is declared in one
 * visible place instead of hiding at the top of a file.
 *
 * Three contexts cannot read a CSS custom property, so a token reference is
 * simply not available to them:
 *
 *   - `<meta name="theme-color">`, which the browser chrome reads before any
 *     stylesheet has been applied;
 *   - the OG image, rendered by Satori at build time — it resolves no cascade
 *     and no `var()`;
 *   - IntersectionObserver's `rootMargin`, which is a CSS-length string parsed
 *     by the observer, not by the style engine.
 *
 * Centralising them here means the adherence lint stays fully armed everywhere
 * else, and there is exactly one file to update if a brand colour changes —
 * which is the property the rule was protecting in the first place.
 *
 * These MUST stay in step with src/styles/design-system/tokens/colors.css.
 */

/** --graphite-150, the single page background. */
export const BRAND_GRAPHITE = '#151515';

/** --violet-700, the brand purple. */
export const BRAND_VIOLET = '#a945c7';

/** --ember-500, the gradient's middle stop. */
export const BRAND_EMBER = '#ff6237';

/** --violet-600, the gradient's third stop. */
export const BRAND_VIOLET_ALT = '#ae4fca';

/** --ink-300, muted text. */
export const BRAND_INK_MUTED = '#8f8f8f';

/** --gradient-brand, flattened for renderers with no `var()` support. */
export const BRAND_GRADIENT = `linear-gradient(to right,${BRAND_VIOLET},${BRAND_EMBER},${BRAND_VIOLET_ALT})`;

/** --gradient-brand-wide, likewise. */
export const BRAND_GRADIENT_WIDE = `linear-gradient(100deg,${BRAND_VIOLET},${BRAND_EMBER},${BRAND_VIOLET_ALT})`;

/** Bloom blur for the OG card. Larger than the page's 120px to suit 1200x630. */
export const OG_BLOOM_BLUR = 'blur(140px)';

/**
 * Scroll-spy band: a section counts as current while it crosses the middle 10%
 * of the viewport. Expressed as an IntersectionObserver rootMargin.
 */
export const SCROLL_SPY_ROOT_MARGIN = '-45% 0px -45% 0px';
