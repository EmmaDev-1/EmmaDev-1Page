import * as React from 'react';

/** Off-canvas mobile drawer: 75% width, graphite-500 panel, rounded outer corners, links staggered in at 60ms intervals. Social links go in the footer slot. */
export interface NavPanelProps extends React.HTMLAttributes<HTMLElement> {
  /** @default false */
  open?: boolean;
  items?: Array<{ href: string; label: string }>;
  activeHref?: string;
  onClose?: () => void;
  /** Bottom slot — the source put LinkedIn + GitHub icons here. */
  footer?: React.ReactNode;
}
export declare function NavPanel(props: NavPanelProps): JSX.Element;
