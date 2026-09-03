import * as React from 'react';

/** Cross-fading screenshot stack for projects with several views (OSC Compliance, Casa Padi). Advances itself every 3s and shows a pill progress indicator. */
export interface MediaCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Image srcs in order. @default [] */
  images?: string[];
  alt?: string;
  /** Ms between slides. @default 3000 */
  interval?: number;
  /** Cross-fade duration in ms. @default 500 */
  fade?: number;
  /** @default var(--radius-md) */
  radius?: string;
}
export declare function MediaCarousel(props: MediaCarouselProps): JSX.Element;
