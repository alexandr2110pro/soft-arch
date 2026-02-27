import { type Tree } from '@nx/devkit';

import { tsPathsbased } from './lib/tsPathsBased.ts';
import { tsReferenceBased } from './lib/tsReferenceBased.ts';
import type { PkgGeneratorSchema } from './schema.d.ts';

export async function pkgGenerator(tree: Tree, options: PkgGeneratorSchema) {
  const { path, kind } = options;

  // remove the first segment, as conventionally it is some kind of
  // "root" dir - "com", "org", "packages", etc.
  // Then join the segments with hyphens.
  const name = path.split('/').slice(1).join('-');

  switch (kind) {
    case 'ts-reference-based':
      return tsReferenceBased(tree, name, options);
    case 'ts-paths-based':
      return tsPathsbased(tree, name, options);
    default:
      throw new Error(`Unknown kind: ${kind}`);
  }
}

export default pkgGenerator;
