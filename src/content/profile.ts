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
  /*
   * The professional title, as the author wants to be positioned. It is the
   * hero eyebrow, the nav wordmark, the page <title>, the OG card and the
   * JSON-LD jobTitle — one value, nine places, so it is only ever changed here.
   *
   * Note this is deliberately not the CV's per-role job title ("Flutter
   * Developer") nor the degree ("Software Engineering"); those live on the
   * Experience entries and on `education` respectively.
   */
  role: 'FrontEnd Engineer',
  headline: "Hi, I'm Emmanuel a Software Engineer",
  aboutHeading: 'Hi, nice to meet you',
  /*
   * One clause changed from the source: "As a software engineer with
   * experience" became the concrete thing the CV shows he actually does now.
   * The rest of the paragraph is his own wording, untouched — the CV carries no
   * bio of its own, so there was nothing else to update from.
   */
  aboutBody:
    "I've always loved to design and create things since I was in high school. Today I build mobile apps with Flutter, and I now know that my inspiration is in developing unique products in the market. I'm confident, creative and naturally determined to keep improving my skills. My dream is to create digital art through my code and designs.",
  education: {
    institution: 'Universidad Politécnica de Pachuca',
    degree: 'Software Engineering',
    period: 'Sep 2019 — Aug 2022',
  },
  // Verbatim from the CV's SKILLS section, in its order.
  skills: {
    languages: ['Dart', 'C#', 'HTML/CSS', 'Javascript', 'Java', 'Php'],
    technologies: [
      'Flutter',
      'GetX',
      'Bloc',
      'Provider',
      'Riverpod',
      'Search Engine',
      'Firebase',
      'Supabase',
      'CI-CD',
      'Push Notification',
      'Key Managment',
      'MicrosoftSQL',
      'PostgreSQL',
      'Azure',
      '.NET',
      'NextJS',
    ],
  },
  portrait: {
    kind: 'image',
    src: '/media/portrait/emma.webp',
    width: 800,
    height: 800,
  },
  resume: {
    // Named after the author, not the project: this is what lands in a
    // recruiter's downloads folder.
    pdf: '/docs/Emmanuel_Aguilar_CV.pdf',
    preview: {
      kind: 'image',
      // US Letter, so the preview keeps a 0.773 aspect ratio.
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
