'use client';

import { SocialIconLink } from '@/components/design-system';
import { LineReveal } from '@/components/motion/LineReveal';
import { Reveal } from '@/components/motion/Reveal';
import { profile } from '@/content';
import { whatsappHref } from '@/lib/contact';

/**
 * Closing panel.
 *
 * The design system's ui_kit specifies a footer and the previous build had
 * none — the page simply stopped after the CV, which leaves a portfolio
 * without the one thing it exists to prompt: getting in touch.
 *
 * Three ways to make contact, in the order someone is likely to want them: the
 * email in full, WhatsApp, then LinkedIn. All three were originally kept out
 * of the markup bar LinkedIn — the reasoning being that the CV holds them and
 * the CV is a download, so publishing them here only fed scrapers. The author
 * has since asked for each of the others in turn, which is his call to make:
 * the same CV is served from this site, so the addresses were public already,
 * and a portfolio that hides how to reach its author is working against itself.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();
  const linkedin = profile.social.find((link) => link.network === 'linkedin');
  const [emailLocalPart, emailDomain] = profile.email.split('@');

  const whatsapp = whatsappHref(profile.phone);

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

          {/*
            The two lighter channels, grouped: the email above is the primary
            one and keeps its own weight, while these two sit together as
            alternatives rather than as three equal shouts. gap-3 rather than
            the column's gap-8, so they read as a pair.
          */}
          <div className="flex flex-col items-start gap-3">
            {/*
              The number is the link text, for the same reason the address is
              above it: WhatsApp may not be installed, and a reader who wants to
              save the number or ring it instead still needs to be able to read
              and copy it. `tabular-nums` keeps the digit groups evenly spaced
              rather than letting the proportional font ripple them.
            */}
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="text-body-lg text-ink-300 underline decoration-strong underline-offset-8 transition-colors duration-normal ease-standard [font-variant-numeric:tabular-nums] hover:decoration-accent hover:text-ink-000"
            >
              {profile.phone} on WhatsApp
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
          </div>
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
