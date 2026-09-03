/**
 * EmmaDev Design System — public surface.
 *
 * This barrel is the ONLY sanctioned entry point: the adherence lint
 * (.design-system/adherence.oxlintrc.json) rejects deep imports into
 * core/ · motion/ · navigation/ · portfolio/.
 *
 * Everything under this directory is vendored verbatim from the Claude Design
 * project and must not be hand-edited. Run `pnpm ds:sync` to re-verify it
 * against the upstream token manifest.
 *
 * Every component holds hover/scroll state, so the whole surface is marked
 * client here rather than annotating each vendored file — which keeps the
 * vendored sources byte-identical to upstream. Server Components may still
 * render these; only the components themselves ship to the browser.
 */
'use client';

// core
export { Button } from './core/Button';
export type { ButtonProps } from './core/Button';
export { GradientFrame } from './core/GradientFrame';
export type { GradientFrameProps } from './core/GradientFrame';
export { GradientText } from './core/GradientText';
export type { GradientTextProps } from './core/GradientText';
export { IconButton } from './core/IconButton';
export type { IconButtonProps } from './core/IconButton';
export { SectionHeading } from './core/SectionHeading';
export type { SectionHeadingProps } from './core/SectionHeading';
export { TagChip } from './core/TagChip';
export type { TagChipProps } from './core/TagChip';

// motion
export { CursorTrail } from './motion/CursorTrail';
export type { CursorTrailProps } from './motion/CursorTrail';
export { Reveal } from './motion/Reveal';
export type { RevealProps } from './motion/Reveal';

// navigation
export { NavBar } from './navigation/NavBar';
export type { NavBarProps } from './navigation/NavBar';
export { NavLink } from './navigation/NavLink';
export type { NavLinkProps } from './navigation/NavLink';
export { NavPanel } from './navigation/NavPanel';
export type { NavPanelProps } from './navigation/NavPanel';
export { NavToggle } from './navigation/NavToggle';
export type { NavToggleProps } from './navigation/NavToggle';
export { ScrollTopArrow } from './navigation/ScrollTopArrow';
export type { ScrollTopArrowProps } from './navigation/ScrollTopArrow';
export { SocialIconLink } from './navigation/SocialIconLink';
export type { SocialIconLinkProps } from './navigation/SocialIconLink';

// portfolio
export { BlobPortrait } from './portfolio/BlobPortrait';
export type { BlobPortraitProps } from './portfolio/BlobPortrait';
export { ExperienceCard } from './portfolio/ExperienceCard';
export type { ExperienceCardProps } from './portfolio/ExperienceCard';
export { MediaCarousel } from './portfolio/MediaCarousel';
export type { MediaCarouselProps } from './portfolio/MediaCarousel';
export { ProjectRow } from './portfolio/ProjectRow';
export type { ProjectRowProps } from './portfolio/ProjectRow';
export { ResumePreview } from './portfolio/ResumePreview';
export type { ResumePreviewProps } from './portfolio/ResumePreview';
