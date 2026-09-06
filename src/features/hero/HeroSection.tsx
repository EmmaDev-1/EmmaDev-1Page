'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Button, GradientText, SocialIconLink } from '@/components/design-system';
import { LineReveal } from '@/components/motion/LineReveal';
import { Icon } from '@/components/ui/Icon';
import { profile, SECTION_IDS } from '@/content';
import { DURATION, EASE } from '@/lib/motion';

/**
 * The opening screen.
 *
 * Everything above the fold animates on mount rather than on scroll — a
 * `whileInView` hero is already in view on load, so it would either fire
 * instantly (wasting the choreography) or, worse, sit invisible if the
 * observer is slow. The order is deliberate: eyebrow, then the headline rising
 * line by line out of its mask, then the tagline, then the things you can act
 * on. It reads as an introduction being made, which is what a portfolio hero is.
 *
 * The two calls to action and the tagline are the design system's own hero
 * specification, which the previous build never implemented — the page had no
 * primary action at all.
 */
export function HeroSection() {
  const ref = useRef<HTMLElement>(null);

  /*
   * Scroll-linked exit. The hero drifts up at half the scroll rate and fades
   * as it leaves, so the About section feels like it is arriving over the top
   * of it rather than following it in a queue. `offset` measures from the
   * element's own start to its end, so this is independent of hero height.
   */
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const bloomScale = useTransform(scrollYProgress, [0, 1], [1, 1.35]);

  return (
    <section
      ref={ref}
      id={SECTION_IDS.home}
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 py-24 text-center nav:px-12"
    >
      <motion.div className="bloom-hero" aria-hidden="true" style={{ scale: bloomScale }} />

      <motion.div
        className="relative z-10 flex flex-col items-center gap-8"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.p
          className="font-mono text-label tracking-widest text-ink-300 uppercase"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, ease: EASE.outSoft }}
        >
          {profile.name} &nbsp;·&nbsp; {profile.role}
        </motion.p>

        <GradientText
          as="h1"
          speed="4s"
          className="m-0 max-w-[18ch] text-display-1 leading-tight tracking-display"
        >
          <LineReveal lines={profile.headlineLines} delay={0.15} lineClassName="pb-1" />
        </GradientText>

        <motion.p
          className="m-0 max-w-[46ch] text-body-lg leading-relaxed text-ink-300 text-pretty"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.reveal, ease: EASE.outSoft, delay: 0.55 }}
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.reveal, ease: EASE.outSoft, delay: 0.7 }}
        >
          <Button
            variant="gradient"
            size="lg"
            href={`#${SECTION_IDS.projects}`}
            iconRight={<Icon name="arrowRight" size={18} />}
          >
            See my work
          </Button>
          <Button
            variant="outline"
            size="lg"
            href={`#${SECTION_IDS.curriculum}`}
            iconRight={<Icon name="download" size={18} />}
          >
            Resume
          </Button>
        </motion.div>

        <motion.ul
          className="flex list-none items-center gap-4 p-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: DURATION.reveal, ease: EASE.outSoft, delay: 0.85 }}
        >
          {profile.social.map((link) => (
            <li key={link.network}>
              <SocialIconLink
                network={link.network}
                href={link.href}
                label={link.label}
                assetBase="/icons"
              />
            </li>
          ))}
        </motion.ul>
      </motion.div>

      {/*
        Scroll cue. Fades out as soon as the reader starts moving — a hint that
        stays on screen after it has been taken stops being a hint.
      */}
      <motion.div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-ink-400"
        style={{ opacity: contentOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: DURATION.slow, delay: 1.1 }}
      >
        <motion.span
          className="block"
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2.2, ease: EASE.standard, repeat: Infinity }}
        >
          <Icon name="arrowDown" size={22} />
        </motion.span>
      </motion.div>
    </section>
  );
}
