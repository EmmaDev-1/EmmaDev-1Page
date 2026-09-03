import { GradientText, SocialIconLink } from '@/components/design-system';
import { profile, SECTION_IDS } from '@/content';

/**
 * Opening screen. The source hero was an <h2> with the gradient sweep and the
 * two social icons underneath; this keeps both, promotes the line to the page's
 * single <h1>, and adds the one background event the design system sanctions —
 * a soft brand bloom at 13% behind 120px of blur.
 */
export function HeroSection() {
  return (
    <section
      id={SECTION_IDS.home}
      className="relative flex min-h-[calc(100svh-var(--nav-height))] flex-col items-center justify-center overflow-hidden px-5 py-20 text-center nav:px-12"
    >
      <div className="bloom-hero" aria-hidden="true" />

      <div className="relative z-10 flex flex-col items-center gap-10">
        <p className="font-mono text-micro tracking-wide text-ink-300 uppercase">{profile.role}</p>

        <GradientText
          as="h1"
          speed="4s"
          className="m-0 max-w-[16ch] text-display-1 leading-tight tracking-display text-balance"
        >
          {profile.headline}
        </GradientText>

        <ul className="flex list-none items-center gap-4 p-0">
          {profile.social.map((link) => (
            <li key={link.network}>
              <SocialIconLink
                network={link.network}
                href={link.href}
                label={link.label}
                assetBase="/icons"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
