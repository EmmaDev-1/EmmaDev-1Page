import * as React from 'react';

/** One item in the top nav or slide-in panel. Hover turns it into a glowing violet pill; the active item keeps a gradient underline. */
export interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  /** Marks the section currently in view. @default false */
  active?: boolean;
  children?: React.ReactNode;
}
export declare function NavLink(props: NavLinkProps): JSX.Element;
