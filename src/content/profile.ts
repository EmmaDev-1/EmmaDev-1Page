import { profileSchema, type Profile } from './schema';

/**
 * The hero line, split where it should break on screen. The hero reveals each
 * line from behind its own mask, so where the break falls is an authored
 * decision — letting CSS wrap it would put the mask edge somewhere arbitrary.
 */
const headlineLines = ["Hi, I'm Emmanuel", 'a FrontEnd Engineer'];

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
  headlineLines,
  // Joined, never retyped: the page title, the OG card and the <h1> can't drift.
  headline: headlineLines.join(' '),
  /** The design system's hero specifies a line under the headline. */
  tagline: 'My dream is to create digital art through my code and designs.',
  aboutHeading: 'Hi, nice to meet you',
  /**
   * The author's second rewrite of his own bio — supplied directly, verbatim,
   * as two paragraphs. It no longer closes on the tagline sentence the way the
   * previous version did; that echo was this file's own past choice, not a
   * design-system requirement, so dropping it here is not a regression.
   */
  aboutBody: [
    "Hello, I'm Emmanuel Aguilar, a Software Engineer focused on mobile development with Flutter. I've had the opportunity to work on a wide variety of projects, from management to delivery and banking applications.",
    "My main goal is to create applications with challenging designs, always ensuring efficiency, security, and quality. I'm passionate about technology and innovation, and I am guided by values such as respect, honesty, communication, and hard work. I consider myself a tireless worker and will always contribute 110%, constantly seeking to learn and grow both professionally and personally.",
  ],
  /** Closes the section — the author's own choice of who to quote and why. */
  aboutQuote: {
    text: "I want to hear the best arguments against mine because I would like to find out where I am wrong and I would like to keep doing what I'm doing better.",
    author: 'Jordan B. Peterson',
  },
  education: {
    institution: 'Universidad Politécnica de Pachuca',
    degree: 'Software Engineering',
    period: 'Sep 2019 — Aug 2022',
  },
  /*
   * Curated, not the CV's full SKILLS dump (that list ran to 22 chips across
   * languages and technologies). At the author's direction: the two axes he
   * wants Toolkit to headline are deep, extensive mobile experience —
   * specifically Flutter — and the web frontend skill he has spent the last
   * year building, Next.js. Dart and Firebase complete the Flutter story
   * (Flutter's language, and the backend it is most commonly paired with in
   * his own CV); Javascript and HTML/CSS complete the Next.js one.
   *
   * The rest of the CV's list (GetX, Bloc, Provider, Riverpod, Supabase,
   * Azure, .NET, C#, Java, Php, and the rest) is real but not what he asked
   * this section to lead with. None of it is lost — it is still in this
   * file's git history and on the downloadable CV.
   */
  skills: {
    languages: ['Dart', 'Javascript', 'HTML/CSS'],
    technologies: ['Flutter', 'NextJS', 'Firebase'],
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
  email: 'emmanueldev3a@gmail.com',
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
