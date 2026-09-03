import * as React from 'react';

/**
 * A single project: media one side, title + description + stack the other, revealing from opposite edges. Alternate `flip` down the list.
 * @startingPoint section="Portfolio" subtitle="Alternating project row with media and stack" viewport="1180x420"
 */
export interface ProjectRowProps extends React.HTMLAttributes<HTMLElement> {
  title: React.ReactNode;
  description: React.ReactNode;
  /** Screenshot, GIF or MediaCarousel. */
  media?: React.ReactNode;
  /** Technology names rendered as TagChips. @default [] */
  stack?: string[];
  /** Put the media on the right. @default false */
  flip?: boolean;
  /** 1-based position; rendered as a zero-padded mono index. */
  index?: number;
}
export declare function ProjectRow(props: ProjectRowProps): JSX.Element;
