import { experienceSchema, type Experience } from './schema';

/**
 * The three experience cards from the source carousel.
 *
 * Copy and technology labels are verbatim, vendor casing and all — the design
 * system calls this out explicitly ("Postgre SQL", "Boostrap", "FireBase",
 * "Javascript" keep their source spellings).
 *
 * The source carried no dates, so `period` is omitted rather than invented.
 */
export const experience: Experience[] = experienceSchema.array().parse([
  {
    id: 'osc-compliance',
    org: 'OSC Compliance',
    points: [
      'Worked implementing data structuring patterns to enhance data organization, retrieval, and manipulation, optimizing system performance.',
      'Designed and complemented Business management applications that improved workflow efficiency and data management for clients.',
    ],
    stack: [
      'Java',
      'Spring Tools',
      'Postgre SQL',
      'pgAdmin',
      'Apache',
      'Ajax',
      'HTML',
      'CSS',
      'PrimeFaces',
    ],
  },
  {
    id: 'grupo-indigo',
    org: 'Grupo Indigo',
    points: [
      'At Grupo indigo, I am part of a dynamic team that specializes in developing mobile applications. Our focus areas include E-Commerce and the creation of custom mobile applications.',
      'Proposed project ideas and suggested valuable improvements that have enhanced application performance.',
      'Designed and implemented applications for businesses, with features for control and user management',
    ],
    stack: [
      'Flutter',
      'Dart',
      'Android Studio',
      'Boostrap',
      'HTML',
      'CSS',
      'Javascript',
      'C#',
      'ASP.NET MVC 5',
      'Azure',
      'FireBase',
      'Microsoft SQL',
      'Postman',
      'Json',
      'Rest API Push Notifications',
      'One Signal',
      'XML',
    ],
  },
  {
    id: 'personal',
    org: 'Personal',
    points: [
      "I'm an autodidact person, I'm always learning new technologies.",
      'The words that describe me are responsable, efficiency and loyal.',
    ],
    // The source repeated the full Grupo Indigo chip list here verbatim. Kept as
    // found; see the refactor notes for the suggestion to curate it.
    stack: [
      'Flutter',
      'Dart',
      'Android Studio',
      'Boostrap',
      'HTML',
      'CSS',
      'Javascript',
      'C#',
      'ASP.NET MVC 5',
      'Azure',
      'FireBase',
      'Microsoft SQL',
      'Postman',
      'Json',
      'Rest API Push Notifications',
      'One Signal',
      'XML',
    ],
  },
] satisfies Experience[]);
