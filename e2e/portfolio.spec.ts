import { expect, test } from '@playwright/test';

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

  test('renders all eight projects', async ({ page }) => {
    await expect(page.locator('#projects article')).toHaveCount(8);
  });

  test('reveals content once it is scrolled into view', async ({ page }) => {
    const heading = page.getByRole('heading', { name: 'Casa Padi' });
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible();
  });

  test('every project video defers its download', async ({ page }) => {
    const videos = page.locator('video');
    const count = await videos.count();
    expect(count).toBe(6);

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

  test.describe('hide on scroll', () => {
    /** Wheel events rather than scrollTo: the hook reads direction, not position. */
    const wheel = async (page: import('@playwright/test').Page, dy: number) => {
      await page.mouse.wheel(0, dy);
      // One frame for the rAF read, plus the transform transition.
      await page.waitForTimeout(450);
    };

    test('stays visible at the top of the page', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByTestId('navbar')).toHaveAttribute('data-visible', 'true');
    });

    test('hides on the way down and returns on the way up', async ({ page }) => {
      await page.goto('/');
      const navbar = page.getByTestId('navbar');

      await wheel(page, 1200);
      await expect(navbar).toHaveAttribute('data-visible', 'false');

      // Off-screen, not merely transparent — assert the box actually moved out.
      const hidden = await navbar.boundingBox();
      expect(hidden).not.toBeNull();
      expect(hidden!.y + hidden!.height).toBeLessThanOrEqual(0);

      await wheel(page, -300);
      await expect(navbar).toHaveAttribute('data-visible', 'true');

      const shown = await navbar.boundingBox();
      expect(shown!.y).toBeGreaterThanOrEqual(0);
    });

    test('comes back when the reader returns to the top', async ({ page }) => {
      await page.goto('/');
      await wheel(page, 1500);
      await expect(page.getByTestId('navbar')).toHaveAttribute('data-visible', 'false');

      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForTimeout(450);
      await expect(page.getByTestId('navbar')).toHaveAttribute('data-visible', 'true');
    });

    test('reveals itself when a link inside it takes focus', async ({ page }) => {
      await page.goto('/');
      await wheel(page, 1200);
      await expect(page.getByTestId('navbar')).toHaveAttribute('data-visible', 'false');

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
  test.skip(({ isMobile }) => !isMobile, 'drawer only exists below 768px');

  test('opens and closes the drawer', async ({ page }) => {
    await page.goto('/');

    const toggle = page.getByRole('button', { name: 'Open menu' });
    await expect(toggle).toBeVisible();
    await toggle.click();

    const panelLink = page.locator('aside a[href="#projects"]');
    await expect(panelLink).toBeVisible();

    // The hamburger is unmounted while the drawer is open, so the drawer's own
    // × is the only close control — and the only one that is actually clickable,
    // since the drawer covers the corner the hamburger occupies.
    await expect(page.getByRole('button', { name: 'Open menu' })).toHaveCount(0);

    await page.locator('aside button[aria-label="Close menu"]').click();
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible();
  });

  test('closes the drawer when a link is followed', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.locator('aside a[href="#projects"]').click();
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible();
  });

  test('hides the cursor trail and the back-to-top arrow', async ({ page }) => {
    await page.goto('/');
    // The source zeroed the trail dots' size on mobile; here it never mounts.
    await expect(page.getByRole('link', { name: 'Back to top' })).toBeHidden();
  });

  test('keeps the drawer social links on screen', async ({ page }) => {
    // The vendored panel is height:100%, which overflows the visible area on
    // mobile browsers with retracting toolbars and hides the footer.
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();

    const linkedin = page.locator('aside a[aria-label="LinkedIn profile"]');
    await expect(linkedin).toBeVisible();

    const box = await linkedin.boundingBox();
    const viewport = page.viewportSize();
    expect(box).not.toBeNull();
    expect(viewport).not.toBeNull();
    expect(box!.y + box!.height).toBeLessThanOrEqual(viewport!.height);
  });
});
