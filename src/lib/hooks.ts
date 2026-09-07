'use client';

import { useEffect, useState } from 'react';
import { PRECISE_POINTER_QUERY, SCROLL_SPY_ROOT_MARGIN } from './brand';

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
