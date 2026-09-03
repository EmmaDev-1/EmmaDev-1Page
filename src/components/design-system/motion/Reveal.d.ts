import * as React from 'react';

/** Wraps anything that should fade, un-blur and slide into place on scroll. This is the site's default entrance — content should not simply appear. */
export interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  /** Direction the element travels from. @default "up" */
  from?: 'up' | 'down' | 'left' | 'right' | 'none';
  /** Stagger delay in ms. @default 0 */
  delay?: number;
  /** CSS duration. @default var(--dur-reveal) */
  duration?: string;
  /** Include the 5px blur-out the source used. @default true */
  blur?: boolean;
  /** Reveal once and stop observing. @default true */
  once?: boolean;
  /** @default "div" */
  as?: keyof JSX.IntrinsicElements;
}
export declare function Reveal(props: RevealProps): JSX.Element;
