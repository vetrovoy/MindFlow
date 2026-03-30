const js = require('@eslint/js');
const globals = require('globals');
const prettier = require('eslint-plugin-prettier');

module.exports = [
  js.configs.recommended,
  {
    plugins: {
      prettier: prettier,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.react,
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
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
