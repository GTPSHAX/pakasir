import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      globals: {
        fetch: 'readonly',
        RequestInit: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      // Add custom rules here
      'key-spacing': ['error', {
        singleLine: { beforeColon: false, afterColon: true },
        multiLine: { beforeColon: false, afterColon: true, align: 'colon' },
      }],
    },
  },
  {
    ignores: ['dist/', 'tests/', 'node_modules/'],
  },
];