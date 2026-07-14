import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

import base from './base.js';

/**
 * ESLint flat config for React 19 applications and libraries.
 *
 * @type {import('typescript-eslint').ConfigArray}
 */
export default [
  ...base,
  {
    files: ['**/*.{ts,tsx}'],
    ...react.configs.flat.recommended,
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: { version: 'detect' },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // React 19 + the new JSX transform make these redundant.
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },
];
