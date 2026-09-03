import * as React from 'react';

/** Sticky glass top bar: mono brand wordmark left, centred NavLink row, slot on the right. Hidden below 767px in favour of NavToggle + NavPanel. */
export interface NavBarProps extends React.HTMLAttributes<HTMLElement> {
  items?: Array<{ href: string; label: string }>;
  /** href of the section currently in view. */
  activeHref?: string;
  /** Wordmark text — the brand has no logo file, so this renders as mono type. */
  brand?: React.ReactNode;
  /** Right-hand slot, typically social icon links. */
  right?: React.ReactNode;
  onToggle?: () => void;
}
export declare function NavBar(props: NavBarProps): JSX.Element;
