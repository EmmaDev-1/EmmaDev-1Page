'use client';

import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { reveal, VIEWPORT } from '@/lib/motion';

/**
 * The page's default entrance: fade in, un-blur, travel into place.
 *
 * Replaces the design system's own Reveal at the app level. Same visual
 * grammar — the DS's 800ms outSoft blur-out is reproduced exactly in
 * lib/motion — but driven by Motion rather than a bare IntersectionObserver,
 * so it composes with stagger parents, scroll-linked values and exit
 * animations that the CSS version could not express.
 *
 * Reduced motion is handled globally by MotionConfig in the root layout, not
 * per component.
 */
type Props = {
  children: ReactNode;
  from?: 'up' | 'down' | 'left' | 'right' | 'none';
  /** Seconds. Use for a deliberate cascade between siblings. */
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'li' | 'header' | 'span';
};

export function Reveal({ children, from = 'up', delay = 0, className, as = 'div' }: Props) {
  const Tag = motion[as];

  return (
    <Tag
      className={className}
      variants={reveal(from)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      transition={{ delay }}
    >
      {children}
    </Tag>
  );
}
