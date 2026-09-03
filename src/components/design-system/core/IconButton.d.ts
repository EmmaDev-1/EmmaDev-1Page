import * as React from 'react';

/** Circular icon control — carousel arrows, close affordances, round links. Hover fills translucent violet. */
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible name — required, the control has no visible text. */
  label: string;
  /** Diameter in px. @default 48 */
  size?: number;
  /** Glyph or icon node (e.g. the ❮ / ❯ characters used by the source carousel). */
  glyph?: React.ReactNode;
  children?: React.ReactNode;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
