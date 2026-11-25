import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { UMAMI_WEBSITE_ID } from '@/lib/analytics';
import { UmamiAnalytics } from './UmamiAnalytics';

/**
 * Both halves of this component are a decision that fails silently if it
 * regresses, so both are asserted rather than trusted.
 *
 * The absent case is what keeps development and preview traffic out of the
 * dashboard — a default-on tracker would be indistinguishable from a working
 * one until the numbers were already wrong. The present case checks the two
 * attributes that make the proxy a proxy: a first-party script path, and a
 * relative `data-host-url`. An absolute host url would still send data, to
 * someone else's origin, which is the failure this is guarding.
 *
 * The script is looked for in `document.head`, not in the render container,
 * because React 19 hoists an `async` script out of the tree and into the head
 * on its own — which is where this one is written anyway, and which is why the
 * attribute assertions matter: they prove the `data-*` values survive that
 * move rather than being dropped with the element's position.
 */
const TRACKER = 'script[src="/stats/script.js"]';

function hoistedTracker(): HTMLScriptElement | null {
  return document.head.querySelector<HTMLScriptElement>(TRACKER);
}

describe('UmamiAnalytics', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    // React leaves a hoisted script in place across unmounts; without this,
    // one test's tag would satisfy the next test's assertions.
    hoistedTracker()?.remove();
  });

  it('renders nothing outside Vercel', () => {
    // `pnpm dev`, a local `pnpm start` and this suite: VERCEL_ENV is absent.
    vi.stubEnv('VERCEL_ENV', undefined);

    render(<UmamiAnalytics />);

    expect(hoistedTracker()).toBeNull();
  });

  it('renders nothing on a preview deployment', () => {
    vi.stubEnv('VERCEL_ENV', 'preview');

    render(<UmamiAnalytics />);

    expect(hoistedTracker()).toBeNull();
  });

  it('renders nothing in Vercel development', () => {
    vi.stubEnv('VERCEL_ENV', 'development');

    render(<UmamiAnalytics />);

    expect(hoistedTracker()).toBeNull();
  });

  it('renders a first-party async tracker on a production build', () => {
    vi.stubEnv('VERCEL_ENV', 'production');

    render(<UmamiAnalytics />);
    const script = hoistedTracker();

    expect(script).not.toBeNull();
    // Relative: the script is served by this origin, not cloud.umami.is.
    expect(script).toHaveAttribute('src', '/stats/script.js');
    expect(script).toHaveAttribute('data-website-id', UMAMI_WEBSITE_ID);
    // The beacon resolves against the page's own origin. Anything absolute
    // here pins it to a build-time domain; anything missing sends it to
    // gateway.umami.is, and both defeat the proxy.
    expect(script).toHaveAttribute('data-host-url', '/');
    // Must not block parsing or paint.
    expect(script).toHaveAttribute('async');
  });
});
