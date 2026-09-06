import { projectSchema, type Project } from './schema';

/**
 * The eleven projects, in the order the author curated: the recent
 * professional work first — Colorinfinity, then the two Ditto Kids products —
 * then the personal mobile apps, then the older web systems. This array *is*
 * the running order: the section derives the zero-padded index and the
 * left/right alternation from each entry's position, so reordering here is the
 * only place a change is needed.
 *
 * My Notes sits at the end of the personal mobile group. It was absent from
 * the order the author gave, which listed ten of the eleven; it is kept rather
 * than dropped, since removing someone's work needs saying so explicitly.
 *
 * Copy for the original eight is verbatim — including the author's own
 * spellings. `stack` is filled only where a project's own description names a
 * technology; the rest are left empty rather than inferred, because guessing
 * someone's tech stack and printing it on their portfolio is a fabrication,
 * not a refactor. The same rule applies to the three newer entries: the author
 * described what each product does and who it is for, and supplied their
 * stacks separately — the prose below is a rewrite of his description for
 * clarity, not new information he didn't supply.
 *
 * Media dimensions are the intrinsic sizes of the source assets, so the layout
 * reserves the right box before anything loads (no CLS).
 */
export const projects: Project[] = projectSchema.array().parse([
  {
    id: 'colorinfinity',
    category: 'Mobile',
    title: 'Colorinfinity',
    description:
      'Colorinfinity is a mobile app for the clients and advisors behind buying and selling real-estate lots. It automates the process end to end on both sides, from the first quote to the last payment on a property, so an advisor can manage a sale and a client can follow it without leaving the app.',
    media: { kind: 'video', basePath: '/media/projects/colorinfinity', width: 404, height: 848 },
    alt: 'Screen recording of Colorinfinity: quoting and tracking a lot purchase as a client and as an advisor',
    stack: ['Flutter', 'Stripe', 'Riverpod', 'Sentry', 'CI-CD'],
  },
  {
    id: 'ditto-kids',
    category: 'Mobile',
    title: 'Ditto Kids',
    description:
      "Ditto Kids is a mobile app built for children's entertainment, with a large catalog of songs, podcasts and audio stories in multiple languages. It gives kids a space made for them to learn while they play, exploring music and stories on their own.",
    media: { kind: 'video', basePath: '/media/projects/ditto-kids', width: 406, height: 850 },
    alt: 'Screen recording of the Ditto Kids app: browsing songs, podcasts and stories for children',
    /*
     * Supplied as "RevenewCat" and "suscriptions". Corrected to the product's
     * real name and the English spelling: unlike the CV's own quirks, which are
     * the author's deliberate wording and are preserved verbatim elsewhere in
     * this file, these were typos in a chat message. A misspelt tool name reads
     * to anyone who knows RevenueCat as not knowing it.
     */
    stack: ['Flutter', 'Riverpod', 'RevenueCat', 'Subscriptions', 'Sentry'],
  },
  {
    id: 'ditto-kids-dashboard',
    category: 'Web',
    title: 'Ditto Kids Dashboard',
    description:
      "Ditto Kids Dashboard is the admin panel behind Ditto Kids, where administrators upload, edit and remove the app's catalog. It replaces a manual content process with a structured workflow, so new songs, podcasts and stories reach the app faster and with less effort.",
    media: {
      kind: 'carousel',
      images: [
        '/media/projects/ditto-dashboard-1.webp',
        '/media/projects/ditto-dashboard-2.webp',
        '/media/projects/ditto-dashboard-3.webp',
        '/media/projects/ditto-dashboard-4.webp',
      ],
    },
    alt: 'Four screens of the Ditto Kids Dashboard admin panel for managing app content',
    // "NextJs" as given; written NextJS to match the label used in the CV's
    // skills list, the About toolkit and the Pai role.
    stack: ['NextJS'],
  },
  {
    id: 'pay',
    category: 'Mobile',
    title: 'Pay',
    description:
      'Pay is an simulation app for subscriptions, users have to authenticate to view their subscription information. I use Firebase auth providers, json simulation APIs, clean architecture, Riverpod, go router and clean code for this app',
    media: { kind: 'video', basePath: '/media/projects/pay', width: 730, height: 1514 },
    alt: 'Screen recording of the Pay app: signing in, then browsing subscription details',
    stack: ['Firebase', 'Riverpod', 'go router', 'Clean Architecture'],
  },
  {
    id: 'pokedex',
    category: 'Mobile',
    title: 'Pokedex',
    description:
      'Pokedex is a mobile app inspired in the Pokemon world, you can find a variety of Pokemon species, items and regions. Incorporates big real time data and a smooth feeling to the user experience.',
    media: { kind: 'video', basePath: '/media/projects/pokedex', width: 600, height: 1342 },
    alt: 'Screen recording of the Pokedex app: scrolling species, items and regions',
    stack: [],
  },
  {
    id: 'my-weather',
    category: 'Mobile',
    title: 'My Weather',
    description:
      'My weather is a mobile app that users can consult the weather of any city of the world, incorporates real time data, validation system, and a smooth user experience.',
    media: { kind: 'video', basePath: '/media/projects/my-weather', width: 600, height: 1342 },
    alt: 'Screen recording of My Weather: searching a city and reading its live forecast',
    stack: [],
  },
  {
    id: 'wappi-food',
    category: 'Mobile',
    title: 'Wappi Food',
    description:
      'Wappi is a Mobile app inspired in a delivery system. This app incorporates technologies like, Flutter, GPS sensor and Firebase Authentication. My main purpose with this project was to create a simple app with great UI-UX.',
    media: { kind: 'video', basePath: '/media/projects/wappi-food', width: 346, height: 778 },
    alt: 'Screen recording of Wappi Food: browsing restaurants and placing a delivery order',
    stack: ['Flutter', 'GPS sensor', 'Firebase Authentication'],
  },
  {
    id: 'huble',
    category: 'Mobile',
    title: 'Huble',
    description:
      'This is an app that was ideal created for schools. The objetive was to make the students have better habits by implementing a striking design.',
    media: { kind: 'video', basePath: '/media/projects/huble', width: 600, height: 1342 },
    alt: 'Screen recording of Huble, a habit-building app designed for schools',
    stack: [],
  },
  {
    id: 'my-notes',
    category: 'Mobile',
    title: 'My Notes',
    description:
      'My Notes is a mobile app that users can create notes based on priority and a time limit, when the user finished the given task they can mark the note as finish and then archive the note or delete it. Incorporates real time data, validation system and a smooth user experience.',
    media: { kind: 'video', basePath: '/media/projects/my-notes', width: 600, height: 1340 },
    alt: 'Screen recording of My Notes: creating a note, setting priority, then archiving it',
    stack: [],
  },
  {
    id: 'casa-padi',
    category: 'Web',
    title: 'Casa Padi',
    description:
      'Web system riquierd for an art school, designed to be simple and minimalistic. The main objetive was to create a page for user to manage theire information of classes, Teachers can creating new classes and Admins can manage information for all types of users.',
    media: {
      kind: 'carousel',
      images: [
        '/media/projects/casa-padi-1.webp',
        '/media/projects/casa-padi-2.webp',
        '/media/projects/casa-padi-3.webp',
        '/media/projects/casa-padi-4.webp',
      ],
    },
    alt: 'Four screens of the Casa Padi art-school management system',
    stack: [],
  },
  {
    id: 'osc-compliance',
    category: 'Web',
    title: 'OSC Compliance',
    description:
      'An organization riquierd a web system inspired by the Business Model Canvas, the objective was that it could provide a deep educacion in sectors like finances, technical and fiscals for other civil organization.',
    media: {
      kind: 'carousel',
      images: [
        '/media/projects/osc-1.webp',
        '/media/projects/osc-2.webp',
        '/media/projects/osc-3.webp',
        '/media/projects/osc-4.webp',
      ],
    },
    alt: 'Four screens of the OSC Compliance business-model-canvas platform',
    stack: [],
  },
] satisfies Project[]);
