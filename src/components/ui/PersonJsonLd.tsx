import { experience, profile } from '@/content';

/**
 * schema.org Person markup.
 *
 * The source page had no structured data at all, so search engines had to infer
 * who the site was about from the prose. This states it: the name, the role,
 * the profiles that verify identity, and the organisations worked for.
 *
 * Everything here is derived from the content layer — nothing is restated, so
 * it cannot drift out of sync with the visible page.
 */
export function PersonJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.role,
    description: profile.aboutBody,
    sameAs: profile.social.map((link) => link.href),
    worksFor: experience
      // "Personal" is a section of the page, not an employer.
      .filter((role) => role.id !== 'personal')
      .map((role) => ({ '@type': 'Organization', name: role.org })),
    knowsAbout: Array.from(new Set(experience.flatMap((role) => role.stack))),
  };

  return (
    <script
      type="application/ld+json"
      // Content is authored in this repo, not user input; there is nothing to escape.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
