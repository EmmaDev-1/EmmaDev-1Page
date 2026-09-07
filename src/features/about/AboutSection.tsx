'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { BlobPortrait, SectionHeading, TagChip } from '@/components/design-system';
import { Reveal } from '@/components/motion/Reveal';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { Section } from '@/components/ui/Section';
import { profile, SECTION_IDS } from '@/content';

/**
 * About Me.
 *
 * The portrait drifts against the copy as the section passes — a small
 * parallax offset, not a stunt. It keeps the two columns from moving as one
 * slab, which is what made the previous build feel like a document rather than
 * a page, and it costs nothing because the transform is compositor-only.
 *
 * Education and the toolkit come from the CV, and sit here rather than in
 * Experience because they describe the person, not a single job.
 */
export function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const portraitY = useTransform(scrollYProgress, [0, 1], [42, -42]);

  const { education, skills } = profile;
  const toolkit = [...skills.languages, ...skills.technologies];

  return (
    <Section id={SECTION_IDS.about}>
      <Reveal>
        <SectionHeading eyebrow="01 — About" align="center" className="mx-auto mb-20">
          {profile.aboutHeading}
        </SectionHeading>
      </Reveal>

      <div ref={ref} className="grid grid-cols-1 items-center gap-16 nav:grid-cols-[auto_1fr]">
        <Reveal from="left" className="flex justify-center">
          <motion.div style={{ y: portraitY }}>
            <BlobPortrait
              src={profile.portrait.src}
              alt={`Portrait of ${profile.name}`}
              size={360}
            />
          </motion.div>
        </Reveal>

        <Stagger className="flex flex-col gap-8" delay={0.1}>
          {profile.aboutBody.map((paragraph) => (
            <StaggerItem
              key={paragraph}
              as="p"
              className="m-0 max-w-[var(--measure-prose)] text-body-lg leading-relaxed text-ink-100 text-pretty"
            >
              {paragraph}
            </StaggerItem>
          ))}

          <StaggerItem>
            <blockquote className="m-0 max-w-[var(--measure-prose)] border-l-2 border-accent py-1 pl-6">
              <p className="m-0 text-body-lg leading-relaxed text-ink-100 text-pretty">
                “{profile.aboutQuote.text}”
              </p>
              <cite className="mt-3 block font-mono text-micro tracking-wide text-ink-300 uppercase not-italic">
                — {profile.aboutQuote.author}
              </cite>
            </blockquote>
          </StaggerItem>

          <StaggerItem>
            <dl className="m-0 flex flex-col gap-1">
              <dt className="font-mono text-micro tracking-wide text-accent uppercase">
                Education
              </dt>
              <dd className="m-0 text-body-sm leading-relaxed text-ink-300">
                {education.degree} · {education.institution} · {education.period}
              </dd>
            </dl>
          </StaggerItem>

          <StaggerItem>
            <div className="flex flex-col gap-4">
              <h3 className="m-0 font-mono text-micro tracking-wide text-accent uppercase">
                Toolkit
              </h3>
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                {toolkit.map((item) => (
                  <li key={item}>
                    <TagChip>{item}</TagChip>
                  </li>
                ))}
              </ul>
            </div>
          </StaggerItem>
        </Stagger>
      </div>
    </Section>
  );
}
