import {
  OverwriteStrategy,
  type Tree,
  addDependenciesToPackageJson,
  generateFiles,
  joinPathFragments,
} from '@nx/devkit';

import { versionResolve } from './versionResolve';

export async function initEslintAndPrettierConfigs(
  tree: Tree,
  namespace: string,
) {
  const devDependencies = await versionResolve({
    prettier: 'latest',
    '@trivago/prettier-plugin-sort-imports': 'latest',
    'prettier-plugin-tailwindcss': 'latest',
    'prettier-plugin-classnames': 'latest',
    'prettier-plugin-merge': 'latest',
    eslint: 'latest',
    'eslint-config-prettier': 'latest',
    'eslint-plugin-prettier': 'latest',
    '@eslint/js': 'latest',
    'jsonc-eslint-parser': 'latest',
    typescript: 'latest',
    'typescript-eslint': 'latest',
    '@types/node': 'latest',
  });

  addDependenciesToPackageJson(tree, {}, devDependencies);

  generateFiles(
    tree,
    joinPathFragments(__dirname, '../files/lint'),
    '.',
    { namespace },
    { overwriteStrategy: OverwriteStrategy.Overwrite },
  );
}
