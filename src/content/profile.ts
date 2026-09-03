import { profileSchema, type Profile } from './schema';

/**
 * Copy is lifted verbatim from the source index.html.
 *
 * The design system is explicit that this voice is not to be rewritten — it is
 * first-person, warm, and slightly non-native, and that is part of the brand.
 * Spelling quirks in the source ("Boostrap", "Postgre SQL", "riquierd") are
 * preserved for the same reason. If they should be corrected, that is an
 * editorial decision for the author, not a refactor.
 */
export const profile: Profile = profileSchema.parse({
  name: 'Emmanuel',
  role: 'Software Engineer',
  headline: "Hi, I'm Emmanuel a Software Engineer",
  aboutHeading: 'Hi, nice to meet you',
  aboutBody:
    "I've always loved to design and create things since I was in high school. As a software engineer with experience, I now know that my inspiration is in developing unique products in the market. I'm confident, creative and naturally determined to keep improving my skills. My dream is to create digital art through my code and designs.",
  portrait: {
    kind: 'image',
    src: '/media/portrait/emma.webp',
    width: 800,
    height: 800,
  },
  resume: {
    pdf: '/docs/Emma_Dev_CV.pdf',
    preview: {
      kind: 'image',
      src: '/media/docs/cv.webp',
      width: 1200,
      height: 1553,
    },
  },
  social: [
    {
      network: 'linkedin',
      href: 'https://www.linkedin.com/in/dev-emma1',
      label: 'LinkedIn profile',
    },
    {
      network: 'github',
      href: 'https://github.com/EmmaDev-1',
      label: 'GitHub profile',
    },
  ],
} satisfies Profile);
