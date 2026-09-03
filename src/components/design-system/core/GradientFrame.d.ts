import * as React from 'react';

/** Panel wrapped in a rotating gradient edge — the site's resume/document treatment. Needs an explicit width and height on the wrapper. */
export interface GradientFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  /** @default var(--radius-lg) */
  radius?: string;
  /** Border thickness in px. @default 2 */
  inset?: number;
  /** Rotation duration. @default var(--dur-orbit) */
  speed?: string;
  children?: React.ReactNode;
}
export declare function GradientFrame(props: GradientFrameProps): JSX.Element;
