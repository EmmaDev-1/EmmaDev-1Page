import * as React from 'react';

/**
 * Text filled with the EmmaDev brand gradient (violet -> ember -> violet), sweeping on a loop.
 * Use for the hero line and nothing else on a given screen — one gradient headline per view.
 */
export interface GradientTextProps extends React.HTMLAttributes<HTMLElement> {
  /** Element to render. @default "span" */
  as?: keyof JSX.IntrinsicElements;
  /** Run the continuous sweep. @default true */
  animate?: boolean;
  /** CSS duration override, e.g. "4s". @default var(--dur-gradient-cycle) */
  speed?: string;
  children?: React.ReactNode;
}
export declare function GradientText(props: GradientTextProps): JSX.Element;
