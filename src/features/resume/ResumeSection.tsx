import { Reveal, ResumePreview, SectionHeading } from '@/components/design-system';
import { Section } from '@/components/ui/Section';
import { profile, SECTION_IDS } from '@/content';

/**
 * Resume. The rotating gradient frame is the source's .resumeContainer::before
 * trick, now owned by the design system's GradientFrame.
 */
export function ResumeSection() {
  return (
    <Section id={SECTION_IDS.curriculum}>
      <SectionHeading eyebrow="04 — Resume" align="center" className="mx-auto mb-16">
        Resume
      </SectionHeading>

      <Reveal from="up" className="flex justify-center">
        <ResumePreview
          src={profile.resume.preview.src}
          href={profile.resume.pdf}
          width={560}
          height={725}
          label="Download CV"
        />
      </Reveal>
    </Section>
  );
}
