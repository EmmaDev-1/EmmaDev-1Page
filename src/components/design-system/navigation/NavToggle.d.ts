import * as React from 'react';

/** Three-bar menu button shown below 767px. Morphs into an X when open. */
export interface NavToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** @default false */
  open?: boolean;
}
export declare function NavToggle(props: NavToggleProps): JSX.Element;
