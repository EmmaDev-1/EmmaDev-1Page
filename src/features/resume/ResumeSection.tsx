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
  const { preview } = profile.resume;

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
        {/*
          The height has to be a ratio, not a number, or the preview crops.

          ResumePreview sizes its frame `{ width, height, maxWidth: '100%' }`
          and fills it with `object-fit: cover`. On a narrow screen maxWidth
          shrinks the width while the height stays at whatever was passed, so
          the box grows steadily taller than the page it is showing and cover
          takes the difference off the sides: measured at 390px, 38% of the
          CV's width was gone — 50% at 320px. Both edges of every line.

          Overriding height to `auto` and giving the frame the document's own
          aspect ratio makes it narrow proportionally, which leaves cover with
          nothing to crop. Applied as a style prop, since the vendored
          component spreads `...style` last. Desktop is untouched: 560px at
          this ratio is 725px tall, which is what was hardcoded before.
        */}
        <ResumePreview
          src={preview.src}
          href={profile.resume.pdf}
          width={560}
          label={`${profile.name} — Resume (PDF)`}
          style={{ height: 'auto', aspectRatio: `${preview.width} / ${preview.height}` }}
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
