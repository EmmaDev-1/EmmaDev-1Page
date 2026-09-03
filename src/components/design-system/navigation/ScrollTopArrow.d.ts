import * as React from 'react';

/** Fixed bottom-right back-to-top arrow using assets/icons/arrow1.png. Hover blooms violet over 700ms. Hidden on mobile in the source. */
export interface ScrollTopArrowProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** @default "#home" */
  href?: string;
  /** @default "../../assets/icons" */
  assetBase?: string;
  /** @default 50 */
  size?: number;
  /** Fade in once the user has scrolled past the hero. @default true */
  visible?: boolean;
}
export declare function ScrollTopArrow(props: ScrollTopArrowProps): JSX.Element;
