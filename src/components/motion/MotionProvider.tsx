'use client';

import { MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

/**
 * Motion's reduced-motion contract for the whole tree.
 *
 * `reducedMotion="user"` makes Motion drop transforms and keep opacity for
 * anyone whose system asks for less movement — the animation still resolves,
 * so nothing is left invisible, it simply stops travelling.
 *
 * This is the other half of a pair. globals.css already collapses CSS
 * transition and animation durations under the same media query, which covers
 * the design system's own hovers and continuous loops; Motion animates through
 * inline styles and WAAPI, which that rule cannot reach. Both are needed.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
