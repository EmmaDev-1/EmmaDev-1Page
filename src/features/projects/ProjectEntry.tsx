'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useState } from 'react';
import { TagChip } from '@/components/design-system';
import { ProjectMedia } from '@/components/ui/ProjectMedia';
import { Icon } from '@/components/ui/Icon';
import { DURATION, EASE, reveal, staggerParent, VIEWPORT } from '@/lib/motion';
import type { Project } from '@/content';

/**
 * One project.
 *
 * Replaces the design system's ProjectRow, which bakes its own entrance and a
 * fixed grid into the component and so cannot take part in a scroll-linked
 * composition. The visual grammar it defined is kept exactly — alternating
 * two-column rows, 15px media radius, hairline border, hover lift with a
 * violet glow — but the motion is owned here, where it can be driven by the
 * row's own scroll progress.
 *
 * The media moves slightly against the copy as the row passes. With eight rows
 * of tall phone recordings, a page where every row arrives identically reads
 * as a list; the offset is what makes it read as a sequence.
 */
export function ProjectEntry({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const [hover, setHover] = useState(false);
  const flip = index % 2 === 1;

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const mediaY = useTransform(scrollYProgress, [0, 1], [36, -36]);

  return (
    <motion.article
      ref={ref}
      id={project.id}
      className="grid grid-cols-1 items-center gap-12 nav:grid-cols-2 nav:gap-16"
      variants={staggerParent(0.14)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      <motion.div
        variants={reveal(flip ? 'right' : 'left')}
        style={{ order: flip ? 2 : 1 }}
        className="min-w-0"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <motion.div style={{ y: mediaY }}>
          <motion.div
            className="overflow-hidden rounded-md border border-hairline bg-surface-inset"
            animate={{
              y: hover ? -4 : 0,
              boxShadow: hover
                ? 'var(--shadow-lg), var(--glow-accent-sm)'
                : 'var(--shadow-md), 0 0 0 rgba(169, 69, 199, 0)',
            }}
            transition={{ duration: DURATION.normal, ease: EASE.outSoft }}
          >
            <ProjectMedia media={project.media} alt={project.alt} priority={index === 0} />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        variants={reveal(flip ? 'left' : 'right')}
        style={{ order: flip ? 1 : 2 }}
        className="flex min-w-0 flex-col items-start gap-5"
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-micro tracking-wide text-faint">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="h-px w-8 bg-strong" aria-hidden="true" />
          <span className="font-mono text-micro tracking-wide text-accent uppercase">
            {project.category}
          </span>
        </div>

        <h3 className="m-0 flex items-center gap-3 text-heading-1 leading-snug tracking-display text-heading">
          {project.title}
          {/*
            A hint that the row is a unit, not a nudge to click: nothing here
            links out yet, so it only tracks hover rather than pretending to be
            an affordance.
          */}
          <motion.span
            aria-hidden="true"
            className="text-accent"
            animate={{ opacity: hover ? 1 : 0, x: hover ? 0 : -6 }}
            transition={{ duration: DURATION.fast, ease: EASE.outSoft }}
          >
            <Icon name="arrowUpRight" size={24} />
          </motion.span>
        </h3>

        <p className="m-0 max-w-[var(--measure-prose)] text-body-md leading-relaxed text-ink-100 text-pretty">
          {project.description}
        </p>

        {project.stack.length > 0 ? (
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {project.stack.map((tech) => (
              <li key={tech}>
                <TagChip>{tech}</TagChip>
              </li>
            ))}
          </ul>
        ) : null}
      </motion.div>
    </motion.article>
  );
}
