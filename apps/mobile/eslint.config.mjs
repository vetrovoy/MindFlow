import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  js.configs.recommended,
  {
    plugins: {
      prettier: prettier,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        __DEV__: 'readonly',
        __dirname: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  {
    ignores: [
      '.prettierrc.js',
      'babel.config.js',
      'jest.config.js',
      'jest.setup.js',
      'metro.config.js',
      'jest-resolver.cjs',
      'node_modules/',
      'android/',
      'ios/',
    ],
  },
  {
    rules: {
      'prettier/prettier': 'warn',
    },
  },
];
