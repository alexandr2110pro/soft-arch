import {
  OverwriteStrategy,
  Tree,
  addDependenciesToPackageJson,
  generateFiles,
  logger,
  readJson,
} from '@nx/devkit';
import path from 'node:path';
import type { PackageJson } from 'nx/src/utils/package-json';

import { InitGeneratorSchema } from './schema';

export async function initGenerator(tree: Tree, _options: InitGeneratorSchema) {
  if (!tree.exists('eslint.config.mjs')) {
    throw new Error('ESLint is not initialized or not using mjs format');
  }

  if (!tree.exists('.prettierrc')) {
    throw new Error('Prettier is not initialized');
  }

  const namespace = readJson<PackageJson>(tree, 'package.json').name.split(
    '/',
  )[0];

  if (!namespace) {
    throw new Error('Namespace is not defined');
  }

  if (!namespace.startsWith('@')) {
    throw new Error('Namespace must start with @');
  }

  addDependenciesToPackageJson(
    tree,
    {},
    {
      '@trivago/prettier-plugin-sort-imports': 'latest',
      'prettier-plugin-tailwindcss': 'latest',
      'prettier-plugin-classnames': 'latest',
      'prettier-plugin-merge': 'latest',
      'eslint-plugin-prettier': 'latest',
      prettier: 'latest',
      eslint: 'latest',
    },
  );

  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    '.',
    { namespace },
    { overwriteStrategy: OverwriteStrategy.Overwrite },
  );

  logger.info(
    'Standard configuration has been applied. Run install with your package manager',
  );
}

export default initGenerator;
