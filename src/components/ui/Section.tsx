import type { ReactNode } from 'react';

/**
 * Page section wrapper.
 *
 * Every section shares the same rhythm — the design system's 80px mobile /
 * 160px desktop vertical spacing, the 1180px content cap, and the 20/48px
 * gutters. Centralising it here is what stops the source's problem coming back:
 * that stylesheet pinned each section to a fixed viewport multiple
 * (`height: 720vh` on Projects), so any copy change broke the layout.
 * Nothing here sets a height; sections are as tall as their content.
 */
type Props = {
  id: string;
  children: ReactNode;
  /** Narrow measure for prose-led sections. */
  narrow?: boolean;
  className?: string;
};

export function Section({ id, children, narrow = false, className = '' }: Props) {
  return (
    <section
      id={id}
      // scroll-mt keeps the sticky nav from covering the heading on hash links.
      className={`scroll-mt-20 px-5 py-20 nav:px-12 nav:py-40 ${className}`}
    >
      <div className={`mx-auto w-full ${narrow ? 'max-w-narrow' : 'max-w-content'}`}>
        {children}
      </div>
    </section>
  );
}
