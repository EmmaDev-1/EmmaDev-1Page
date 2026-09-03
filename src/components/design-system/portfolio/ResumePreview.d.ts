import * as React from 'react';

/** Resume thumbnail in the rotating gradient frame, with a scrim caption and a download link. One per site, in the Curriculum section. */
export interface ResumePreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Preview image, e.g. assets/docs/cv.png */
  src: string;
  /** PDF to download. */
  href?: string;
  /** @default 610 */
  width?: number;
  /** @default 790 */
  height?: number;
  /** Scrim caption. @default "Download CV" */
  label?: string;
}
export declare function ResumePreview(props: ResumePreviewProps): JSX.Element;
