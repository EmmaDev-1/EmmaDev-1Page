import type { NextConfig } from 'next';
import { UMAMI_CLOUD_SCRIPT_URL, UMAMI_SCRIPT_PATH } from './src/lib/analytics';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // The design system ships .jsx components with sibling .d.ts declarations.
  typescript: { ignoreBuildErrors: false },

  images: {
    // Portfolio media is local; AVIF first, WebP as the fallback.
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [420, 640, 828, 1080, 1200, 1920],
  },

  // The site is a single static page — no dynamic data, no runtime secrets.
  poweredByHeader: false,

  /**
   * The analytics tracker, served from this origin instead of Umami Cloud's.
   *
   * Half of the proxy; the other half is `src/app/api/send/route.ts`, which
   * carries the beacon and has to be a function because it rewrites headers.
   * This half is a plain `GET` of an unchanged file, so a rewrite is the whole
   * job — and better than a function would be, since Vercel's CDN serves it
   * and the upstream's own cache headers survive.
   *
   * Returned bare rather than under `beforeFiles`: nothing exists at this path
   * on disk, so letting the filesystem look first costs nothing and keeps the
   * rewrite from shadowing a real file added here later.
   *
   * `lib/analytics.ts` holds both ends of the mapping, so the path in the
   * script tag and the path matched here cannot drift apart.
   */
  async rewrites() {
    return [{ source: UMAMI_SCRIPT_PATH, destination: UMAMI_CLOUD_SCRIPT_URL }];
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
      {
        // Encoded media is content-hashed by the build pipeline.
        source: '/media/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default nextConfig;
