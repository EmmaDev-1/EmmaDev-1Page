'use client';

import { motion } from 'motion/react';
import { NavLink, SocialIconLink } from '@/components/design-system';
import { ContactIconLink } from '@/components/ui/ContactIconLink';
import { navItems, profile } from '@/content';
import { BLUR_NONE } from '@/lib/brand';
import { whatsappHref } from '@/lib/contact';
import { DURATION, EASE } from '@/lib/motion';

/**
 * The desktop bar.
 *
 * Composed here rather than using the design system's NavBar, which fixes a
 * brand / links / slot flex row and an always-on glass background. The bar
 * now has a state the DS version does not: over the hero it is transparent and
 * borderless, so the headline meets the top of the screen with nothing in
 * front of it, and it only takes on glass and a hairline once there is content
 * to separate itself from.
 *
 * The items are still the DS's NavLink, so the signature hover — filled violet
 * pill with the triple glow, blooming over 500ms rather than snapping — is
 * the real one rather than a lookalike.
 */
export function TopBar({ activeHref, condensed }: { activeHref: string; condensed: boolean }) {
  return (
    <motion.header
      className="flex items-center justify-between gap-6 px-12 py-4"
      animate={{
        backgroundColor: condensed ? 'var(--surface-glass)' : 'rgba(21, 21, 21, 0)',
        backdropFilter: condensed ? 'blur(var(--blur-glass))' : BLUR_NONE,
        borderBottomColor: condensed ? 'var(--border-hairline)' : 'rgba(255, 255, 255, 0)',
      }}
      transition={{ duration: DURATION.slow, ease: EASE.standard }}
      style={{ borderBottomWidth: 1, borderBottomStyle: 'solid' }}
    >
      <a
        href="#home"
        className="font-mono text-label tracking-wide text-ink-300 uppercase transition-colors duration-normal ease-standard hover:text-ink-000"
      >
        EmmaDev
      </a>

      <nav aria-label="Main" className="flex items-center gap-1">
        {navItems.map((item) => (
          <NavLink key={item.href} href={item.href} active={item.href === activeHref}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        {profile.social.map((link) => (
          <SocialIconLink
            key={link.network}
            network={link.network}
            href={link.href}
            label={link.label}
            assetBase="/icons"
            size={26}
          />
        ))}

        {/*
          WhatsApp sits with the profiles but is not one: it opens a chat
          rather than a page about him, which is also why it stays out of
          `profile.social` — that list feeds the JSON-LD's `sameAs`, and a
          chat link is not something that verifies an identity.
        */}
        <ContactIconLink
          href={whatsappHref(profile.phone)}
          src="/icons/whatsapp.png"
          label="WhatsApp chat"
          size={26}
        />
      </div>
    </motion.header>
  );
}
