import { expect, test, type Page } from '@playwright/test';

/** The trail's dots. It renders nothing at all when it is not wanted. */
const CURSOR_TRAIL_DOTS = 'body > div[aria-hidden="true"] > span';

/**
 * Waits for the section `id` to come to rest flush with the top of the
 * viewport — that is, for a fragment scroll to have actually finished rather
 * than merely been started.
 */
async function landed(page: Page, id: string): Promise<void> {
  await page.waitForFunction(
    (target) => {
      const el = document.getElementById(target);
      return el !== null && Math.abs(el.getBoundingClientRect().top) < 4;
    },
    id,
    { timeout: 10_000 },
  );
}

/**
 * Where the section's first line of real text sits, in viewport coordinates.
 *
 * Walked rather than selected: which element carries a section's eyebrow is
 * the design system's business, and a test that hard-codes it would be
 * asserting markup instead of what a reader can see.
 */
async function firstTextTop(page: Page, id: string): Promise<number> {
  const top = await page.evaluate((target) => {
    const section = document.getElementById(target);
    if (!section) return null;
    const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      const parent = node.parentElement;
      if (node.textContent?.trim() && parent) {
        const box = parent.getBoundingClientRect();
        if (box.height > 0) return box.top;
      }
      node = walker.nextNode();
    }
    return null;
  }, id);

  expect(top, `no visible text found in #${id}`).not.toBeNull();
  return top as number;
}

