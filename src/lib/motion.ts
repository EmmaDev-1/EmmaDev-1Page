import type { Transition, Variants } from 'motion/react';
import { BLUR_NONE, BLUR_VEIL } from './brand';

/**
 * The design system's motion vocabulary, expressed for Motion.
 *
 * The DS defines movement in CSS custom properties (tokens/motion.css) and
 * calls motion "the brand": nothing appears without moving. Motion needs
 * numbers, not `var()` strings, so this file is the one sanctioned translation
 * of those tokens — every animation in the app composes from here rather than
 * inventing its own timing, which is what stops a page of hand-tuned durations
 * drifting away from the brand.
 *
 * Values MUST stay in step with src/styles/design-system/tokens/motion.css.
 */

/** Seconds. Mirrors --dur-*. */
export const DURATION = {
  instant: 0.12,
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  reveal: 0.8,
  revealLong: 1.2,
} as const;

type Bezier = [number, number, number, number];

/** Mirrors --ease-*. */
export const EASE: Record<'standard' | 'outSoft' | 'outExpo' | 'settle', Bezier> = {
  standard: [0.4, 0, 0.2, 1],
  outSoft: [0.16, 1, 0.3, 1],
  outExpo: [0.19, 1, 0.22, 1],
  /** The source's bounce-in-place. Overshoots — never use it on opacity. */
  settle: [0.34, 1.56, 0.64, 1],
};

/** Seconds between siblings. Mirrors --stagger-step. */
export const STAGGER = 0.12;

/** Distance the DS gives a vertical entrance. */
const RISE = 40;

/**
 * Shared viewport trigger. `amount` matches the threshold the DS's own Reveal
 * uses, so scroll-triggered content starts at the same point it always has.
 */
export const VIEWPORT = { once: true, amount: 0.15 } as const;

export const revealTransition: Transition = {
  duration: DURATION.reveal,
  ease: EASE.outSoft,
};

/**
 * The DS entrance: fade in, un-blur, and travel. `from` picks the direction —
 * the DS alternates media and copy down a page of two-column rows.
 */
export function reveal(from: 'up' | 'down' | 'left' | 'right' | 'none' = 'up'): Variants {
  const offset = {
    up: { y: RISE },
    down: { y: -RISE },
    left: { x: '-12%' },
    right: { x: '12%' },
    none: {},
  }[from];

  return {
    hidden: { opacity: 0, filter: BLUR_VEIL, ...offset },
    visible: {
      opacity: 1,
      filter: BLUR_NONE,
      x: 0,
      y: 0,
      transition: revealTransition,
    },
  };
}

/**
 * Parent that hands its children a staggered entrance. Pair with `revealChild`.
 * `delayChildren` lets a section hold before its contents cascade.
 */
export function staggerParent(stagger = STAGGER, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  };
}

/** Child of `staggerParent`. Its timing comes from the parent, not from itself. */
export const revealChild: Variants = reveal('up');

/**
 * Headline treatment: each line rises out from behind a mask. Used for the
 * one gradient headline per screen the DS allows.
 *
 * The mask is an `overflow: hidden` wrapper the caller supplies — this only
 * describes the travel, so the same variant works for any line height.
 */
export const lineMask: Variants = {
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: { duration: DURATION.revealLong, ease: EASE.outExpo },
  },
};

/** Hover lift the DS specifies: -4px and brighter, never darker. */
export const HOVER_LIFT = { y: -4 } as const;

/** Press feedback: scale(0.97), no colour change. */
export const TAP_PRESS = { scale: 0.97 } as const;

export const hoverTransition: Transition = {
  duration: DURATION.normal,
  ease: EASE.standard,
};
