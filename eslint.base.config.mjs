import nxEslintPlugin from '@nx/eslint-plugin';
import ngrxEslintPlugin from '@ngrx/eslint-plugin/v9';
import tsEslintPlugin from '@typescript-eslint/eslint-plugin';
import prettierConfig from 'eslint-config-prettier';
import tsEslint from 'typescript-eslint';
import nx from '@nx/eslint-plugin';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  ...nxEslintPlugin.configs['flat/base'],
  ...nxEslintPlugin.configs['flat/typescript'],
  ...nxEslintPlugin.configs['flat/javascript'],
  {
    ignores: ['**/dist'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
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
  },
  {
    files: ['**/*.ts'],
    extends: [...ngrxEslintPlugin.configs.signals],
    rules: {},
  },
  ...tsEslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: ['**/*.ts'], // We use TS config only for TS files
  })),
  {
    files: ['**/*.ts'],
    // This is required, see the docs
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      ...tsEslintPlugin.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },
  {
    files: ['**/*.js'],
    extends: [tsEslint.configs.disableTypeChecked],
  },
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  {
    files: ['**/*.html'],
    // Override or add rules here
    rules: {
      '@angular-eslint/template/mouse-events-have-key-events': 'off',
      '@angular-eslint/template/click-events-have-key-events': 'off',
      '@angular-eslint/template/interactive-supports-focus': 'off',
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'ay',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'ay',
          style: 'kebab-case',
        },
      ],
    },
  },
  prettierConfig,
]);
