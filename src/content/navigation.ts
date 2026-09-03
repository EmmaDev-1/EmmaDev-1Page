import { navItemSchema, type NavItem } from './schema';

/**
 * Section order and labels, unchanged from the source nav.
 * Title Case, per the design system's casing rule.
 *
 * Section ids are the single source of truth for both the nav and the
 * scroll-spy, so a rename cannot desynchronise them.
 */
export const SECTION_IDS = {
  home: 'home',
  about: 'about',
  projects: 'projects',
  experience: 'experience',
  curriculum: 'curriculum',
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

export const navItems: NavItem[] = navItemSchema.array().parse([
  { href: `#${SECTION_IDS.home}`, label: 'Home' },
  { href: `#${SECTION_IDS.about}`, label: 'About Me' },
  { href: `#${SECTION_IDS.projects}`, label: 'Projects' },
  { href: `#${SECTION_IDS.experience}`, label: 'Experience' },
  { href: `#${SECTION_IDS.curriculum}`, label: 'Curriculum' },
]);
