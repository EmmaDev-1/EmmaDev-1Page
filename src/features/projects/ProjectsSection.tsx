import { ProjectRow, SectionHeading } from '@/components/design-system';
import { ProjectMedia } from '@/components/ui/ProjectMedia';
import { Section } from '@/components/ui/Section';
import { projects, SECTION_IDS } from '@/content';

/**
 * The eight projects.
 *
 * `flip` alternates down the list so media and copy swap sides, which is the
 * design system's rule for a page of two-column rows — and it is derived from
 * the index rather than written into the content, so reordering or inserting a
 * project cannot break the rhythm. The source hard-coded the alternation into
 * the markup and had to be edited by hand.
 */
export function ProjectsSection() {
  return (
    <Section id={SECTION_IDS.projects}>
      <SectionHeading eyebrow="02 — Work" className="mb-20">
        Projects
      </SectionHeading>

      <div className="flex flex-col gap-32 nav:gap-40">
        {projects.map((project, index) => (
          <ProjectRow
            key={project.id}
            id={project.id}
            index={index + 1}
            flip={index % 2 === 1}
            title={project.title}
            description={project.description}
            stack={project.stack}
            media={<ProjectMedia media={project.media} alt={project.alt} priority={index === 0} />}
          />
        ))}
      </div>
    </Section>
  );
}
