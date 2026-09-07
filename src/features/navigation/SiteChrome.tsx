'use client';

import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { CursorTrail, NavToggle } from '@/components/design-system';
import { SECTION_IDS } from '@/content';
import {
  useBodyScrollLock,
  useHashSync,
  useNavVisibility,
  usePrecisePointer,
  useScrollSpy,
  useSmoothScroll,
} from '@/lib/hooks';
import { MobileMenu } from './MobileMenu';
import { ScrollProgress } from './ScrollProgress';
import { SectionRail } from './SectionRail';
import { TopBar } from './TopBar';

/**
 * Everything around the page content.
 *
 * Navigation is now three coordinated affordances rather than one bar:
 *
 *   - TopBar — where you can go. Transparent over the hero, glass past it.
 *   - SectionRail — where you are, readable at a glance without stopping to
 *     read words. Wide screens only.
 *   - ScrollProgress — how far through you are.
 *
 * On phones the rail and bar both give way to a full-screen menu, since the
 * same information does not fit in a 390px gutter.
 *
 * `children` arrives already rendered from the server, so this being a client
 * component costs nothing beyond the chrome itself.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const sectionIds = useMemo(() => Object.values(SECTION_IDS), []);
  const activeId = useScrollSpy(sectionIds, SECTION_IDS.home);
  const activeHref = `#${activeId}`;

  /*
    The spy already knows where the reader is; this puts it in the address bar
    too, so the URL is worth copying at any point and not only right after a
    nav click.
  */
  useHashSync(activeId, SECTION_IDS.home);

  /*
    Smoothness is switched on here rather than declared in CSS, so that a cold
    arrival at a shared link lands instantly instead of animating on a page
    that is too busy to animate it. See globals.css.
  */
  useSmoothScroll();

  const navVisible = useNavVisibility();
  const precisePointer = usePrecisePointer();
  /* The bar earns its glass once the hero is no longer what is behind it. */
  const condensed = activeId !== SECTION_IDS.home;

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((open) => !open), []);

  useBodyScrollLock(menuOpen);

  return (
    <>
      <ScrollProgress />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10000] focus:rounded-pill focus:bg-accent focus:px-5 focus:py-3 focus:text-on-accent"
      >
        Skip to content
      </a>

      {/*
        Fixed rather than sticky, which is what lets the bar be transparent
        over the hero at all: a sticky bar keeps its box in the flow, so the
        hero would start 77px down, never fill the viewport, and push its own
        scroll cue below the fold. Fixed takes it out of the flow and the hero
        runs edge to edge underneath it.

        Anchor landings are unaffected — `scroll-padding-top` on <html> is what
        clears the bar, and that is independent of how the bar is positioned.

        The wrapper also owns the hide-on-scroll transform, leaving the bar free
        to animate its own background. `focus-within` overrides the hidden
        state so a keyboard user always sees the link they just focused.
      */}
      <div
        data-testid="navbar"
        data-visible={navVisible}
        className={`fixed inset-x-0 top-0 z-[200] hidden transition-transform duration-normal ease-standard nav:block focus-within:translate-y-0 ${
          navVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <TopBar activeHref={activeHref} condensed={condensed} />
      </div>

      <SectionRail activeHref={activeHref} />

      {/*
        Unmounted while the menu is open: the overlay sits above it, so an
        open-state toggle would be a control the reader can see but not press.
        The overlay carries its own close button.
      */}
      {menuOpen ? null : (
        <div
          data-testid="nav-toggle"
          data-visible={navVisible}
          /*
            The glass disc is not decoration. NavToggle draws pure white bars on
            a transparent button, so anywhere it lands on light content — most
            of the About portrait — it disappears. Since it reappears at
            whatever scroll position the reader stops at, that is not a corner
            case. This is the design system's rule for fixed bars:
            --surface-glass behind --blur-glass, with a hairline border.
          */
          className={`fixed top-5 left-5 z-[200] rounded-pill border border-hairline bg-surface-glass backdrop-blur-[var(--blur-glass)] transition-[opacity,transform] duration-normal ease-standard nav:hidden focus-within:pointer-events-auto focus-within:translate-y-0 focus-within:opacity-100 ${
            navVisible
              ? 'translate-y-0 opacity-100'
              : 'pointer-events-none -translate-y-3 opacity-0'
          }`}
        >
          <NavToggle open={false} onClick={toggleMenu} />
        </div>
      )}

      <MobileMenu open={menuOpen} activeHref={activeHref} onClose={closeMenu} />

      <main id="main">{children}</main>

      {/*
        The trail is not rendered at all on phones. Its own guard checks for a
        precise pointer, which a tablet or phone with a Bluetooth mouse or a
        stylus satisfies — so the dots would follow nothing and sit in the way.
        Gating it here rather than patching the vendored component keeps that
        file byte-identical to upstream.
      */}
      {precisePointer ? <CursorTrail /> : null}
    </>
  );
}
