import * as React from 'react';

/** Small mono-type pill labelling a technology or skill. Groups of these appear at the foot of every experience card. */
export interface TagChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default "neutral" */
  tone?: 'neutral' | 'accent';
  /** Adds hover lift; only set when the chip actually does something. @default false */
  interactive?: boolean;
  children?: React.ReactNode;
}
export declare function TagChip(props: TagChipProps): JSX.Element;
