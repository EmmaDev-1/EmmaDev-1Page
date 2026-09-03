import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProjectMedia } from './ProjectMedia';
import type { Media } from '@/content';

/**
 * The point of this component is that a project's media kind decides the
 * element, and that video never eagerly downloads — that second property is the
 * whole reason the page dropped from 94 MB to under 10 MB, and it is a one-word
 * regression away (`preload="auto"`), so it is asserted rather than assumed.
 */
describe('ProjectMedia', () => {
  it('renders a video with both encodings and a poster', () => {
    const media: Media = {
      kind: 'video',
      basePath: '/media/projects/pay',
      width: 730,
      height: 1514,
    };

    const { container } = render(<ProjectMedia media={media} alt="Pay demo" />);
    const video = container.querySelector('video');

    expect(video).not.toBeNull();
    expect(video).toHaveAttribute('poster', '/media/projects/pay.poster.webp');

    const sources = [...container.querySelectorAll('source')].map((s) => s.getAttribute('src'));
    // WebM first: browsers pick the first type they support, and it is smaller.
    expect(sources).toEqual(['/media/projects/pay.webm', '/media/projects/pay.mp4']);
  });

  it('never eagerly downloads video', () => {
    const media: Media = {
      kind: 'video',
      basePath: '/media/projects/pokedex',
      width: 600,
      height: 1342,
    };

    const { container } = render(<ProjectMedia media={media} alt="Pokedex demo" />);
    expect(container.querySelector('video')).toHaveAttribute('preload', 'none');
  });

  it('labels the video for assistive technology', () => {
    const media: Media = {
      kind: 'video',
      basePath: '/media/projects/huble',
      width: 600,
      height: 1342,
    };

    render(<ProjectMedia media={media} alt="Huble demo" />);
    expect(screen.getByLabelText('Huble demo')).toBeInTheDocument();
  });

  it('renders every carousel frame', () => {
    const media: Media = {
      kind: 'carousel',
      images: ['/media/projects/osc-1.webp', '/media/projects/osc-2.webp'],
    };

    const { container } = render(<ProjectMedia media={media} alt="OSC screens" />);
    expect(container.querySelectorAll('img')).toHaveLength(2);
  });

  it('renders a still image through next/image', () => {
    const media: Media = {
      kind: 'image',
      src: '/media/portrait/emma.webp',
      width: 800,
      height: 800,
    };

    render(<ProjectMedia media={media} alt="A portrait" />);
    expect(screen.getByAltText('A portrait')).toBeInTheDocument();
  });
});
