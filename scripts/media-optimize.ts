/**
 * Media pipeline.
 *
 * The source site shipped 94 MB of raw assets — six screen-recording GIFs
 * between 7 MB and 36 MB, plus unoptimised PNGs — all of them loaded eagerly.
 * This re-encodes them once, into formats a browser can stream:
 *
 *   GIF  ->  MP4 (H.264) + WebM (VP9) + a WebP poster frame
 *   PNG  ->  WebP, capped at 1600px on the long edge
 *   JPEG ->  WebP
 *
 * Masters stay in `assets/source/` and are never served. Output goes to
 * `public/`, is committed, and is content-stable — re-running produces the same
 * bytes, so this is not part of the build.
 *
 * Run with: pnpm media:build
 */
import { execFile } from 'node:child_process';
import { mkdir, readdir, copyFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import ffmpegPath from 'ffmpeg-static';
import sharp from 'sharp';

const run = promisify(execFile);

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'assets', 'source');
const PUBLIC = path.join(ROOT, 'public');

/** Tallest we ever render a phone recording, at 2x. Anything above is waste. */
const MAX_VIDEO_HEIGHT = 1080;
/** Screenshots are shown at most half the 1180px content column, at 2x. */
const MAX_IMAGE_WIDTH = 1600;

if (!ffmpegPath) throw new Error('ffmpeg-static did not resolve a binary path');
const FFMPEG: string = ffmpegPath;

type VideoJob = { from: string; to: string };
type ImageJob = { from: string; to: string; size?: { width: number; height: number } };

const videoJobs: VideoJob[] = [
  { from: 'projects/Pai.gif', to: 'media/projects/pay' },
  { from: 'projects/Huble.gif', to: 'media/projects/huble' },
  { from: 'projects/WappiFood.gif', to: 'media/projects/wappi-food' },
  { from: 'projects/weather_app.gif', to: 'media/projects/my-weather' },
  { from: 'projects/noteApp.gif', to: 'media/projects/my-notes' },
  { from: 'projects/Pokedex.gif', to: 'media/projects/pokedex' },
];

const imageJobs: ImageJob[] = [
  { from: 'projects/CasaPadi/1.png', to: 'media/projects/casa-padi-1.webp' },
  { from: 'projects/CasaPadi/2.png', to: 'media/projects/casa-padi-2.webp' },
  { from: 'projects/CasaPadi/3.png', to: 'media/projects/casa-padi-3.webp' },
  { from: 'projects/CasaPadi/4.png', to: 'media/projects/casa-padi-4.webp' },
  { from: 'projects/Osc1.png', to: 'media/projects/osc-1.webp' },
  { from: 'projects/Osc2.png', to: 'media/projects/osc-2.webp' },
  { from: 'projects/Osc3.png', to: 'media/projects/osc-3.webp' },
  { from: 'projects/Osc4.png', to: 'media/projects/osc-4.webp' },
  {
    from: 'aboutMe/EmmaDevAnimated2.jpeg',
    to: 'media/portrait/emma.webp',
    size: { width: 800, height: 800 },
  },
  { from: 'docs/cv.png', to: 'media/docs/cv.webp', size: { width: 1200, height: 1553 } },
];

/** Copied untouched: the design system's whole icon vocabulary is these three. */
const copyJobs = [
  { from: 'icons/github.png', to: 'icons/github.png' },
  { from: 'icons/linkedin.png', to: 'icons/linkedin.png' },
  { from: 'icons/arrow1.png', to: 'icons/arrow1.png' },
  { from: 'docs/Emmanuel_Aguilar_CV.pdf', to: 'docs/Emmanuel_Aguilar_CV.pdf' },
];

/** H.264 needs even dimensions; VP9 is happier with them too. */
const even = (n: number) => Math.max(2, Math.round(n / 2) * 2);

async function ffmpeg(args: string[]): Promise<void> {
  await run(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-y', ...args], {
    maxBuffer: 1024 * 1024 * 64,
  });
}

async function sizeOf(file: string): Promise<number> {
  return (await stat(file)).size;
}

const kb = (bytes: number) => `${(bytes / 1024).toFixed(0)} KB`;

