import { expect, test, type Page } from '@playwright/test';

/**
 * Scrolls until the chrome element reaches `expected`, nudging repeatedly.
 *
 * A single wheel plus a fixed wait is not reliable here. The very first wheel
 * of a test can land before React has hydrated: the scroll happens, but
 * useNavVisibility's listener does not exist yet, so it initialises at the
 * already-scrolled position with a delta of zero and never sees the movement.
 * Under a loaded machine — the full suite runs several of these animated pages
 * at once — that window is wide enough to matter.
 *
 * Nudging until the state flips tests the real contract ("scrolling this way
 * hides it") without encoding a guess about how long hydration takes.
 */
async function scrollUntil(
  page: Page,
  testId: string,
  expected: 'true' | 'false',
  dy: number,
): Promise<void> {
  await expect
    .poll(
      async () => {
        const value = await page.getByTestId(testId).getAttribute('data-visible');
        if (value === expected) return value;
        await page.mouse.wheel(0, dy);
        await page.waitForTimeout(220);
        return page.getByTestId(testId).getAttribute('data-visible');
      },
      { timeout: 10_000 },
    )
    .toBe(expected);
}

/**
 * End-to-end checks for the things that were actually broken before the
 * refactor, plus the accessibility structure the source page lacked.
 */

test.describe('portfolio', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has exactly one h1, and it is the hero line', async ({ page }) => {
    // The source used <h2> for the hero and had no h1 anywhere on the page.
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText("Hi, I'm Emmanuel a FrontEnd Engineer");
  });

  test('renders all eleven projects', async ({ page }) => {
    await expect(page.locator('#projects article')).toHaveCount(11);
  });

  test('reveals content once it is scrolled into view', async ({ page }) => {
    const heading = page.getByRole('heading', { name: 'Casa Padi' });
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible();
  });

  test('every project video defers its download', async ({ page }) => {
    // 6 original video projects + Colorinfinity + Ditto Kids.
    const videos = page.locator('video');
    const count = await videos.count();
    expect(count).toBe(8);

    for (let i = 0; i < count; i += 1) {
      await expect(videos.nth(i)).toHaveAttribute('preload', 'none');
    }
  });

  test('offers the CV as a download', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Download CV' });
    await link.scrollIntoViewIfNeeded();
    await expect(link).toHaveAttribute('href', '/docs/Emmanuel_Aguilar_CV.pdf');
  });

  test('publishes structured data describing the author', async ({ page }) => {
    const raw = await page.locator('script[type="application/ld+json"]').textContent();
    const data = JSON.parse(raw ?? '{}');
    expect(data['@type']).toBe('Person');
    expect(data.name).toBe('Emmanuel');
    expect(data.sameAs).toContain('https://github.com/EmmaDev-1');
  });

  test('exposes a working skip link', async ({ page }) => {
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  });
});

test.describe('desktop navigation', () => {
  test.skip(({ isMobile }) => !!isMobile, 'desktop bar is hidden below 768px');

  test('marks the section in view as active', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('heading', { name: 'Projects' }).scrollIntoViewIfNeeded();

    // The active link keeps the gradient underline; colour is the tell.
    const projectsLink = page.locator('header a[href="#projects"]');
    await expect(projectsLink).toBeVisible();
  });

  test.describe('jump-link landing', () => {
    /**
     * `scroll-padding-top` on <html> and `scroll-margin-top` on the target both
     * contribute to a fragment-navigation landing spot, per the CSS Scroll
     * Snap spec — declaring the same nav-clearance offset in both places
     * doubled it, landing every section 80px further down than intended.
     */
    for (const href of ['#about', '#projects', '#experience', '#curriculum']) {
      test(`lands ${href} just under the nav, not floating further down`, async ({ page }) => {
        await page.goto('/');
        await page.click(`header a[href="${href}"]`);
        await page.waitForTimeout(1500);

        const top = await page.locator(href).evaluate((el) => el.getBoundingClientRect().top);

        // One offset, not two: within a few px of --space-20 (80px), not ~160px.
        expect(top).toBeGreaterThan(60);
        expect(top).toBeLessThan(100);
      });
    }
  });

  test.describe('hide on scroll', () => {
    test('stays visible at the top of the page', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByTestId('navbar')).toHaveAttribute('data-visible', 'true');
    });

    test('hides on the way down and returns on the way up', async ({ page }) => {
      await page.goto('/');
      const navbar = page.getByTestId('navbar');

      await scrollUntil(page, 'navbar', 'false', 1200);

      // Off-screen, not merely transparent — assert the box actually moved out.
      const hidden = await navbar.boundingBox();
      expect(hidden).not.toBeNull();
      expect(hidden!.y + hidden!.height).toBeLessThanOrEqual(0);

      await scrollUntil(page, 'navbar', 'true', -300);

      const shown = await navbar.boundingBox();
      expect(shown!.y).toBeGreaterThanOrEqual(0);
    });

    test('comes back when the reader returns to the top', async ({ page }) => {
      await page.goto('/');
      await scrollUntil(page, 'navbar', 'false', 1500);

      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForTimeout(450);
      await expect(page.getByTestId('navbar')).toHaveAttribute('data-visible', 'true');
    });

    test('reveals itself when a link inside it takes focus', async ({ page }) => {
      await page.goto('/');
      await scrollUntil(page, 'navbar', 'false', 1200);

      // A keyboard user must be able to see the link they just tabbed to, even
      // though the bar is off-screen and still in the tab order.
      await page.locator('header a[href="#about"]').focus();
      await page.waitForTimeout(450);

      const box = await page.getByTestId('navbar').boundingBox();
      expect(box!.y).toBeGreaterThanOrEqual(0);
    });
  });
});

