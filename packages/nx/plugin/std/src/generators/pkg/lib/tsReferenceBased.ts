import { type Tree, joinPathFragments, updateJson } from '@nx/devkit';
import type { LinterType } from '@nx/eslint';
import { libraryGenerator } from '@nx/js';
import type { LibraryGeneratorSchema } from '@nx/js/src/generators/library/schema';

import type { PkgGeneratorSchema } from '../schema';

import { addEnvTypesToTsconfig } from './util/addEnvTypesToTsconfig';
import { addScopedLocalPackage } from './util/addLocalPackage';
import { updateViteBuildFormats } from './util/updateViteBuildFormats';
import { updateVitestConfig } from './util/updateVitestConfig';

export async function tsReferenceBased(
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

  await libraryGenerator(tree, schema);

  updateVitestConfig(tree, path, env);
  addEnvTypesToTsconfig(tree, path, env);

  if (publishable) {
    // Update vite.config.ts to include both ES and CJS formats
    updateViteBuildFormats(tree, path);

    // Update package.json exports to include require field for cjs
    const packageJsonPath = joinPathFragments(path, 'package.json');

    if (tree.exists(packageJsonPath)) {
      updateJson(tree, packageJsonPath, json => {
        if (json.exports && json.exports['.']) {
          json.exports['.'] = {
            require: './dist/index.cjs',
            ...json.exports['.'],
          };
        }
        return json;
      });
    }
  }

  // do that in both cases
  addScopedLocalPackage(tree, name);
}
