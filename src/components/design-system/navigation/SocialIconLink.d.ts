import * as React from 'react';

/** LinkedIn / GitHub icon link using the site's own PNG marks from assets/icons. Hover scales to 1.4x and doubles brightness. */
export interface SocialIconLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** @default "github" */
  network?: 'github' | 'linkedin';
  href?: string;
  /** Icon edge in px. @default 38 */
  size?: number;
  /** Relative path to assets/icons from the consuming page. @default "../../assets/icons" */
  assetBase?: string;
  label?: string;
}
export declare function SocialIconLink(props: SocialIconLinkProps): JSX.Element;