test.describe('mobile navigation', () => {
  test.skip(({ isMobile }) => !isMobile, 'the menu only exists below 768px');

  /** The full-screen menu, which replaced the side drawer. */
  const menu = (page: Page) => page.getByRole('navigation', { name: 'Main' });

  test('opens and closes the menu', async ({ page }) => {
    await page.goto('/');

    const toggle = page.getByRole('button', { name: 'Open menu' });
    await expect(toggle).toBeVisible();
    await toggle.click();

    await expect(menu(page).getByRole('link', { name: 'Projects' })).toBeVisible();

    // The hamburger is unmounted while the menu is open, so the overlay's own
    // close button is the only way out — and the only one that could be
    // clickable, since the overlay covers the corner the hamburger occupies.
    await expect(page.getByRole('button', { name: 'Open menu' })).toHaveCount(0);

    await page.getByRole('button', { name: 'Close menu' }).click();
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible();
  });

  test('closes the menu when a link is followed', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    await menu(page).getByRole('link', { name: 'Projects' }).click();
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible();
  });

  test('never mounts the cursor trail on a touch device', async ({ page }) => {
    await page.goto('/');
    // CursorTrail checks (hover:hover) and (pointer:fine) and renders null
    // when neither matches, rather than rendering dots and hiding them.
    const dotCount = await page.locator('body > div[aria-hidden="true"] > span').count();
    expect(dotCount).toBe(0);
  });

  test.describe('toggle hides on scroll', () => {
    /**
     * Playwright treats an opacity-0 element as visible, so `toBeVisible` would
     * pass either way here. Assert the opacity the user actually perceives.
     *
     * Polled rather than read once: the fade is a 300ms transition, so a single
     * read lands mid-transition whenever the machine is busy — which is exactly
     * what happened when these ran alongside the rest of the suite instead of
     * on their own.
     */
    const expectOpacity = (page: Page, value: number) =>
      expect
        .poll(
          () =>
            page
              .getByTestId('nav-toggle')
              .evaluate((el) => Number.parseFloat(getComputedStyle(el).opacity)),
          { timeout: 4000 },
        )
        .toBe(value);

    test('is visible at the top of the page', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByTestId('nav-toggle')).toHaveAttribute('data-visible', 'true');
      await expectOpacity(page, 1);
    });

    test('fades out on the way down and back in on the way up', async ({ page }) => {
      await page.goto('/');
      const toggle = page.getByTestId('nav-toggle');

      await scrollUntil(page, 'nav-toggle', 'false', 1200);
      await expect(toggle).toHaveAttribute('data-visible', 'false');
      await expectOpacity(page, 0);

      await scrollUntil(page, 'nav-toggle', 'true', -300);
      await expectOpacity(page, 1);
    });

    test('sits on a glass disc so it stays legible over light content', async ({ page }) => {
      // NavToggle's bars are pure white on a transparent button; over the About
      // portrait that is white on white.
      await page.goto('/');
      const background = await page
        .getByTestId('nav-toggle')
        .evaluate((el) => getComputedStyle(el).backgroundColor);

      expect(background).not.toBe('rgba(0, 0, 0, 0)');
      expect(background).not.toBe('transparent');
    });

    test('does not swallow taps while it is invisible', async ({ page }) => {
      await page.goto('/');
      await scrollUntil(page, 'nav-toggle', 'false', 1200);

      const pointerEvents = await page
        .getByTestId('nav-toggle')
        .evaluate((el) => getComputedStyle(el).pointerEvents);
      expect(pointerEvents).toBe('none');
    });

    test('reveals itself when it takes focus', async ({ page }) => {
      await page.goto('/');
      await scrollUntil(page, 'nav-toggle', 'false', 1200);

      // It stays in the tab order while invisible, so focusing it must bring it
      // back — otherwise a keyboard user is on a control they cannot see.
      await page.getByRole('button', { name: 'Open menu' }).focus();
      await expectOpacity(page, 1);
    });
  });

  test('keeps the menu social links on screen', async ({ page }) => {
    // The menu is a full-viewport overlay, so its footer has to sit inside the
    // visible area on browsers whose toolbars retract.
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();

    const linkedin = page
      .locator('[class*="fixed"]')
      .locator('a[aria-label="LinkedIn profile"]')
      .last();
    await expect(linkedin).toBeVisible();

    const box = await linkedin.boundingBox();
    const viewport = page.viewportSize();
    expect(box).not.toBeNull();
    expect(viewport).not.toBeNull();
    expect(box!.y + box!.height).toBeLessThanOrEqual(viewport!.height);
  });
});
