import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

/**
 * Correctness and Next-specific rules only.
 * Formatting is Prettier's job; design-system adherence is oxlint's job
 * (see .design-system/adherence.oxlintrc.json).
 */
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'public/**',
    // Vendored from Claude Design — never hand-edited, so never linted here.
    'src/components/design-system/**',
    '.design-system/**',
    'Images/**',
    'Docs/**',
  ]),
]);
