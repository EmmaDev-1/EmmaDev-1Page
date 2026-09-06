'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { SectionHeading, TagChip } from '@/components/design-system';
import { Reveal } from '@/components/motion/Reveal';
import { Section } from '@/components/ui/Section';
import { projects, SECTION_IDS } from '@/content';
import { DURATION, EASE } from '@/lib/motion';
import { ProjectEntry } from './ProjectEntry';

/**
 * The eight projects, filterable.
 *
 * The filter is the design system's own specification — its ui_kit puts a chip
 * row beside the section heading — which the previous build never implemented.
 * It filters on `category` rather than `stack`: five of the eight projects name
 * no technologies in their copy, so a stack filter would return an empty page
 * for almost every choice, and inventing stacks to make a control work would
 * be putting words in the author's mouth.
 *
 * `flip` is derived from the *filtered* index, so the alternation the DS
 * specifies for a page of two-column rows survives filtering instead of
 * leaving two media columns stacked on the same side.
 */
const FILTERS = ['All', 'Mobile', 'Web'] as const;
type Filter = (typeof FILTERS)[number];

export function ProjectsSection() {
  const [filter, setFilter] = useState<Filter>('All');

  const shown = useMemo(
    () => (filter === 'All' ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  );

  return (
    <Section id={SECTION_IDS.projects}>
      <Reveal>
        <div className="mb-20 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="02 — Work">Projects</SectionHeading>

          <div role="group" aria-label="Filter projects by kind" className="flex flex-wrap gap-2">
            {FILTERS.map((option) => {
              const active = option === filter;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFilter(option)}
                  aria-pressed={active}
                  className="rounded-pill"
                >
                  <TagChip interactive tone={active ? 'accent' : 'neutral'}>
                    {option}
                  </TagChip>
                </button>
              );
            })}
          </div>
        </div>
      </Reveal>

      {/*
        `mode="popLayout"` lets leaving rows animate out while the survivors
        move up into place, instead of the list snapping to its new length and
        then fading. Keying the list on the filter would restart every row's
        entrance; keying each row on its own id means only what actually
        changed animates.
      */}
      <motion.div layout className="flex flex-col gap-32 nav:gap-40">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((project, index) => (
            <motion.div
              key={project.id}
              layout
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: DURATION.normal, ease: EASE.standard }}
            >
              <ProjectEntry project={project} index={index} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </Section>
  );
}
