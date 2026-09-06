'use client';

import { motion } from 'motion/react';
import { lineMask, staggerParent, VIEWPORT } from '@/lib/motion';

/**
 * Headline treatment: each line rises out from behind its own mask.
 *
 * This is the entrance for the one gradient headline per screen the design
 * system allows. It reads as deliberate rather than decorative because the
 * mask is real — each line sits in an `overflow: hidden` box and travels from
 * fully below it, so the type appears to be revealed rather than faded in.
 *
 * Lines are supplied already split. Splitting prose by character would put a
 * span around every letter, which wrecks the accessible name and lets a
 * screen reader announce the heading letter by letter; lines keep the text
 * intact as far as assistive technology is concerned.
 */
export function LineReveal({
  lines,
  className,
  lineClassName,
  delay = 0,
  step = 0.09,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  /** Seconds before the first line moves. */
  delay?: number;
  /** Seconds between lines. */
  step?: number;
}) {
  return (
    <motion.span
      className={className}
      variants={staggerParent(step, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      // The visible text is the joined lines; the per-line boxes below are
      // presentational, so the whole thing is announced as one string.
      aria-label={lines.join(' ')}
    >
      {lines.map((line) => (
        <span
          key={line}
          aria-hidden="true"
          className="block overflow-hidden"
          // A mask that clips exactly at the text box would shave descenders,
          // so the box is allowed a little vertical air to clip against.
          style={{ paddingBottom: '0.08em', marginBottom: '-0.08em' }}
        >
          <motion.span className={`block ${lineClassName ?? ''}`} variants={lineMask}>
            {line}
            {/*
              Each line is its own block, so without this the lines run
              together in textContent — "Emmanuela FrontEnd Engineer". Screen
              readers are covered by the aria-label above, but textContent is
              what a crawler indexes and what a reader gets when they copy the
              heading. A trailing space in a block box renders as nothing.
            */}{' '}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
