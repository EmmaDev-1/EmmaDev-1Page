import { BlobPortrait, Reveal, SectionHeading } from '@/components/design-system';
import { Section } from '@/components/ui/Section';
import { profile, SECTION_IDS } from '@/content';

/**
 * About Me. Portrait and prose enter from opposite edges, matching the source's
 * slideAndBounceRight / slideAndBounceLeft pair — at the design system's 800ms
 * rather than the original 2s.
 */
export function AboutSection() {
  return (
    <Section id={SECTION_IDS.about}>
      <SectionHeading eyebrow="01 — About" align="center" className="mx-auto mb-16">
        {profile.aboutHeading}
      </SectionHeading>

      <div className="grid grid-cols-1 items-center gap-16 nav:grid-cols-[auto_1fr]">
        <Reveal from="left" className="flex justify-center">
          <BlobPortrait src={profile.portrait.src} alt={`Portrait of ${profile.name}`} size={360} />
        </Reveal>

        <Reveal from="right" delay={120}>
          <p className="m-0 max-w-[var(--measure-prose)] text-body-lg leading-relaxed text-ink-100 text-pretty">
            {profile.aboutBody}
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
