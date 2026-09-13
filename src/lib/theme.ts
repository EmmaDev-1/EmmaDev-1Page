/**
 * Theme plumbing, shared by the inline boot script and the toggle.
 *
 * The attribute name and the storage key appear in two very different places —
 * a string of JavaScript inlined into <head>, and a React hook — so they are
 * declared once here and both sides import them. A mismatch between the two
 * would not fail a build; it would silently stop the toggle sticking.
 */

export type Theme = 'light' | 'dark';

/** Written on <html>. `globals.css` keys the light palette off it. */
export const THEME_ATTR = 'data-theme';

export const THEME_STORAGE_KEY = 'emmadev-theme';

/** The design system's own surface, and so what an unset reader gets. */
export const DEFAULT_THEME: Theme = 'dark';

export const isTheme = (value: unknown): value is Theme => value === 'light' || value === 'dark';

/**
 * Runs in <head>, before the browser has painted anything.
 *
 * This has to be inline and blocking. The page is prerendered at build time
 * with no idea who is reading it, so the theme can only be resolved in the
 * browser — and resolving it after hydration would show every light-mode
 * reader a black page first. A few hundred bytes of blocking script is the
 * cost of not doing that.
 *
 * A stored choice wins over the system setting, because it was a choice. With
 * no stored choice the system preference decides, falling back to the brand's
 * own dark. The whole thing is wrapped in try/catch: reading localStorage
 * throws outright in some privacy modes, and a theme is not worth a blank page.
 */
export const themeBootScript = `(function(){try{var s=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});var t=(s==='light'||s==='dark')?s:(window.matchMedia('(prefers-color-scheme: light)').matches?'light':${JSON.stringify(
  DEFAULT_THEME,
)});document.documentElement.setAttribute(${JSON.stringify(THEME_ATTR)},t);}catch(e){}})();`;
