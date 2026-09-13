import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono, Varela_Round } from 'next/font/google';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { profile } from '@/content';
import { BRAND_GRAPHITE, BRAND_PAPER } from '@/lib/brand';
import { SITE_URL } from '@/lib/site';
import { themeBootScript } from '@/lib/theme';
import '@/styles/globals.css';

/**
 * Both faces are self-hosted through next/font. The design system's
 * tokens/fonts.css pulls them from the Google CDN instead, which costs a
 * render-blocking third-party round trip and risks a layout shift; next/font
 * inlines the @font-face at build time and serves the files from our origin.
 * The token values are re-bound to these CSS variables in globals.css.
 */
const varelaRound = Varela_Round({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-varela-round',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

const description =
  'Portfolio of Emmanuel, a frontend engineer building mobile apps with Flutter and Dart.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s · ${profile.name}`,
  },
  description,
  applicationName: `${profile.name} Portfolio`,
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  keywords: ['frontend engineer', 'portfolio', 'Flutter', 'Dart', 'mobile development', 'C#'],
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: `${profile.name} — ${profile.role}`,
    title: `${profile.name} — ${profile.role}`,
    description,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${profile.name} — ${profile.role}`,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: { canonical: '/' },
};

export const viewport: Viewport = {
  /*
    Two values, matched on the system preference rather than on the reader's
    stored choice — a meta tag cannot see localStorage. It is therefore right
    for anyone who has not overridden their system, and one shade out for
    anyone who has; the alternative is being wrong for everyone on light.
  */
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: BRAND_GRAPHITE },
    { media: '(prefers-color-scheme: light)', color: BRAND_PAPER },
  ],
  // Both, now that there are two: this is what themes the scrollbar and any
  // form control the browser draws itself.
  colorScheme: 'light dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /*
      suppressHydrationWarning because the boot script below adds `data-theme`
      to this element before React reaches it. The warning would be correct —
      the served markup really does differ from what React expects — and
      wrong to act on, since that difference is the entire point.
    */
    <html
      lang="en"
      className={`${varelaRound.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Blocking, inline, and before anything paints. The page is prerendered
          with no idea who is reading it, so the theme can only be resolved
          here; resolving it in a component would show every light-mode reader
          a black page first and then take it away.
        */}
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
