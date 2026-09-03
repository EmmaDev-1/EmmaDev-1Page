/**
 * Content layer — the single source of truth for everything the page says.
 *
 * Importing from here runs every Zod schema, so the whole content set is
 * validated once at build time.
 */
export { profile } from './profile';
export { projects } from './projects';
export { experience } from './experience';
export { navItems, SECTION_IDS, type SectionId } from './navigation';
export type {
  CarouselMedia,
  Experience,
  ImageMedia,
  Media,
  NavItem,
  Profile,
  Project,
  SocialLink,
  VideoMedia,
} from './schema';
