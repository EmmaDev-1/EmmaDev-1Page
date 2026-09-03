'use client';

import { useEffect, useState } from 'react';
import { SCROLL_SPY_ROOT_MARGIN } from './brand';

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
 * True once the user has scrolled past `threshold` pixels.
 * Drives the back-to-top arrow, which should not appear over the hero.
 */
export function useScrolledPast(threshold: number): boolean {
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    const update = () => setPassed(window.scrollY > threshold);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [threshold]);

  return passed;
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
