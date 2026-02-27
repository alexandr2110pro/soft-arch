import { type Tree, joinPathFragments, readJson } from '@nx/devkit';
import type { LinterType } from '@nx/eslint';
import { libraryGenerator } from '@nx/js';
import type { LibraryGeneratorSchema } from '@nx/js/src/generators/library/schema.js';
import type { PackageJson } from 'nx/src/utils/package-json.js';

import type { PkgGeneratorSchema } from '../schema.d.ts';

import { addPublishInfoToPackageJson } from './util/addPublishInfoToPackageJson.ts';
import { setJsTsOptions } from './util/setJsTsOptions.ts';
import { setNextTsOptions } from './util/setNextTsOptions.ts';
import { setReactTsOptions } from './util/setReactTsOptions.ts';
import { updateViteBuildFormats } from './util/updateViteBuildFormats.ts';
import { updateVitestConfig } from './util/updateVitestConfig.ts';

export async function tsPathsbased(
  tree: Tree,
  name: string,
  { path, publishable, buildable, env, preset }: PkgGeneratorSchema,
) {
  if (publishable && !buildable) {
    throw new Error('Publishable packages must be buildable');
  }

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
    buildable,
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

  if (preset === 'js') {
    setJsTsOptions(tree, path);
  }

  if (preset === 'react') {
    setReactTsOptions(tree, path);
  }

  if (preset === 'nextjs') {
    setNextTsOptions(tree, path);
  }

  if (publishable) {
    updateViteBuildFormats(tree, path);
    addPublishInfoToPackageJson(tree, path);
  } else {
    tree.delete(joinPathFragments(path, 'package.json'));
  }
}
