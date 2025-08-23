import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import js from '@eslint/js';
import nxEslintPlugin from '@nx/eslint-plugin';
import ngrxEslintPlugin from '@ngrx/eslint-plugin';
import tsEslintPlugin from '@typescript-eslint/eslint-plugin';
import prettierConfig from 'eslint-config-prettier';
import cypressPlugin from 'eslint-plugin-cypress';

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: js.configs.recommended,
});

export default [
  {
    ignores: ['**/dist'],
  },
  {
    plugins: {
      '@nx': nxEslintPlugin,
      '@ngrx': ngrxEslintPlugin,
    },
  },
  {
    files: ['src/**/*.ts', 'modules/**/*.ts'],
    rules: {
      ...tsEslintPlugin.configs.recommended.rules,
    },
  },
  ...compat
    .config({
      extends: ['plugin:@ngrx/signals'],
    })
    .map((config) => ({
      ...config,
      files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
      rules: {
        ...config.rules,
        '@nx/enforce-module-boundaries': [
          'error',
          {
            enforceBuildableLibDependency: true,
            allow: [],
            depConstraints: [
              {
                sourceTag: 'scope:details-page-feature',
                onlyDependOnLibsWithTags: [
                  'scope:details-page-ui',
                  'scope:details-page-data-access',
                  'scope:shared-ui',
                  'scope:shared-data-access',
                ],
              },
              {
                sourceTag: 'scope:header-feature',
                onlyDependOnLibsWithTags: [
                  'scope:header-ui',
                  'scope:header-data-access',
                  'scope:shared-ui',
                  'scope:shared-data-access',
                ],
              },
              {
                sourceTag: 'scope:home-page-feature',
                onlyDependOnLibsWithTags: [
                  'scope:home-page-ui',
                  'scope:home-page-data-access',
                  'scope:shared-ui',
                  'scope:shared-data-access',
                ],
              },
              {
                sourceTag: 'scope:search-page-feature',
                onlyDependOnLibsWithTags: [
                  'scope:search-page-ui',
                  'scope:search-page-data-access',
                  'scope:shared-ui',
                  'scope:shared-data-access',
                ],
              },
              {
                sourceTag: 'scope:shell-feature',
                onlyDependOnLibsWithTags: [
                  'scope:*-feature',
                  'scope:*-data-access',
                  'scope:shell-ui',
                  'scope:shared-ui',
                ],
              },
              {
                sourceTag: 'scope:sidebar-feature',
                onlyDependOnLibsWithTags: [
                  'scope:sidebar-ui',
                  'scope:shared-ui',
                  'scope:shared-data-access',
                ],
              },
              {
                sourceTag: 'scope:details-page-ui',
                onlyDependOnLibsWithTags: [
                  'scope:details-page-data-access',
                  'scope:shared-ui',
                  'scope:shared-data-access',
                ],
              },
              {
                sourceTag: 'scope:header-ui',
                onlyDependOnLibsWithTags: [
                  'scope:header-data-access',
                  'scope:shared-ui',
                  'scope:shared-data-access',
                ],
              },
              {
                sourceTag: 'scope:home-page-ui',
                onlyDependOnLibsWithTags: [
                  'scope:home-page-data-access',
                  'scope:shared-ui',
                  'scope:shared-data-access',
                ],
              },
              {
                sourceTag: 'scope:search-page-ui',
                onlyDependOnLibsWithTags: [
                  'scope:search-page-data-access',
                  'scope:shared-ui',
                  'scope:shared-data-access',
                ],
              },
              {
                sourceTag: 'scope:shell-ui',
                onlyDependOnLibsWithTags: [
                  'scope:shell-data-access',
                  'scope:shared-ui',
                  'scope:shared-data-access',
                ],
              },
              {
                sourceTag: 'scope:sidebar-ui',
                onlyDependOnLibsWithTags: [
                  'scope:shared-ui',
                  'scope:shared-data-access',
                ],
              },
              {
                sourceTag: 'scope:shared-ui',
                onlyDependOnLibsWithTags: ['scope:shared-data-access'],
              },
              {
                sourceTag: 'scope:details-page-data-access',
                onlyDependOnLibsWithTags: ['scope:shared-data-access'],
              },
              {
                sourceTag: 'scope:header-data-access',
                onlyDependOnLibsWithTags: ['scope:shared-data-access'],
              },
              {
                sourceTag: 'scope:home-page-data-access',
                onlyDependOnLibsWithTags: ['scope:shared-data-access'],
              },
              {
                sourceTag: 'scope:search-page-data-access',
                onlyDependOnLibsWithTags: ['scope:shared-data-access'],
              },
              {
                sourceTag: 'scope:shell-data-access',
                onlyDependOnLibsWithTags: ['scope:shared-data-access'],
              },
              {
                sourceTag: 'scope:shared-data-access',
                onlyDependOnLibsWithTags: [],
              },
              {
                sourceTag: 'scope:master',
                onlyDependOnLibsWithTags: ['*'],
              },
            ],
          },
        ],
      },
    })),
  ...compat
    .config({
      extends: ['plugin:@nx/typescript'],
    })
    .map((config) => ({
      ...config,
      files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts'],
      rules: {
        ...config.rules,
      },
    })),
  ...compat
    .config({
      extends: ['plugin:@nx/javascript'],
    })
    .map((config) => ({
      ...config,
      files: ['**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
      rules: {
        ...config.rules,
      },
    })),
  ...compat
    .config({
      env: {
        jest: true,
      },
    })
    .map((config) => ({
      ...config,
      files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.spec.js', '**/*.spec.jsx'],
      rules: {
        ...config.rules,
      },
    })),
  cypressPlugin.configs.recommended,
  prettierConfig,
];
