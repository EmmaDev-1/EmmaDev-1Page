'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { MediaCarousel } from '@/components/design-system';
import { usePrefersReducedMotion } from '@/lib/hooks';
import type { Media } from '@/content';

/**
 * Renders whichever media a project carries.
 *
 * This is the seam the design system leaves open: `ProjectRow` takes `media` as
 * a ReactNode, so the re-encoded video pipeline plugs in without the vendored
 * component knowing anything about it.
 *
 * The source shipped these as autoplaying GIFs, all six downloading on page
 * load. Here nothing is fetched until the element is near the viewport
 * (`preload="none"` plus an observer that calls play), and playback stops again
 * once it leaves — so scrolling past a project costs nothing.
 */

type Props = {
  media: Media;
  alt: string;
  /** Eager-load the first row; everything below the fold stays lazy. */
  priority?: boolean;
};

export function ProjectMedia({ media, alt, priority = false }: Props) {
  if (media.kind === 'carousel') {
    return <MediaCarousel images={media.images} alt={alt} />;
  }

  if (media.kind === 'image') {
    return (
      <Image
        src={media.src}
        alt={alt}
        width={media.width}
        height={media.height}
        priority={priority}
        className="h-auto w-full"
      />
    );
  }

  return <LazyVideo media={media} alt={alt} />;
}

function LazyVideo({ media, alt }: { media: Extract<Media, { kind: 'video' }>; alt: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    // Someone who asked for reduced motion gets the poster and real controls
    // instead of a clip that starts on its own.
    if (reducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // play() rejects when the tab is backgrounded or autoplay is
            // blocked; neither is an error worth surfacing.
            void video.play().catch(() => undefined);
          } else if (!video.paused) {
            video.pause();
          }
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <video
      ref={ref}
      poster={`${media.basePath}.poster.webp`}
      width={media.width}
      height={media.height}
      muted
      loop
      playsInline
      preload="none"
      controls={reducedMotion}
      aria-label={alt}
      className="mx-auto block h-auto max-h-[var(--media-max-height)] w-auto max-w-full"
    >
      <source src={`${media.basePath}.webm`} type="video/webm" />
      <source src={`${media.basePath}.mp4`} type="video/mp4" />
    </video>
  );
}
