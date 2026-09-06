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
  const [emailLocalPart, emailDomain] = profile.email.split('@');

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

          {/*
            The address itself is the link text rather than a "Email me" label.
            A reader who wants to write from their own client needs to be able
            to read and copy it, not just trigger a mailto: their machine may
            have nothing registered to handle.
          */}
          {/*
            Sized down on phones: at display-2 a 23-character address is wider
            than a 390px viewport and gets clipped mid-domain. `anywhere` is the
            belt-and-braces — it lets the address wrap rather than overflow at
            any width, however narrow — but the <wbr> after the "@" is what it
            normally breaks on, so on a 320px screen the address splits at its
            own seam instead of stranding a single letter on the second line.
            <wbr> contributes no text, so the accessible name and anything
            copied off the page are still the whole address.

            skip-ink off because at this size the underline otherwise breaks
            around the descenders in "@" and "g", which reads as a rendering
            fault rather than as one continuous rule.

            Both sizes are the heading-2 / display-2 tokens scaled to 80% via
            calc(), at the author's request for a smaller footer email — not a
            new hardcoded size, so it still tracks the token if the scale ever
            changes upstream.
          */}
          <a
            href={`mailto:${profile.email}`}
            className="text-[calc(var(--text-heading-2)*0.8)] leading-tight tracking-display text-heading underline decoration-strong underline-offset-[0.15em] [overflow-wrap:anywhere] [text-decoration-skip-ink:none] transition-colors duration-normal ease-standard nav:text-[calc(var(--text-display-2)*0.8)] hover:decoration-accent hover:text-ink-000"
          >
            {emailLocalPart}@<wbr />
            {emailDomain}
          </a>

          {linkedin ? (
            <a
              href={linkedin.href}
              target="_blank"
              rel="noreferrer"
              className="text-body-lg text-ink-300 underline decoration-strong underline-offset-8 transition-colors duration-normal ease-standard hover:decoration-accent hover:text-ink-000"
            >
              or reach me on LinkedIn
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
