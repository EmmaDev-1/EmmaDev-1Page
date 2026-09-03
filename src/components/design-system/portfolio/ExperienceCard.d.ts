import * as React from 'react';

/** Work-history card: mono period eyebrow, organisation, role, prose bullets, then the technology chips. Gradient hairline across the top edge. */
export interface ExperienceCardProps extends React.HTMLAttributes<HTMLElement> {
  /** Organisation name — the card's headline. */
  org: React.ReactNode;
  /** Job title or context line. */
  role?: React.ReactNode;
  /** Short uppercase period label, e.g. "2022 — Present". */
  period?: React.ReactNode;
  /** Achievement paragraphs. @default [] */
  points?: React.ReactNode[];
  /** Technologies rendered as TagChips. @default [] */
  stack?: string[];
}
export declare function ExperienceCard(props: ExperienceCardProps): JSX.Element;
