import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import base from './base.js';
import nestjs from './nestjs.js';
import react from './react.js';

/**
 * Single composed flat config for the whole monorepo. Each app/package gets
 * its ruleset applied via path-scoped `files` so that one config at the repo
 * root drives the editor, `pnpm lint`, and `lint-staged` identically —
 * avoiding the cwd-sensitivity of multiple flat configs.
 *
 * @type {import('typescript-eslint').ConfigArray}
 */
export default tseslint.config(
  {
    ignores: ['**/dist/**', '**/build/**', '**/coverage/**', '**/.turbo/**', '**/node_modules/**'],
  },

  // Shared library code (Node/isomorphic, no framework).
  {
    files: ['packages/shared/**/*.ts'],
    extends: base,
  },

  // Web client (React 19, browser).
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    extends: react,
  },

  // API service (NestJS, Node).
  {
    files: ['apps/api/**/*.ts'],
    extends: nestjs,
  },

  // Loose root-level JS config files — no type-aware linting.
  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node },
    },
  },
);
