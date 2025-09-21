import { Tree } from '@nx/devkit';

import { tsPathsbased } from './lib/tsPathsBased';
import { tsReferenceBased } from './lib/tsReferenceBased';
import type { PkgGeneratorSchema } from './schema';

export async function pkgGenerator(tree: Tree, options: PkgGeneratorSchema) {
  const { path, kind, publishable, env, buildable, preset } = options;

  const name = path.split('/').slice(1).join('-');
  switch (kind) {
    case 'ts-reference-based':
      return tsReferenceBased(
        tree,
        name,
        path,
        publishable,
        buildable,
        env,
        preset,
      );
    case 'ts-paths-based':
      return tsPathsbased(tree, name, path, publishable, env);
    default:
      throw new Error(`Unknown kind: ${kind}`);
  }
}

export default pkgGenerator;
