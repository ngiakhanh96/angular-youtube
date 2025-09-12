import baseConfig from '../eslint.base.config.mjs';
import playwright from 'eslint-plugin-playwright';

export default [
  ...baseConfig,
  playwright.configs['flat/recommended'],
  {
    files: ['**/*.ts', '**/*.js'],
    // Override or add rules here
    rules: {},
  },
];
