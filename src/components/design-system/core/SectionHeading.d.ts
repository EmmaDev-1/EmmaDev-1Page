import * as React from 'react';

/** Section title: optional mono uppercase eyebrow, headline, and a 72px gradient rule. Every page section opens with one. */
export interface SectionHeadingProps extends React.HTMLAttributes<HTMLElement> {
  /** Short uppercase mono label above the title, e.g. "02 — Projects". */
  eyebrow?: string;
  /** @default "left" */
  align?: 'left' | 'center';
  /** Show the 72px gradient rule. @default true */
  rule?: boolean;
  children?: React.ReactNode;
}
export declare function SectionHeading(props: SectionHeadingProps): JSX.Element;
