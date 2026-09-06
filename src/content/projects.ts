import { projectSchema, type Project } from './schema';

/**
 * The eight projects, in the order the source page listed them.
 *
 * Copy is verbatim — including the author's own spellings. `stack` is filled
 * only where the project's own description names a technology; the rest are
 * left empty rather than inferred, because guessing someone's tech stack and
 * printing it on their portfolio is a fabrication, not a refactor.
 *
 * Media dimensions are the intrinsic sizes of the source assets, so the layout
 * reserves the right box before anything loads (no CLS).
 */
export const projects: Project[] = projectSchema.array().parse([
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
