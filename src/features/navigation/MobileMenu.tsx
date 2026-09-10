'use client';

import { AnimatePresence, motion } from 'motion/react';
import { navItems, profile } from '@/content';
import { SocialIconLink } from '@/components/design-system';
import { ContactIconLink } from '@/components/ui/ContactIconLink';
import { Icon } from '@/components/ui/Icon';
import { whatsappHref } from '@/lib/contact';
import { DURATION, EASE, lineMask } from '@/lib/motion';

/**
 * Full-screen menu, replacing the design system's 75%-width side drawer.
 *
 * The drawer was a faithful port of the source site, but it left the page
 * showing through beside it and put five links in a column at body size — on a
 * phone that reads like a settings list, not like the front door of a
 * portfolio. Full-bleed display type with the section index beside each item
 * gives the same five destinations the weight the rest of the page has.
 *
 * The graphite ground is opaque rather than a scrim: the design system has one
 * background colour, and letting a blurred page show through would invent a
 * second surface it does not define.
 */
export function MobileMenu({
  open,
  activeHref,
  onClose,
}: {
  open: boolean;
  activeHref: string;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[900] flex flex-col justify-center bg-page px-5 nav:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.normal, ease: EASE.standard }}
        >
          <div className="bloom-hero" aria-hidden="true" />

          {/*
            The overlay sits above the hamburger, so the hamburger cannot be
            the way out. This is the only close control while the menu is open.
          */}
          <motion.button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="absolute top-5 right-5 flex size-11 items-center justify-center rounded-pill border border-hairline text-ink-100"
            initial={{ opacity: 0, rotate: -45 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.normal, ease: EASE.outSoft, delay: 0.1 }}
            whileTap={{ scale: 0.97 }}
          >
            <Icon name="close" size={22} />
          </motion.button>

          <nav aria-label="Main" className="relative">
            <ul className="flex list-none flex-col gap-2 p-0">
              {navItems.map((item, index) => {
                const active = item.href === activeHref;

                return (
                  <li key={item.href} className="overflow-hidden">
                    <motion.a
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? 'page' : undefined}
                      className="flex items-baseline gap-4 py-2"
                      variants={lineMask}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      // Each line follows the one above it, so the menu opens
                      // as a cascade rather than a block.
                      transition={{
                        duration: DURATION.slow,
                        ease: EASE.outExpo,
                        delay: 0.06 + index * 0.05,
                      }}
                    >
                      <span className="font-mono text-micro tracking-wide text-accent">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={`text-display-2 leading-tight tracking-display ${
                          active ? 'text-ink-000' : 'text-ink-300'
                        }`}
                      >
                        {item.label}
                      </span>
                    </motion.a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <motion.div
            className="relative mt-16 flex items-center gap-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.slow, ease: EASE.outSoft, delay: 0.3 }}
          >
            {profile.social.map((link) => (
              <SocialIconLink
                key={link.network}
                network={link.network}
                href={link.href}
                label={link.label}
                assetBase="/icons"
                size={28}
              />
            ))}

            {/*
              The same row as the desktop bar's. It has to be here too, not
              only in TopBar: below 768px that bar does not render at all, so
              this menu *is* the nav, and leaving WhatsApp out of it would hide
              the contact from exactly the readers most likely to tap it.
            */}
            <ContactIconLink
              href={whatsappHref(profile.phone)}
              src="/icons/whatsapp.png"
              label="WhatsApp chat"
              size={28}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
