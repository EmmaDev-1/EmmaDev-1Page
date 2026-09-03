/**
 * Design-system drift check.
 *
 * The design system lives in a Claude Design project; what is in this repo is a
 * vendored copy. Copies rot. This asserts the three things that actually break
 * when they do:
 *
 *   1. every token the adherence config knows about is declared in the
 *      vendored CSS — a token can be referenced by a component and silently
 *      resolve to nothing;
 *   2. every component in the manifest exists on disk and is re-exported from
 *      the barrel, which is the only import path the adherence lint allows;
 *   3. every colour, radius, shadow and type token is reachable from Tailwind,
 *      so `bg-surface-card` and `var(--surface-card)` cannot diverge.
 *
 * Run with: pnpm ds:sync
 */
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
/**
 * The inventory lives beside the lint config rather than inside it: oxlint
 * rejects unknown top-level fields, so the manifest cannot ride along in
 * adherence.oxlintrc.json the way it does upstream.
 */
const MANIFEST = path.join(ROOT, '.design-system', 'manifest.json');
const TOKENS_DIR = path.join(ROOT, 'src', 'styles', 'design-system', 'tokens');
const COMPONENTS_DIR = path.join(ROOT, 'src', 'components', 'design-system');
const BARREL = path.join(COMPONENTS_DIR, 'index.ts');
const GLOBALS = path.join(ROOT, 'src', 'styles', 'globals.css');

/**
 * Tokens that are deliberately not surfaced as Tailwind utilities: the organic
 * blob radii are only ever consumed by a keyframe, the trail ramp only by
 * CursorTrail, and the legacy navy is retained for reference but must not be
 * usable in new work.
 */
const NOT_IN_THEME = /^--(radius-blob-|trail-|legacy-)/;
/** Namespaces Tailwind can express. Durations and raw spacing stay CSS-only. */
const THEME_RELEVANT =
  /^--(graphite-|ink-|violet-|ember-|surface-|border-|accent|bg-page|focus-ring|text-|leading-|tracking-|radius-|shadow-|glow-|font-|content-)/;

type Manifest = {
  components: Record<string, unknown>;
  tokens: string[];
};

const problems: string[] = [];
const fail = (message: string) => problems.push(message);

async function declaredTokens(): Promise<Set<string>> {
  const files = (await readdir(TOKENS_DIR)).filter((f) => f.endsWith('.css'));
  const declared = new Set<string>();

  for (const file of files) {
    const css = await readFile(path.join(TOKENS_DIR, file), 'utf8');
    for (const match of css.matchAll(/^\s*(--[a-z0-9-]+)\s*:/gim)) {
      const name = match[1];
      if (name) declared.add(name);
    }
  }
  return declared;
}

async function main(): Promise<void> {
  const { tokens, components } = JSON.parse(await readFile(MANIFEST, 'utf8')) as Manifest;

  // 1 — tokens declared in the vendored CSS
  const declared = await declaredTokens();
  const missing = tokens.filter((token) => !declared.has(token));
  if (missing.length > 0) {
    fail(`Tokens missing from src/styles/design-system/tokens:\n    ${missing.join('\n    ')}`);
  }

  // 2 — components on disk and exported from the barrel
  const barrel = await readFile(BARREL, 'utf8');
  const componentFiles = new Set<string>();
  for (const group of await readdir(COMPONENTS_DIR, { withFileTypes: true })) {
    if (!group.isDirectory()) continue;
    for (const file of await readdir(path.join(COMPONENTS_DIR, group.name))) {
      if (file.endsWith('.jsx')) componentFiles.add(file.replace(/\.jsx$/, ''));
    }
  }

  for (const name of Object.keys(components)) {
    if (!componentFiles.has(name)) fail(`Component ${name} is in the manifest but not on disk.`);
    else if (!new RegExp(`export \\{ ${name} \\}`).test(barrel)) {
      fail(`Component ${name} exists but is not re-exported from the barrel.`);
    }
  }

  // 3 — theme-relevant tokens reachable from Tailwind
  const globals = await readFile(GLOBALS, 'utf8');
  const unbridged = tokens.filter(
    (token) =>
      THEME_RELEVANT.test(token) && !NOT_IN_THEME.test(token) && !globals.includes(`var(${token})`),
  );
  if (unbridged.length > 0) {
    fail(
      `Tokens not bridged into Tailwind's @theme in globals.css:\n    ${unbridged.join('\n    ')}`,
    );
  }

  if (problems.length > 0) {
    console.error('\nDesign-system drift detected:\n');
    for (const problem of problems) console.error(`  - ${problem}`);
    console.error('');
    process.exit(1);
  }

  console.log(
    `\nDesign system in sync: ${tokens.length} tokens, ` +
      `${Object.keys(components).length} components.\n`,
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
