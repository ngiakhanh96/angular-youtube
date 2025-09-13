import nx from '@nx/eslint-plugin';
import ngrxEslintPlugin from '@ngrx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
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
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
];
