import { Tree, joinPathFragments, readJson } from '@nx/devkit';
import type { LinterType } from '@nx/eslint';
import { libraryGenerator } from '@nx/js';
import type { LibraryGeneratorSchema } from '@nx/js/src/generators/library/schema';
import type { PackageJson } from 'nx/src/utils/package-json';

import type { PkgGeneratorSchema } from '../schema';

import { addPublishInfoToPackageJson } from './util/addPublishInfoToPackageJson';
import { updateViteBuildFormats } from './util/updateViteBuildFormats';
import { updateVitestConfig } from './util/updateVitestConfig';

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
    useProjectJson: !publishable,
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
  await updateVitestConfig(tree, path, env);

  if (publishable) {
    updateViteBuildFormats(tree, path);
    addPublishInfoToPackageJson(tree, path);
  } else {
    tree.delete(joinPathFragments(path, 'package.json'));
  }
}
