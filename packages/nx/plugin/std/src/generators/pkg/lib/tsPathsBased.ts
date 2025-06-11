import { Tree, joinPathFragments, readJson } from '@nx/devkit';
import type { LinterType } from '@nx/eslint';
import { libraryGenerator } from '@nx/js';
import type { LibraryGeneratorSchema } from '@nx/js/src/generators/library/schema';
import type { PackageJson } from 'nx/src/utils/package-json';

import type { PkgGeneratorSchema } from '../schema';

import { addEnvTypesToTsconfig } from './util/addEnvTypesToTsconfig.js';
import { updateViteBuildFormats } from './util/updateViteBuildFormats.js';
import { updateVitestConfig } from './util/updateVitestConfig.js';

export async function tsPathsbased(
  tree: Tree,
  name: string,
  path: string,
  publishable: boolean,
  env: PkgGeneratorSchema['env'],
) {
  const schema: LibraryGeneratorSchema = {
    name,
    directory: path,
    linter: 'eslint' satisfies LinterType,
    unitTestRunner: 'vitest',
    strict: true,
    bundler: publishable ? 'vite' : 'tsc',
    minimal: !publishable,
    publishable,
    skipPackageJson: true,
  };

  if (publishable) {
    const namespace = readJson<PackageJson>(tree, 'package.json').name.split(
      '/',
    )[0];

    if (!namespace) {
      throw new Error('Namespace is not defined');
    }
    if (!namespace.startsWith('@')) {
      throw new Error('Namespace must start with @');
    }
    schema.importPath = `${namespace}/${name}`;
  }

  await libraryGenerator(tree, schema);

  addEnvTypesToTsconfig(tree, path, env);

  if (publishable) {
    updateViteBuildFormats(tree, path);
    updateVitestConfig(tree, path, env);
  } else {
    tree.delete(joinPathFragments(path, 'package.json'));
  }
}
