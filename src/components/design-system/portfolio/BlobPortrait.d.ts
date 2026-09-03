import * as React from 'react';

/** The About Me portrait: a photo whose corners morph through four organic radii on a 10s loop, over a blurred gradient halo. */
export interface BlobPortraitProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt?: string;
  /** Square edge in px. @default 400 */
  size?: number;
  /** Blurred gradient halo behind the photo. @default true */
  ring?: boolean;
}
export declare function BlobPortrait(props: BlobPortraitProps): JSX.Element;
