'use client';

import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { revealChild, staggerParent, STAGGER, VIEWPORT } from '@/lib/motion';

/**
 * Cascades its children into view one after another.
 *
 * The design system specifies a 120ms step between siblings. Doing that with
 * hand-written per-child delays is how a page ends up with twelve slightly
 * different rhythms; here the parent owns the timing and children just say
 * "I am a step in this cascade".
 */
export function Stagger({
  children,
  className,
  step = STAGGER,
  delay = 0,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  /** Seconds between siblings. */
  step?: number;
  /** Seconds to hold before the first child moves. */
  delay?: number;
  as?: 'div' | 'ul' | 'section';
}) {
  const Tag = motion[as];

  return (
    <Tag
      className={className}
      variants={staggerParent(step, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {children}
    </Tag>
  );
}

/** One step in a {@link Stagger}. Takes its timing from the parent. */
export function StaggerItem({
  children,
  className,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'li' | 'span' | 'p';
}) {
  const Tag = motion[as];

  return (
    <Tag className={className} variants={revealChild}>
      {children}
    </Tag>
  );
}
