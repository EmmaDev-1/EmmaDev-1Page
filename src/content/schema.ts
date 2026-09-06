import { z } from 'zod';

/**
 * Content contracts.
 *
 * These run at module load, which on a statically rendered page means build
 * time: a malformed entry fails `next build` rather than shipping. Keep the
 * schemas strict — silently accepting a bad shape is the failure mode this
 * layer exists to prevent.
 */

const nonEmpty = z.string().trim().min(1);

/** A still image rendered through next/image. */
export const imageMediaSchema = z.object({
  kind: z.literal('image'),
  src: nonEmpty,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

/**
 * A screen recording. The source shipped these as GIFs (up to 36 MB each);
 * the media pipeline re-encodes them to MP4 + WebM with a still poster.
 */
export const videoMediaSchema = z.object({
  kind: z.literal('video'),
  /** Path without extension — `.mp4`, `.webm` and `.poster.webp` are derived. */
  basePath: nonEmpty,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

/** Several stills that cross-fade, for projects with more than one view. */
export const carouselMediaSchema = z.object({
  kind: z.literal('carousel'),
  images: z.array(nonEmpty).min(2),
});

export const mediaSchema = z.discriminatedUnion('kind', [
  imageMediaSchema,
  videoMediaSchema,
  carouselMediaSchema,
]);

export const projectSchema = z.object({
  /** Stable key — also the anchor fragment. */
  id: nonEmpty.regex(/^[a-z0-9-]+$/, 'ids are lowercase kebab-case'),
  title: nonEmpty,
  /**
   * Drives the Projects filter. Read off each project's own description —
   * every entry calls itself either a mobile app or a web system — rather
   * than filtering on `stack`, which is empty for five of the eight and would
   * make most filters return nothing.
   */
  category: z.enum(['Mobile', 'Web']),
  description: nonEmpty,
  media: mediaSchema,
  /**
   * Technologies the project's own copy names. Left empty rather than guessed:
   * inventing a stack would put words in the author's mouth.
   */
  stack: z.array(nonEmpty).default([]),
  /** Alt text for the project's media. Never empty — these carry meaning. */
  alt: nonEmpty,
});

export const experienceSchema = z.object({
  id: nonEmpty.regex(/^[a-z0-9-]+$/),
  org: nonEmpty,
  role: nonEmpty.optional(),
  period: nonEmpty.optional(),
  points: z.array(nonEmpty).min(1),
  stack: z.array(nonEmpty).default([]),
});

export const socialLinkSchema = z.object({
  network: z.enum(['github', 'linkedin']),
  href: z.url(),
  label: nonEmpty,
});

export const educationSchema = z.object({
  institution: nonEmpty,
  degree: nonEmpty,
  period: nonEmpty,
});

export const profileSchema = z.object({
  name: nonEmpty,
  role: nonEmpty,
  /**
   * The hero line, split at the breaks it should take on screen. The hero
   * reveals each line from behind its own mask, so the split is content, not
   * styling — a CSS-driven wrap would put the mask in the wrong place.
   */
  headlineLines: z.array(nonEmpty).min(1),
  /** Derived from headlineLines, so the two cannot drift apart. */
  headline: nonEmpty,
  /** One line under the headline. The design system's hero specifies one. */
  tagline: nonEmpty,
  aboutHeading: nonEmpty,
  aboutBody: nonEmpty,
  education: educationSchema,
  /**
   * The CV's own skills list — the whole toolkit, not one employer's slice.
   * Distinct from the per-role `stack` on an Experience entry.
   */
  skills: z.object({
    languages: z.array(nonEmpty).min(1),
    technologies: z.array(nonEmpty).min(1),
  }),
  portrait: imageMediaSchema,
  resume: z.object({
    pdf: nonEmpty,
    preview: imageMediaSchema,
  }),
  /**
   * Published deliberately, at the author's request. It already reached the
   * page anyway — it is printed inside the CV the site serves for download —
   * so keeping it out of the markup was buying very little while costing the
   * most direct way to reach him.
   */
  email: z.email(),
  social: z.array(socialLinkSchema).min(1),
});

export const navItemSchema = z.object({
  href: nonEmpty.startsWith('#'),
  label: nonEmpty,
});

export type ImageMedia = z.infer<typeof imageMediaSchema>;
export type VideoMedia = z.infer<typeof videoMediaSchema>;
export type CarouselMedia = z.infer<typeof carouselMediaSchema>;
export type Media = z.infer<typeof mediaSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type Education = z.infer<typeof educationSchema>;
export type SocialLink = z.infer<typeof socialLinkSchema>;
export type NavItem = z.infer<typeof navItemSchema>;
