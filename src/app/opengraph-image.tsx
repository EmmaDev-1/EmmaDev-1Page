import { ImageResponse } from 'next/og';
import { profile } from '@/content';
import {
  BRAND_GRADIENT,
  BRAND_GRADIENT_WIDE,
  BRAND_GRAPHITE,
  BRAND_INK_MUTED,
  OG_BLOOM_BLUR,
} from '@/lib/brand';

/**
 * Social preview card, generated at build time.
 *
 * Renders the brand in its own language rather than screenshotting the page:
 * graphite ground, the violet-to-ember gradient on the name, mono metadata.
 * The source site had no OG image at all, so links to it unfurled as bare URLs.
 *
 * Colours come from lib/brand rather than tokens because Satori — the renderer
 * behind ImageResponse — resolves no cascade and therefore no `var()`.
 */
export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 80,
        backgroundColor: BRAND_GRAPHITE,
        position: 'relative',
      }}
    >
      {/* The one sanctioned background event: a soft brand bloom. */}
      <div
        style={{
          position: 'absolute',
          top: -200,
          left: -100,
          width: 900,
          height: 600,
          background: BRAND_GRADIENT_WIDE,
          opacity: 0.22,
          filter: OG_BLOOM_BLUR,
          display: 'flex',
        }}
      />

      <div
        style={{
          display: 'flex',
          fontSize: 22,
          letterSpacing: 6,
          textTransform: 'uppercase',
          color: BRAND_INK_MUTED,
          marginBottom: 28,
        }}
      >
        {profile.role}
      </div>

      <div
        style={{
          display: 'flex',
          fontSize: 92,
          lineHeight: 1.06,
          letterSpacing: -2,
          backgroundImage: BRAND_GRADIENT,
          backgroundClip: 'text',
          color: 'transparent',
          maxWidth: 900,
        }}
      >
        {profile.headline}
      </div>

      <div
        style={{
          display: 'flex',
          marginTop: 48,
          width: 120,
          height: 3,
          background: BRAND_GRADIENT,
        }}
      />
    </div>,
    size,
  );
}
