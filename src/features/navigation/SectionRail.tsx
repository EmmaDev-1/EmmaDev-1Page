'use client';

import { motion } from 'motion/react';
import { navItems } from '@/content';
import { DURATION, EASE } from '@/lib/motion';

/**
 * A vertical index of the page, pinned to the right edge.
 *
 * The top bar tells you where you can go; this tells you where you *are*, at a
 * glance, without reading. Each section is a dash that grows and fills with
 * the brand gradient when it is the one in view, and reveals its label on
 * hover or keyboard focus.
 *
 * Only shown on wide screens. Below that it would compete with the content for
 * the same 20px gutter the design system reserves, and the mobile menu already
 * covers the same job.
 */
export function SectionRail({ activeHref }: { activeHref: string }) {
  return (
    <nav
      aria-label="Sections"
      className="fixed top-1/2 right-6 z-[150] hidden -translate-y-1/2 xl:block"
    >
      <ul className="flex list-none flex-col items-end gap-4 p-0">
        {navItems.map((item) => {
          const active = item.href === activeHref;

          return (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={active ? 'true' : undefined}
                className="group flex items-center justify-end gap-3 py-1"
              >
                <span
                  className={`font-mono text-micro tracking-wide uppercase transition-all duration-normal ease-standard ${
                    active ? 'text-ink-100' : 'text-ink-400'
                  } translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100`}
                >
                  {item.label}
                </span>

                <motion.span
                  aria-hidden="true"
                  className="block h-0.5 rounded-pill"
                  // The dash is the state: length and fill both carry it, so it
                  // still reads for anyone who cannot separate the two colours.
                  animate={{
                    width: active ? 28 : 12,
                    opacity: active ? 1 : 0.45,
                  }}
                  transition={{ duration: DURATION.normal, ease: EASE.outSoft }}
                  style={{
                    background: active ? 'var(--gradient-brand)' : 'var(--border-strong)',
                  }}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
