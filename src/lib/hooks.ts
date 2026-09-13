'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { PRECISE_POINTER_QUERY, SCROLL_SPY_ROOT_MARGIN } from './brand';
import { DEFAULT_THEME, isTheme, THEME_ATTR, THEME_STORAGE_KEY, type Theme } from './theme';

/**
 * Tracks which section is currently in view so the nav can mark it active.
 *
 * Uses a viewport-middle root margin rather than a scroll listener: the
 * observer only fires on crossings, where a scroll handler would run on every
 * frame. Falls back to the first id before anything has intersected.
 */
export function useScrollSpy(ids: readonly string[], fallback: string): string {
  const [active, setActive] = useState(fallback);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Prefer whichever tracked section is nearest the top of the viewport.
        // A single pass rather than filter-then-sort: this runs on every
        // crossing, and there is never a reason to order the whole set when
        // only the minimum is wanted.
        let nearest: IntersectionObserverEntry | undefined;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (!nearest || entry.boundingClientRect.top < nearest.boundingClientRect.top) {
            nearest = entry;
          }
        }

        if (nearest) setActive(nearest.target.id);
      },
      { rootMargin: SCROLL_SPY_ROOT_MARGIN, threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

/**
 * Reads and writes the active theme.
 *
 * The <html> attribute is the single source of truth, not React state. It is
 * already correct before React runs — the boot script in <head> sets it — and
 * the toggle's own appearance is driven from it in CSS, so the button looks
 * right on a page that has not hydrated yet.
 *
 * That leaves this hook responsible only for the parts React must own: the
 * accessible state, and the click. `useSyncExternalStore` is what makes the
 * first of those safe. The page is prerendered with no reader to ask, so the
 * server can only guess `dark`; the hook hands React that guess for hydration
 * and the real value immediately after, which is the one thing that turns a
 * hydration mismatch into an ordinary re-render.
 */
export function useTheme(): { theme: Theme; toggle: () => void } {
  const theme = useSyncExternalStore(subscribeToTheme, readTheme, () => DEFAULT_THEME);

  const toggle = useCallback(() => {
    const next: Theme = readTheme() === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute(THEME_ATTR, next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private modes throw on write. The theme still applies for this visit.
    }
  }, []);

  /*
    Follow the system only while the reader has expressed no preference of
    their own — once they have chosen, changing it back under them would make
    the button feel broken.
  */
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: light)');
    const update = (event: MediaQueryListEvent) => {
      try {
        if (isTheme(window.localStorage.getItem(THEME_STORAGE_KEY))) return;
      } catch {
        // Unreadable storage means no stored choice to respect.
      }
      document.documentElement.setAttribute(THEME_ATTR, event.matches ? 'light' : 'dark');
    };

    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return { theme, toggle };
}

function readTheme(): Theme {
  const value = document.documentElement.getAttribute(THEME_ATTR);
  return isTheme(value) ? value : DEFAULT_THEME;
}

/**
 * Watches the attribute rather than a React store, so every route to a theme
 * change lands here: the toggle, the system-preference listener above, and a
 * second tab writing to storage.
 */
function subscribeToTheme(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributeFilter: [THEME_ATTR] });
  window.addEventListener('storage', mirrorThemeFromStorage);

  return () => {
    observer.disconnect();
    window.removeEventListener('storage', mirrorThemeFromStorage);
  };
}

/**
 * A second tab choosing a theme applies it here too. It writes the attribute
 * rather than notifying directly, so the change arrives through the observer
 * above — one path in, whoever started it.
 */
function mirrorThemeFromStorage(event: StorageEvent): void {
  if (event.key !== THEME_STORAGE_KEY || !isTheme(event.newValue)) return;
  document.documentElement.setAttribute(THEME_ATTR, event.newValue);
}

/** Must stay in step with the `html[data-scroll-smooth]` rule in globals.css. */
const SMOOTH_SCROLL_ATTR = 'data-scroll-smooth';

/**
 * Switches page-level smooth scrolling on, once, after hydration.
 *
 * It is off in the stylesheet on purpose, and the reasoning lives there: CSS
 * cannot distinguish the scroll a reader asks for from the one the browser
 * performs on arriving at a URL carrying a fragment, and animating the second
 * makes it fail — starved by a loading page, it stops partway and leaves a
 * shared link parked on the wrong section.
 *
 * Hydration is late enough to be safe. With the stylesheet starting instant,
 * the arrival scroll is a jump the browser has already made by the time React
 * runs, so there is nothing in flight for this to turn smooth mid-travel.
 */
export function useSmoothScroll(): void {
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute(SMOOTH_SCROLL_ATTR, '');
    return () => root.removeAttribute(SMOOTH_SCROLL_ATTR);
  }, []);
}

/**
 * How long to wait for a fragment scroll to finish when the browser will not
 * tell us. `scrollend` is the real signal; this is only the escape hatch for
 * engines that do not fire it, so that one navigation can never leave the
 * address bar frozen for the rest of the session.
 *
 * It can afford to be generous, which is why it is not tuned to the length of
 * a scroll: throughout the wait the address bar holds the fragment the reader
 * just navigated to, so it is already correct — this only decides how soon
 * free scrolling starts updating it again.
 */