async function encodeVideo(job: VideoJob): Promise<{ before: number; after: number }> {
  const input = path.join(SRC, job.from);
  const outBase = path.join(PUBLIC, job.to);
  await mkdir(path.dirname(outBase), { recursive: true });

  const meta = await sharp(input, { animated: false }).metadata();
  const srcW = meta.width ?? 0;
  const srcH = meta.height ?? 0;
  if (!srcW || !srcH) throw new Error(`Could not read dimensions of ${job.from}`);

  const factor = Math.min(1, MAX_VIDEO_HEIGHT / srcH);
  const width = even(srcW * factor);
  const height = even(srcH * factor);
  const scale = `scale=${width}:${height}:flags=lanczos`;

  // H.264 baseline-friendly settings: yuv420p and faststart so the first frame
  // paints before the file finishes downloading.
  await ffmpeg([
    '-i',
    input,
    '-vf',
    scale,
    '-c:v',
    'libx264',
    '-crf',
    '30',
    '-preset',
    'slow',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    '-an',
    `${outBase}.mp4`,
  ]);

  await ffmpeg([
    '-i',
    input,
    '-vf',
    scale,
    '-c:v',
    'libvpx-vp9',
    '-crf',
    '40',
    '-b:v',
    '0',
    '-row-mt',
    '1',
    '-deadline',
    'good',
    '-cpu-used',
    '4',
    '-an',
    `${outBase}.webm`,
  ]);

  // Poster: first frame, so the box is never empty while the video buffers.
  await sharp(input, { page: 0 })
    .resize(width, height, { fit: 'inside' })
    .webp({ quality: 72 })
    .toFile(`${outBase}.poster.webp`);

  const before = await sizeOf(input);
  const after =
    (await sizeOf(`${outBase}.mp4`)) +
    (await sizeOf(`${outBase}.webm`)) +
    (await sizeOf(`${outBase}.poster.webp`));

  console.log(
    `  ${job.from.padEnd(30)} ${kb(before).padStart(10)} -> ${kb(after).padStart(9)}  ` +
      `(${(100 - (after / before) * 100).toFixed(1)}% smaller, ${width}x${height})`,
  );
  return { before, after };
}

async function encodeImage(job: ImageJob): Promise<{ before: number; after: number }> {
  const input = path.join(SRC, job.from);
  const output = path.join(PUBLIC, job.to);
  await mkdir(path.dirname(output), { recursive: true });

  const pipeline = sharp(input);
  if (job.size) {
    pipeline.resize(job.size.width, job.size.height, { fit: 'cover', position: 'top' });
  } else {
    pipeline.resize({ width: MAX_IMAGE_WIDTH, withoutEnlargement: true });
  }
  await pipeline.webp({ quality: 80, effort: 6 }).toFile(output);

  const before = await sizeOf(input);
  const after = await sizeOf(output);
  console.log(
    `  ${job.from.padEnd(30)} ${kb(before).padStart(10)} -> ${kb(after).padStart(9)}  ` +
      `(${(100 - (after / before) * 100).toFixed(1)}% smaller)`,
  );
  return { before, after };
}

async function main(): Promise<void> {
  try {
    await readdir(SRC);
  } catch {
    throw new Error(
      `Source masters not found at ${SRC}. They live in assets/source/ — see scripts/README.`,
    );
  }

  let before = 0;
  let after = 0;

  console.log('\nRe-encoding screen recordings (GIF -> MP4 + WebM + poster)');
  for (const job of videoJobs) {
    const r = await encodeVideo(job);
    before += r.before;
    after += r.after;
  }

  console.log('\nRe-encoding stills (-> WebP)');
  for (const job of imageJobs) {
    const r = await encodeImage(job);
    before += r.before;
    after += r.after;
  }

  console.log('\nCopying untouched assets');
  for (const job of copyJobs) {
    const output = path.join(PUBLIC, job.to);
    await mkdir(path.dirname(output), { recursive: true });
    await copyFile(path.join(SRC, job.from), output);
    const size = await sizeOf(output);
    before += size;
    after += size;
    console.log(`  ${job.from.padEnd(30)} ${kb(size).padStart(10)}`);
  }

  console.log(
    `\nTotal: ${kb(before)} -> ${kb(after)} ` +
      `(${(100 - (after / before) * 100).toFixed(1)}% smaller)\n`,
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
