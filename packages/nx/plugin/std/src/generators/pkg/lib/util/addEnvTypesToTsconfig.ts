import { Tree, joinPathFragments, updateJson } from '@nx/devkit';

import type { PkgGeneratorSchema } from '../../schema';

export async function addEnvTypesToTsconfig(
  tree: Tree,
  projectRoot: string,
  env: PkgGeneratorSchema['env'],
) {
  updateJson(
    tree,
    joinPathFragments(projectRoot, 'tsconfig.lib.json'),
    json => {
      const newTypes = [];

      switch (env) {
        case 'node':
          newTypes.push('node');
          break;
        case 'jsdom':
          newTypes.push('jsdom');
          break;
        case 'edge':
          newTypes.push('@edge-runtime/types');
          break;
      }

      if (json.compilerOptions.types.includes('vite/client')) {
        newTypes.push('vite/client');
      }

      json.compilerOptions.types = newTypes;

      return json;
    },
  );
}
