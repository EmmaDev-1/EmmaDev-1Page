'use client';

import { SocialIconLink } from '@/components/design-system';
import { LineReveal } from '@/components/motion/LineReveal';
import { Reveal } from '@/components/motion/Reveal';
import { profile } from '@/content';

/**
 * Closing panel.
 *
 * The design system's ui_kit specifies a footer and the previous build had
 * none — the page simply stopped after the CV, which leaves a portfolio
 * without the one thing it exists to prompt: getting in touch.
 *
 * Contact runs through LinkedIn rather than a mailto. The CV carries two email
 * addresses and a phone number, but those reach the reader inside a downloaded
 * PDF; putting them in page markup publishes them to every scraper that walks
 * the site. LinkedIn is the channel that is already public by design.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();
  const linkedin = profile.social.find((link) => link.network === 'linkedin');

  return (
    <footer className="relative overflow-hidden border-t border-hairline px-5 py-24 nav:px-12">
      <div className="bloom-hero opacity-60" aria-hidden="true" />

      <div className="relative mx-auto flex w-full max-w-content flex-col gap-16">
        <Reveal className="flex flex-col items-start gap-8">
          <p className="m-0 font-mono text-micro tracking-wide text-accent uppercase">
            Get in touch
          </p>

          <h2 className="m-0 max-w-[18ch] text-display-2 leading-tight tracking-display text-heading">
            <LineReveal lines={['Have a project', 'in mind?']} />
          </h2>

          {linkedin ? (
            <a
              href={linkedin.href}
              target="_blank"
              rel="noreferrer"
              className="text-body-lg text-ink-100 underline decoration-strong underline-offset-8 transition-colors duration-normal ease-standard hover:decoration-accent hover:text-ink-000"
            >
              Reach me on LinkedIn
            </a>
          ) : null}
        </Reveal>

        <div className="flex flex-col-reverse items-start justify-between gap-8 border-t border-hairline pt-8 nav:flex-row nav:items-center">
          <p className="m-0 font-mono text-micro tracking-wide text-faint uppercase">
            © {year} {profile.name} — {profile.role}
          </p>

          <ul className="m-0 flex list-none items-center gap-4 p-0">
            {profile.social.map((link) => (
              <li key={link.network}>
                <SocialIconLink
                  network={link.network}
                  href={link.href}
                  label={link.label}
                  assetBase="/icons"
                  size={26}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
