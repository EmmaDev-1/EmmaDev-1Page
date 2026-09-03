import { readFileSync } from 'node:fs';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

/**
 * Design-system adherence.
 *
 * Separate from eslint.config.mjs on purpose: this config answers "does this
 * code respect the design system?", not "is this code correct?". Keeping them
 * apart means a failing adherence run names exactly one kind of problem, and
 * the rule bodies stay a vendored artefact rather than something hand-edited
 * alongside our own lint preferences.
 *
 * The rules come from .design-system/adherence.rules.json, which is the design
 * system's own file with the import paths remapped. They are esquery selectors,
 * so they need ESLint — oxlint has no `no-restricted-syntax`.
 *
 * Run with: pnpm lint:adherence
 */
const { rules } = JSON.parse(
  readFileSync(new URL('./.design-system/adherence.rules.json', import.meta.url), 'utf8'),
);

export default defineConfig([
  globalIgnores([
    '.next/**',
    'node_modules/**',
    'public/**',
    'assets/**',
    // Vendored design system: it defines the language, it is not judged by it.
    'src/components/design-system/**',
    // Compatibility shim for the vendored declarations.
    'src/types/**',
  ]),
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules,
  },
]);
