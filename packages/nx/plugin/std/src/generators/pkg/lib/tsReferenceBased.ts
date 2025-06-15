import { type Tree, joinPathFragments, updateJson } from '@nx/devkit';
import type { LinterType } from '@nx/eslint';
import { libraryGenerator } from '@nx/js';
import type { LibraryGeneratorSchema } from '@nx/js/src/generators/library/schema';
import type { PackageJson } from 'nx/src/utils/package-json';
import { z } from 'zod/v4-mini';

import type { PkgGeneratorSchema } from '../schema';

import { addScopedLocalPackage } from './util/addLocalPackage';
import { addPublishInfoToPackageJson } from './util/addPublishInfoToPackageJson';
import { updateViteBuildFormats } from './util/updateViteBuildFormats';
import { updateVitestConfig } from './util/updateVitestConfig';

const generatedExportsSchema = z.object({
  '.': z.object({
    types: z.string(),
    import: z.string(),
    development: z.string(),
    default: z.string(),
  }),
});

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
    skipPackageJson: false,
    useProjectJson: false,
  };

  await libraryGenerator(tree, schema);

  await updateVitestConfig(tree, path, env);

  if (publishable) {
    // Update vite.config.ts to include both ES and CJS formats
    updateViteBuildFormats(tree, path);

    // Update package.json exports to include require field for cjs
    updateJson<PackageJson>(
      tree,
      joinPathFragments(path, 'package.json'),
      json => {
        if (typeof json.exports !== 'object' || json.exports === null) {
          throw new Error('exports is not an object in package.json');
        }

        const exportsParse = z.safeParse(generatedExportsSchema, json.exports);
        if (!exportsParse.success) {
          throw new Error('"exports" is invalid in generated package.json', {
            cause: exportsParse.error,
          });
        }

        const { development, ...rest } = exportsParse.data['.'];

        json.exports['.'] = {
          require: './dist/index.cjs',
          ...rest,
          development,
        };

        return json;
      },
    );

    addPublishInfoToPackageJson(tree, path);
  }

  // do that in both cases
  addScopedLocalPackage(tree, name);
}
