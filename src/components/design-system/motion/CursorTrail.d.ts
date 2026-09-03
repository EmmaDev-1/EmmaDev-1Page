/** The site's signature pointer trail: 13 violet dots chasing the cursor, shrinking down the chain. Mount once per page, at the root. No-ops on touch devices and under prefers-reduced-motion. */
export interface CursorTrailProps {
  /** Number of dots. @default 13 */
  count?: number;
  /** Diameter of the leading dot in px. @default 24 */
  dotSize?: number;
  /** Colour ramp, leading dot first. @default the violet trail ramp */
  colors?: string[];
  /** Easing factor toward the next dot, 0-1. @default 0.3 */
  follow?: number;
}
export declare function CursorTrail(props: CursorTrailProps): JSX.Element | null;
