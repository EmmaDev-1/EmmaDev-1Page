'use client';

import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { useRef } from 'react';
import { SectionHeading, TagChip } from '@/components/design-system';
import { Reveal } from '@/components/motion/Reveal';
import { Section } from '@/components/ui/Section';
import { experience, SECTION_IDS } from '@/content';
import { DURATION, EASE, reveal, VIEWPORT } from '@/lib/motion';

/**
 * Career timeline.
 *
 * Replaces the horizontal scroll-snap rail. The rail was a faithful port of the
 * source's carousel, but a carousel is the wrong shape for a career: it hides
 * most of the history behind a gesture, gives every role equal weight, and says
 * nothing about order. Four dated roles down a vertical line say "this is a
 * progression" without a word of explanation.
 *
 * The line fills as the section scrolls, which is the one place on the page
 * where a scroll-linked value carries meaning rather than decoration — it is
 * literally a progress bar through time.
 */
export function ExperienceSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 75%', 'end 60%'],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  return (
    <Section id={SECTION_IDS.experience}>
      <Reveal>
        <SectionHeading eyebrow="03 — Career" className="mb-20">
          Experience
        </SectionHeading>
      </Reveal>

      <div ref={ref} className="relative">
        {/* The rail. Sits under the nodes, inset to the node's centre. */}
        <div aria-hidden="true" className="timeline-rail bg-hairline" />
        <motion.div
          aria-hidden="true"
          className="timeline-rail origin-top"
          style={{ scaleY, background: 'var(--gradient-brand-vertical)' }}
        />

        <ol className="m-0 flex list-none flex-col gap-16 p-0">
          {experience.map((role, index) => (
            <TimelineRole key={role.id} role={role} index={index} />
          ))}
        </ol>
      </div>
    </Section>
  );
}

function TimelineRole({ role, index }: { role: (typeof experience)[number]; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  /*
   * Each node lights up as it reaches the middle of the viewport, so the dot
   * the gradient line has just passed is the one that is filled. Tying it to
   * the node's own position rather than to a section-wide index keeps them in
   * step at any scroll speed.
   */
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'start 45%'] });
  const nodeScale = useTransform(scrollYProgress, [0, 1], [0.6, 1]);
  const nodeOpacity = useTransform(scrollYProgress, [0, 1], [0.3, 1]);

  return (
    <motion.li
      ref={ref}
      className="timeline-row relative"
      variants={reveal('up')}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      transition={{ duration: DURATION.reveal, ease: EASE.outSoft, delay: index * 0.06 }}
    >
      {/* Period column, which doubles as the timeline's left rail on desktop. */}
      <div className="nav:pt-1 nav:text-right">
        <span className="font-mono text-micro tracking-wide text-accent uppercase">
          {role.period}
        </span>
      </div>

      <motion.span
        aria-hidden="true"
        className="timeline-node rounded-pill border-2 border-page"
        style={{ scale: nodeScale, opacity: nodeOpacity, background: 'var(--gradient-brand)' }}
      />

      {/* The grid gap already clears the rail; extra padding here just opened a
          trench between the timeline and the text it belongs to. */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="m-0 text-heading-2 leading-snug text-heading">{role.org}</h3>
          {role.role ? <span className="text-body-sm text-ink-300">{role.role}</span> : null}
        </div>

        <div className="flex flex-col gap-3">
          {role.points.map((point) => (
            <p
              key={point}
              className="m-0 max-w-[var(--measure-prose)] text-body-sm leading-relaxed text-ink-100 text-pretty"
            >
              {point}
            </p>
          ))}
        </div>

        {role.stack.length > 0 ? (
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0 pt-1">
            {role.stack.map((tech) => (
              <li key={tech}>
                <TagChip>{tech}</TagChip>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </motion.li>
  );
}
