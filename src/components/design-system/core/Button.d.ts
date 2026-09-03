import * as React from 'react';

/**
 * Pill button in the EmmaDev graphite/violet language. Hover glows violet, press shrinks to 0.97.
 * @startingPoint section="Core" subtitle="Pill buttons — solid, outline, ghost, gradient" viewport="700x160"
 */
export interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
  /** @default "solid" */
  variant?: 'solid' | 'outline' | 'ghost' | 'gradient';
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
  /** Renders an <a> instead of a <button>. */
  href?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  children?: React.ReactNode;
}
export declare function Button(props: ButtonProps): JSX.Element;