const SCROLL_SETTLE_FALLBACK_MS = 3000;

/**
 * Mirrors the section being read into the address bar.
 *
 * A nav click already writes a fragment. This is what makes the URL true the
 * rest of the time: someone who scrolled to the work and copied the address
 * gets a link to the work, not to the top of the page.
 *
 * `history.replaceState` rather than assigning `location.hash` — assigning is
 * itself a fragment navigation, so it would both push a history entry for
 * every section crossed and send the browser scrolling to a section the reader
 * is already looking at, fighting the scroll that triggered it.
 *
 * Two moments are deliberately left alone:
 *
 *   - The first pass. Whatever URL the reader arrived on wins until they
 *     actually move, so landing on a shared `/#projects` link is not rewritten
 *     to `/` by the spy's initial fallback before the browser has scrolled
 *     there at all.
 *   - Anything in flight. A fragment navigation fires `hashchange` at the
 *     start of its smooth scroll, not the end, so a click on the last nav item
 *     would otherwise walk the address bar through every section on the way
 *     down. Writing is suspended from that event until the scroll settles, and
 *     resumes with one write so a reader who grabs the scrollbar mid-flight
 *     still ends up with an honest URL.
 */
export function useHashSync(activeId: string, rootId: string): void {
  const latest = useRef(activeId);
  const settled = useRef(true);
  const ready = useRef(false);

  const write = useCallback(() => {
    if (!ready.current || !settled.current) return;

    const { pathname, search, hash } = window.location;
    const id = latest.current;
    // The top of the page is the page: `/` is the address to share for the
    // site as a whole, and what a reader who scrolls back up expects to see.
    const next = id === rootId ? `${pathname}${search}` : `${pathname}${search}#${id}`;

    if (`${pathname}${search}${hash}` !== next) {
      window.history.replaceState(null, '', next);
    }
  }, [rootId]);

  useEffect(() => {
    let timer = 0;

    const resume = () => {
      window.clearTimeout(timer);
      settled.current = true;
      write();
    };

    const suspend = () => {
      settled.current = false;
      window.clearTimeout(timer);
      timer = window.setTimeout(resume, SCROLL_SETTLE_FALLBACK_MS);
    };

    /*
      A load carrying a fragment scrolls just like a click does, but announces
      it with no event at all — `hashchange` fires for navigation within a
      document, and this is a fresh one. Starting suspended is what covers it;
      without this, arriving on a shared link walked the address bar through
      every section on the way down (#about, #projects, then finally
      #experience) before settling.
    */
    if (window.location.hash) suspend();

    window.addEventListener('hashchange', suspend);
    window.addEventListener('scrollend', resume);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('hashchange', suspend);
      window.removeEventListener('scrollend', resume);
    };
  }, [write]);

  useEffect(() => {
    latest.current = activeId;
    if (!ready.current) {
      ready.current = true;
      return;
    }
    write();
  }, [activeId, write]);
}

type NavVisibilityOptions = {
  /**
   * Minimum movement, in px, before a direction change counts. Without it the
   * bar flickers on trackpad jitter and on the rubber-band at the page ends.
   */
  threshold?: number;
  /**
   * Always show the bar within this many px of the top. The hero is the one
   * place the bar should never be missing.
   */
  revealAbove?: number;
};

/**
 * Hides the nav while the reader scrolls down and brings it back the moment
 * they scroll up — the content gets the full viewport, but navigation is one
 * gesture away rather than a trip to the top of the page.
 *
 * Reads scroll position inside requestAnimationFrame rather than in the event
 * handler: `scrollY` is a layout-flushing read, and scroll fires far more often
 * than the screen repaints.
 */
export function useNavVisibility({
  threshold = 8,
  revealAbove = 96,
}: NavVisibilityOptions = {}): boolean {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const measure = () => {
      frame = 0;
      // Clamp: iOS overscroll reports positions past both ends of the document,
      // which would otherwise read as a direction change on release.
      const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const y = Math.min(Math.max(window.scrollY, 0), maxY);
      const delta = y - lastY;

      if (y <= revealAbove) {
        setVisible(true);
      } else if (delta > threshold) {
        setVisible(false);
      } else if (delta < -threshold) {
        setVisible(true);
      }

      // Only advance the reference point once the movement was big enough to
      // act on, so a slow drag accumulates instead of being discarded.
      if (Math.abs(delta) > threshold) lastY = y;
    };

    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame !== 0) cancelAnimationFrame(frame);
    };
  }, [threshold, revealAbove]);

  return visible;
}

/**
 * True only where a pointer flourish makes sense: a real pointer, on a screen
 * that is not phone-sized.
 *
 * Reactive rather than read once — a mouse can be connected or disconnected,
 * and a window can be resized across the breakpoint, mid-session.
 */
export function usePrecisePointer(): boolean {
  const [precise, setPrecise] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(PRECISE_POINTER_QUERY);
    const update = () => setPrecise(query.matches);

    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return precise;
}

/** Mirrors the user's reduced-motion setting, and keeps mirroring it if it changes. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return reduced;
}

/** Locks body scroll while the mobile drawer is open. */
export function useBodyScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}
