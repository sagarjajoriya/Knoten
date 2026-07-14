import globals from 'globals';

import base from './base.js';

/**
 * ESLint flat config for NestJS services running on Node.
 *
 * @type {import('typescript-eslint').ConfigArray}
 */
export default [
  ...base,
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // NestJS relies heavily on decorators and DI classes.
      '@typescript-eslint/no-extraneous-class': 'off',
      // Interceptors / guards frequently return `any`-typed observables from the framework.
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
  },
];
