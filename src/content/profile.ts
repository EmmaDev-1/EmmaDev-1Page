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
  /*
   * The design system's hero specifies a line under the headline, and picks
   * this sentence for it. It is also the closing line of aboutBody — the echo
   * is deliberate and upstream's own choice: it works as a hook at the top and
   * as a resolution further down.
   */
  tagline: 'My dream is to create digital art through my code and designs.',
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
