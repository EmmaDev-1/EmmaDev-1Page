import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono, Varela_Round } from 'next/font/google';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { profile } from '@/content';
import { BRAND_GRAPHITE } from '@/lib/brand';
import { SITE_URL } from '@/lib/site';
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
  // The whole system is one graphite surface; there is no light mode.
  themeColor: BRAND_GRAPHITE,
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${varelaRound.variable} ${jetbrainsMono.variable}`}>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
