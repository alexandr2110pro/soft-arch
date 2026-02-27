import { type Tree, joinPathFragments, updateJson } from '@nx/devkit';
import type { LinterType } from '@nx/eslint';
import { libraryGenerator } from '@nx/js';
import type { LibraryGeneratorSchema } from '@nx/js/src/generators/library/schema.js';
import type { PackageJson } from 'nx/src/utils/package-json.js';

import type { PkgGeneratorSchema } from '../schema.d.ts';

import { addScopedLocalPackage } from './util/addLocalPackage.ts';
import { addPublishInfoToPackageJson } from './util/addPublishInfoToPackageJson.ts';
import { setJsTsOptions } from './util/setJsTsOptions.ts';
import { setNextTsOptions } from './util/setNextTsOptions.ts';
import { setReactTsOptions } from './util/setReactTsOptions.ts';
import { updateViteBuildFormats } from './util/updateViteBuildFormats.ts';
import { updateVitestConfig } from './util/updateVitestConfig.ts';

export async function tsReferenceBased(
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
    bundler: buildable ? 'vite' : 'none',
    minimal: !publishable,
    publishable,
    skipPackageJson: false,
    useProjectJson: false,
  };

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
    // Update vite.config.ts to include both ES and CJS formats
    updateViteBuildFormats(tree, path);

    // Update package.json exports to include require field for cjs
    updateJson<PackageJson>(
      tree,
      joinPathFragments(path, 'package.json'),
      json => {
        const dotExport = (
          json.exports as Record<string, Record<string, string>>
        )?.['.'];
        if (typeof dotExport !== 'object' || dotExport === null) {
          throw new Error(
            '"." export is not an object in generated package.json',
          );
        }

        if (!dotExport['types'] || !dotExport['import']) {
          throw new Error(
            '"exports" is missing required "types" or "import" fields',
          );
        }

        // Remove `default` (if present) and add `require` for CJS.
        // Keep the custom condition (e.g. @space-arch/source) first for correct resolution order.
        const { default: _default, ...kept } = dotExport;

        (json.exports as Record<string, unknown>)['.'] = {
          ...kept,
          require: './dist/index.cjs',
        };

        return json;
      },
    );

    addPublishInfoToPackageJson(tree, path);
  }

  // do that in both cases
  addScopedLocalPackage(tree, name);
}
