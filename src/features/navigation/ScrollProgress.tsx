'use client';

import { motion, useScroll, useSpring } from 'motion/react';

/**
 * A hairline of the brand gradient across the top of the viewport, filling as
 * the reader moves down the page.
 *
 * Two decisions worth naming. It is `scaleX` on a full-width element rather
 * than an animated `width`, so it runs on the compositor and never triggers
 * layout. And it is spring-damped rather than bound directly to scroll — raw
 * scroll progress on a 9,800px page is visibly jittery on a trackpad, where
 * the spring reads as the same "fluid" quality the design system asks for
 * everywhere else.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX, background: 'var(--gradient-brand)' }}
      className="fixed inset-x-0 top-0 z-[300] h-0.5 origin-left"
    />
  );
}
