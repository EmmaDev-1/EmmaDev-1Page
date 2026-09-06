'use client';

import { Button, ResumePreview, SectionHeading } from '@/components/design-system';
import { Reveal } from '@/components/motion/Reveal';
import { Icon } from '@/components/ui/Icon';
import { Section } from '@/components/ui/Section';
import { profile, SECTION_IDS } from '@/content';

/**
 * Resume.
 *
 * The rotating gradient frame is the design system's GradientFrame, itself a
 * port of the source's spinning `::before`. The preview is a link, but a
 * thumbnail is a weak affordance for "this is downloadable" — the explicit
 * button underneath is what makes the action legible, and it is the same CTA
 * the hero points at.
 */
export function ResumeSection() {
  return (
    <Section id={SECTION_IDS.curriculum}>
      <Reveal>
        <SectionHeading eyebrow="04 — Resume" align="center" className="mx-auto mb-16">
          Resume
        </SectionHeading>
      </Reveal>

      <Reveal from="up" className="flex flex-col items-center gap-10">
        {/*
          The preview and the button both download the same file, so they must
          not share an accessible name — two links called "Download CV" is an
          ambiguity for anyone navigating by link list. The preview names the
          document, the button names the action.
        */}
        <ResumePreview
          src={profile.resume.preview.src}
          href={profile.resume.pdf}
          width={560}
          height={725}
          label={`${profile.name} — Resume (PDF)`}
        />

        <Button
          variant="gradient"
          size="lg"
          href={profile.resume.pdf}
          iconRight={<Icon name="download" size={18} />}
        >
          Download CV
        </Button>
      </Reveal>
    </Section>
  );
}