/** The bottom edge of a chrome element, or null when it is not on screen. */
async function chromeBottom(page: Page, testId: string): Promise<number | null> {
  return page.evaluate((id) => {
    const el = document.querySelector(`[data-testid="${id}"]`);
    if (!el || el.getAttribute('data-visible') !== 'true') return null;
    if (Number(getComputedStyle(el).opacity) === 0) return null;
    return el.getBoundingClientRect().bottom;
  }, testId);
}

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

  test('offers the email as a real mailto link', async ({ page }) => {
    // The address is the link text on purpose: a reader with no mail client
    // registered still needs to be able to read and copy it.
    const email = page.getByRole('link', { name: 'emmanueldev3a@gmail.com' });
    await email.scrollIntoViewIfNeeded();
    await expect(email).toHaveAttribute('href', 'mailto:emmanueldev3a@gmail.com');
  });

  test('offers the phone as a WhatsApp chat, and as a readable number', async ({ page }) => {
    const chat = page.getByRole('link', { name: /WhatsApp/ });
    await chat.scrollIntoViewIfNeeded();

    // wa.me takes the country code and digits only — no `+`, spaces or dashes.
    // The visible text keeps all three, so the two are asserted separately:
    // the href is what opens the chat, the text is what can be copied or
    // dialled by someone without WhatsApp installed.
    await expect(chat).toHaveAttribute('href', 'https://wa.me/527717774411');
    await expect(chat).toContainText('+52 771 777 4411');
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

  test.describe('cursor trail', () => {
    test('runs where there is a pointer and room for it', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator(CURSOR_TRAIL_DOTS)).toHaveCount(13);
    });

    test('drops away on a phone-sized viewport even with a mouse', async ({ page }) => {
      /*
       * The gap the vendored guard leaves: it asks only for a precise pointer,
       * which a phone or tablet with a Bluetooth mouse or a stylus reports, so
       * thirteen dots ended up following nothing on a phone. This project has a
       * real pointer throughout, so narrowing the viewport isolates the width
       * clause — and proves the query is watched rather than read once at mount.
       */
      await page.goto('/');
      await expect(page.locator(CURSOR_TRAIL_DOTS)).toHaveCount(13);

      await page.setViewportSize({ width: 390, height: 800 });
      await expect(page.locator(CURSOR_TRAIL_DOTS)).toHaveCount(0);

      await page.setViewportSize({ width: 1440, height: 900 });
      await expect(page.locator(CURSOR_TRAIL_DOTS)).toHaveCount(13);
    });
  });

  test.describe('jump-link landing', () => {
    /**
     * Sections land flush with the top of the viewport.
     *
     * The offset is declared in exactly one place, `scroll-padding-top` on
     * <html>. It is asserted here because the two ways of setting it stack
     * rather than override: per the CSS Scroll Snap spec the container's
     * scroll-padding and the target's scroll-margin are summed, so a
     * `scroll-mt-*` added to a section later would silently push every
     * landing down again — which is exactly how this broke once before.
     */
    for (const href of ['#about', '#projects', '#experience', '#curriculum']) {
      test(`lands ${href} flush with the top of the viewport`, async ({ page }) => {
        await page.goto('/');
        await page.click(`header a[href="${href}"]`);
        await page.waitForTimeout(1500);

        const top = await page.locator(href).evaluate((el) => el.getBoundingClientRect().top);

        // Zero, not one offset and not two.
        expect(Math.abs(top)).toBeLessThan(4);
      });
    }

    test('keeps the bar off the section it lands on', async ({ page }) => {
      /*
       * Sections land at y=0 and carry no scroll offset, so the only thing
       * keeping the bar off their first line is the section's own top padding
       * — 80px against a bar ending at 77px. That is a floor, and it has been
       * dropped through twice: once by removing the offset, once by trimming
       * the padding to 48px. Both times the eyebrow ended up underneath.
       *
       * Jumping *upward* is the case that exposes it, and the only way to land
       * at y=0 with the bar still on screen, since scrolling down hides it.
       */
      await page.goto('/');
      await page.waitForTimeout(800);

      await page.evaluate(() =>
        document.getElementById('curriculum')?.scrollIntoView({ behavior: 'instant' }),
      );
      await page.waitForTimeout(600);
      // Nudged until the bar is actually back, not once and hoped: it is off
      // screen down here, and an unrevealed bar makes the link unclickable.
      await scrollUntil(page, 'navbar', 'true', -250);

      await page.click('header a[href="#about"]');
      await landed(page, 'about');

      const barBottom = await chromeBottom(page, 'navbar');
      expect(barBottom, 'the bar should still be on screen after jumping up').not.toBeNull();
      expect(await firstTextTop(page, 'about')).toBeGreaterThanOrEqual(barBottom as number);
    });

    test('travels between sections rather than cutting to them', async ({ page }) => {
      /*
       * Smoothness is no longer declared in the stylesheet — it is switched on
       * after hydration so that a cold arrival at a shared link lands
       * instantly. That makes it something script can now fail to do, so the
       * animation is asserted rather than assumed.
       *
       * Counted in scroll positions rather than timed: a jump passes through
       * two, an animation through many.
       */
      await page.goto('/');
      await page.waitForTimeout(1000);

      const sampling = page.evaluate(() => {
        const seen = new Set<number>();
        const until = performance.now() + 2000;
        return new Promise<number>((resolve) => {
          const tick = () => {
            seen.add(Math.round(window.scrollY));
            if (performance.now() < until) requestAnimationFrame(tick);
            else resolve(seen.size);
          };
          requestAnimationFrame(tick);
        });
      });

      await page.click('header a[href="#curriculum"]');
      expect(await sampling).toBeGreaterThan(5);
    });
  });

  test.describe('hide on scroll', () => {
    test('stays visible at the top of the page', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByTestId('navbar')).toHaveAttribute('data-visible', 'true');
    });

    test('hides on the way down and returns on the way up', async ({ page }) => {
      await page.goto('/');
      const navbar = page.getByTestId('navbar');

      /*
       * Both positions are polled rather than read once. `data-visible` flips
       * the instant the state changes, but the bar travels there over a CSS
       * transition — sampling the box the moment the attribute flips catches
       * it mid-flight (measured at y=-74 of a 77px bar) and fails for a
       * reason that has nothing to do with the behaviour under test.
       */
      await scrollUntil(page, 'navbar', 'false', 1200);

      // Off-screen, not merely transparent — assert the box actually moved out.
      await expect
        .poll(async () => {
          const box = await navbar.boundingBox();
          return box === null ? null : box.y + box.height;
        })
        .toBeLessThanOrEqual(0);

      await scrollUntil(page, 'navbar', 'true', -300);

      await expect
        .poll(async () => (await navbar.boundingBox())?.y ?? null)
        .toBeGreaterThanOrEqual(0);
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

test.describe('the URL follows the reader', () => {
  test('writes the section being read without a click', async ({ page }) => {
    await page.goto('/');
    // Arrives with no fragment, and scrolling alone is enough to earn one.
    expect(new URL(page.url()).hash).toBe('');

    await page.getByRole('heading', { name: 'Projects' }).scrollIntoViewIfNeeded();
    await expect.poll(() => new URL(page.url()).hash, { timeout: 5000 }).toBe('#projects');
  });

  test('drops the fragment again at the top of the page', async ({ page }) => {
    await page.goto('/#projects');
    await expect.poll(() => new URL(page.url()).hash, { timeout: 5000 }).toBe('#projects');

    // Let the arrival land before starting a second scroll. `scroll-behavior:
    // smooth` applies to the fragment scroll on load too, and a scrollTo issued
    // while that is still travelling loses to it — the page ends up back at
    // #projects and the assertion below fails for a reason that has nothing to
    // do with what this test is about.
    await landed(page, 'projects');

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await expect.poll(() => new URL(page.url()).hash, { timeout: 5000 }).toBe('');
  });

  test('never pushes a history entry for scrolling', async ({ page }) => {
    await page.goto('/');
    const before = await page.evaluate(() => history.length);

    await page.getByRole('heading', { name: 'Experience' }).scrollIntoViewIfNeeded();
    await expect.poll(() => new URL(page.url()).hash, { timeout: 5000 }).toBe('#experience');

    // replaceState, not a hash assignment: reading the page is not navigation,
    // so `back` must still leave the site rather than retrace the scroll.
    expect(await page.evaluate(() => history.length)).toBe(before);
  });

  test('neither blanks nor walks a shared deep link on arrival', async ({ page }) => {
    /*
     * Two ways the sync could damage an incoming fragment, both measured
     * happening before they were suppressed:
     *
     *   - Blanking it. The spy mounts holding its "home" fallback, so writing
     *     on that first pass rewrites a shared /#experience to `/` before the
     *     browser has travelled anywhere.
     *   - Walking it. A load fires no `hashchange` to announce its scroll, so
     *     with nothing suspending it the address stepped through #about and
     *     #projects on the way down.
     *
     * The fragment must therefore be #experience at every sample, never blank
     * and never a section merely passed over.
     */
    await page.goto('/#experience');

    const seen = new Set<string>();
    for (let i = 0; i < 12; i += 1) {
      await page.waitForTimeout(250);
      seen.add(new URL(page.url()).hash);
    }

    expect([...seen]).toEqual(['#experience']);
  });

  test('puts a shared deep link on its section, cold load and all', async ({ page }) => {
    /*
     * The arrival is a jump rather than an animation, which is what makes this
     * assertable at all. `scroll-behavior: smooth` governs the browser's own
     * scroll to a fragment, and that one runs while the page is still parsing
     * and decoding media — starved of main thread, it stops partway and parks
     * the reader on the wrong section. Measured over eight parallel cold
     * loads: 5 of 8 stopped short with smooth declared in the stylesheet, 0 of
     * 8 once it was switched on after hydration instead.
     */
    await page.goto('/#experience');
    await landed(page, 'experience');
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

  test('keeps the toggle off the section it lands on', async ({ page }) => {
    /*
     * The phone's counterpart to the desktop clearance test, and the tighter
     * of the two: the toggle disc ends at 66px against the same 80px of
     * section padding, and Projects and Career left-align their eyebrow into
     * exactly the corner the disc occupies. Trimming the padding to 24px put
     * "02 — Work" underneath it — measured, which is why phones kept the full
     * 80px when desktop was halved.
     */
    await page.goto('/');
    await page.waitForTimeout(800);

    // Deep, then reveal the toggle, then jump back up through the menu.
    await page.evaluate(() =>
      document.getElementById('curriculum')?.scrollIntoView({ behavior: 'instant' }),
    );
    await page.waitForTimeout(600);
    await scrollUntil(page, 'nav-toggle', 'true', -250);

    await page.getByRole('button', { name: 'Open menu' }).click();
    await menu(page).getByRole('link', { name: 'Projects' }).click();
    await landed(page, 'projects');

    const discBottom = await chromeBottom(page, 'nav-toggle');
    expect(discBottom, 'the toggle should be on screen after jumping up').not.toBeNull();
    expect(await firstTextTop(page, 'projects')).toBeGreaterThanOrEqual(discBottom as number);
  });

  test('closes the menu when a link is followed', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    await menu(page).getByRole('link', { name: 'Projects' }).click();
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible();
  });

  test('never mounts the cursor trail on a touch device', async ({ page }) => {
    await page.goto('/');
    // Not rendered at all, rather than rendered and hidden.
    await expect(page.locator(CURSOR_TRAIL_DOTS)).toHaveCount(0);
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
