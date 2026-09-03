'use client';

import { useCallback, useMemo, useState, type ReactNode } from 'react';
import {
  CursorTrail,
  NavBar,
  NavPanel,
  NavToggle,
  SocialIconLink,
} from '@/components/design-system';
import { navItems, profile, SECTION_IDS } from '@/content';
import { useBodyScrollLock, useNavVisibility, useScrollSpy } from '@/lib/hooks';

/**
 * Everything around the page content: the sticky bar, the mobile drawer and
 * the cursor trail.
 *
 * This is the only stateful shell in the app. `children` arrives already
 * rendered from the server, so wrapping the page in a client component costs
 * nothing — the sections themselves never ship to the browser.
 *
 * The desktop bar and the mobile toggle are swapped with wrapper elements
 * rather than props: the design system components set `display` inline, and an
 * inline style always beats a utility class.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const sectionIds = useMemo(() => Object.values(SECTION_IDS), []);
  const activeId = useScrollSpy(sectionIds, SECTION_IDS.home);
  const activeHref = `#${activeId}`;

  const navVisible = useNavVisibility();

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((open) => !open), []);

  useBodyScrollLock(menuOpen);

  const socialLinks = profile.social.map((link) => (
    <SocialIconLink
      key={link.network}
      network={link.network}
      href={link.href}
      label={link.label}
      assetBase="/icons"
      size={26}
    />
  ));

  return (
    <>
      <a
        href={`#${SECTION_IDS.about}`}
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10000] focus:rounded-pill focus:bg-accent focus:px-5 focus:py-3 focus:text-on-accent"
      >
        Skip to content
      </a>

      {/*
        The wrapper owns the stickiness: NavBar carries `position: sticky`
        inline, which inside a same-height wrapper is a no-op, so hiding the
        wrapper below 768px cannot break the sticking behaviour. It also owns
        the hide-on-scroll transform, for the same reason — the vendored
        component sets its own `transform`-free inline styles and stays
        untouched.

        `focus-within` overrides the hidden state: the links keep their place in
        the tab order while the bar is off-screen, and a keyboard user must be
        able to see what they have just focused.
      */}
      <div
        data-testid="navbar"
        data-visible={navVisible}
        className={`sticky top-0 z-[100] hidden transition-transform duration-normal ease-standard nav:block focus-within:translate-y-0 ${
          navVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <NavBar
          items={navItems}
          activeHref={activeHref}
          brand={`${profile.name} — ${profile.role}`}
          right={socialLinks}
        />
      </div>

      {/*
        Only rendered while the drawer is closed. The drawer sits at z-index
        9999 and covers the top-left corner, so an open-state toggle would be a
        control the user can see morph into an X but cannot actually press —
        the drawer's own × is the single close affordance.
      */}
      {menuOpen ? null : (
        <div
          data-testid="nav-toggle"
          data-visible={navVisible}
          /*
            Same scroll rule as the desktop bar, but not the same motion. The
            bar spans the viewport, so sliding it fully out is natural; the
            toggle is a 44px control sitting 20px down, and `-translate-y-full`
            would move it by its own height only — leaving it half on screen.

            So it takes the design system's fade-and-rise treatment for
            floating fixed controls: fade out over a short 12px rise.
            `pointer-events-none` stops it swallowing taps while
            invisible, and `focus-within` brings it back for keyboard users,
            since it keeps its place in the tab order either way.

            The glass disc is not decoration. NavToggle draws pure white bars on
            a transparent button, so wherever it lands on light content — most
            of the About portrait — it simply disappears. Now that it reappears
            at whatever scroll position the reader stops at, that stopped being
            a corner case. This is the design system's own rule for fixed bars:
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

      <div className="nav:hidden">
        <NavPanel
          open={menuOpen}
          items={navItems}
          activeHref={activeHref}
          onClose={closeMenu}
          footer={socialLinks}
          /*
            The vendored panel is `height: 100%`, which resolves against the
            initial containing block — on mobile browsers with retracting
            toolbars that is taller than the visible area, and the footer's
            social icons end up below the fold with no way to reach them.
            `100dvh` tracks the actually-visible height instead.

            Applied as a prop rather than an edit: the component spreads
            `...style` last, so this overrides cleanly and the vendored file
            stays byte-identical to upstream. Worth pushing back to the
            design system.
          */
          style={{ height: '100dvh' }}
        />
      </div>

      <main id="main">{children}</main>

      <CursorTrail />
    </>
  );
}
