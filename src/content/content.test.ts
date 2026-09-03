import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { experience, navItems, profile, projects, SECTION_IDS } from './index';

const PUBLIC = path.resolve(process.cwd(), 'public');
const publicPath = (webPath: string) => path.join(PUBLIC, webPath.replace(/^\//, ''));

/**
 * These assert the things a type cannot: that ids are unique, that the nav and
 * the sections agree, and — the one that actually catches regressions — that
 * every asset the content points at has really been produced by the media
 * pipeline. A renamed output file is otherwise a silent 404 in production.
 */
describe('content invariants', () => {
  it('parses every schema at import time', () => {
    expect(projects.length).toBe(8);
    expect(experience.length).toBe(3);
    expect(profile.social.length).toBeGreaterThan(0);
  });

  it('has unique project ids', () => {
    const ids = projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has unique experience ids', () => {
    const ids = experience.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('points every nav item at a real section', () => {
    const sections = new Set(Object.values(SECTION_IDS).map((id) => `#${id}`));
    for (const item of navItems) {
      expect(sections, `nav item ${item.label}`).toContain(item.href);
    }
  });

  it('covers every section with a nav item', () => {
    const hrefs = new Set(navItems.map((item) => item.href));
    for (const id of Object.values(SECTION_IDS)) {
      expect(hrefs, `section ${id}`).toContain(`#${id}`);
    }
  });

  it('gives every project meaningful alt text', () => {
    for (const project of projects) {
      // "Imagen" was the source site's placeholder on nearly every image.
      expect(project.alt.length, project.id).toBeGreaterThan(20);
      expect(project.alt.toLowerCase()).not.toBe('imagen');
    }
  });
});

describe('media assets exist on disk', () => {
  it.each(projects.map((p) => [p.id, p.media] as const))('%s', (id, media) => {
    if (media.kind === 'video') {
      for (const suffix of ['.mp4', '.webm', '.poster.webp']) {
        const file = publicPath(`${media.basePath}${suffix}`);
        expect(existsSync(file), `${id}: missing ${media.basePath}${suffix}`).toBe(true);
      }
    } else if (media.kind === 'carousel') {
      for (const image of media.images) {
        expect(existsSync(publicPath(image)), `${id}: missing ${image}`).toBe(true);
      }
    } else {
      expect(existsSync(publicPath(media.src)), `${id}: missing ${media.src}`).toBe(true);
    }
  });

  it('ships the portrait, the CV preview and the CV itself', () => {
    expect(existsSync(publicPath(profile.portrait.src))).toBe(true);
    expect(existsSync(publicPath(profile.resume.preview.src))).toBe(true);
    expect(existsSync(publicPath(profile.resume.pdf))).toBe(true);
  });

  it('ships the three design-system icons', () => {
    for (const icon of ['/icons/github.png', '/icons/linkedin.png', '/icons/arrow1.png']) {
      expect(existsSync(publicPath(icon)), icon).toBe(true);
    }
  });
});

describe('media budget', () => {
  it('keeps every encoded video well under the old GIF sizes', async () => {
    const { statSync } = await import('node:fs');
    const videos = projects.filter((p) => p.media.kind === 'video');

    for (const project of videos) {
      if (project.media.kind !== 'video') continue;
      const mp4 = statSync(publicPath(`${project.media.basePath}.mp4`)).size;
      // The smallest source GIF was 6.8 MB; 4 MB is a generous ceiling that
      // still fails loudly if someone drops a raw export back in.
      expect(mp4, `${project.id} mp4`).toBeLessThan(4 * 1024 * 1024);
    }
  });
});
