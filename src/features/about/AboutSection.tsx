import { BlobPortrait, Reveal, SectionHeading, TagChip } from '@/components/design-system';
import { Section } from '@/components/ui/Section';
import { profile, SECTION_IDS } from '@/content';

/**
 * About Me. Portrait and prose enter from opposite edges, matching the source's
 * slideAndBounceRight / slideAndBounceLeft pair — at the design system's 800ms
 * rather than the original 2s.
 *
 * Education and the skills list come from the CV. They sit here rather than in
 * Experience because they describe the person, not a single job: the per-role
 * chips on an Experience card list only what that employer's entry names.
 */
export function AboutSection() {
  const { education, skills } = profile;
  const toolkit = [...skills.languages, ...skills.technologies];

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
          <div className="flex flex-col gap-8">
            <p className="m-0 max-w-[var(--measure-prose)] text-body-lg leading-relaxed text-ink-100 text-pretty">
              {profile.aboutBody}
            </p>

            <dl className="m-0 flex flex-col gap-1">
              <dt className="font-mono text-micro tracking-wide text-accent uppercase">
                Education
              </dt>
              <dd className="m-0 text-body-sm leading-relaxed text-ink-300">
                {education.degree} · {education.institution} · {education.period}
              </dd>
            </dl>

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
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
