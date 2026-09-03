import { experienceSchema, type Experience } from './schema';

/**
 * Work history, taken from Emmanuel_Aguilar_CV.pdf and kept in the CV's own
 * order: most recent first.
 *
 * Copy follows the CV's English wording. Where the CV writes a single dense
 * paragraph, it is split at its own sentence boundaries so each card reads as
 * discrete points — no sentence is reworded, added or dropped.
 *
 * `stack` lists only technologies the CV names for that role. The four roles
 * are all Flutter work, so Flutter is on each; everything else appears exactly
 * where the CV puts it. Nothing is inferred: a technology in the CV's global
 * skills list is not attributed to a specific employer.
 */
export const experience: Experience[] = experienceSchema.array().parse([
  {
    id: 'pai',
    org: 'Pai, Stripe Partner',
    role: 'Flutter Developer · Remote',
    period: 'Apr 2025 — Present',
    points: [
      'At Pai, I work on multiple simultaneous projects, specifically mobile apps with Flutter.',
      'On a day-to-day basis, I set up projects with all the necessary infrastructure to ensure quality.',
      'I hold meetings with clients, teams, and PMs for the implementation of new features.',
    ],
    stack: ['Flutter', 'Dart'],
  },
  {
    id: 'greelow',
    org: 'Greelow',
    role: 'Flutter Developer · Remote',
    period: 'Feb 2025 — Apr 2025',
    points: [
      'At Greelow, I worked hand in hand with a large team of developers for the Banorte bank client, developing secure features for their processes.',
      'Having direct contact with Banorte to address required requests, and ensuring a design identical to figma.',
    ],
    stack: ['Flutter', 'Dart', 'Figma'],
  },
  {
    id: 'dyshez',
    org: 'Dyshez',
    role: 'Flutter Developer · Remote',
    period: 'Aug 2024 — Jan 2025',
    points: [
      "At Dyshez, I implemented Typesense as an advanced search engine, Doppler for secure secret management, and generated technical documentation for the entire app's workflows.",
      'My time at Dyshez focused on improving timelines, process quality, and incorporating new technologies.',
    ],
    stack: ['Flutter', 'Dart', 'Typesense', 'Doppler'],
  },
  {
    id: 'gintec-aply',
    org: 'Gintec Aply',
    role: 'Flutter Developer · México',
    period: 'Apr 2023 — Apr 2024',
    points: [
      'As a project lead with a small but dynamic team specializing in mobile app development.',
      'Our focus was working closely with the client and UI/UX designer, generating weekly deliveries and ensuring process quality and efficiency.',
    ],
    stack: ['Flutter', 'Dart'],
  },
] satisfies Experience[]);
