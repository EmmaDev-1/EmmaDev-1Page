import { AboutSection } from '@/features/about/AboutSection';
import { ExperienceSection } from '@/features/experience/ExperienceSection';
import { SiteFooter } from '@/features/footer/SiteFooter';
import { HeroSection } from '@/features/hero/HeroSection';
import { SiteChrome } from '@/features/navigation/SiteChrome';
import { ProjectsSection } from '@/features/projects/ProjectsSection';
import { ResumeSection } from '@/features/resume/ResumeSection';
import { PersonJsonLd } from '@/components/ui/PersonJsonLd';

/**
 * The one page. Sections are Server Components — only SiteChrome, the design
 * system and the experience rail cross into the browser.
 */
export default function HomePage() {
  return (
    <>
      <PersonJsonLd />
      <SiteChrome>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <ExperienceSection />
        <ResumeSection />
        <SiteFooter />
      </SiteChrome>
    </>
  );
}
