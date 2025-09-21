import { Tree } from '@nx/devkit';

import { updateTsConfigLibJson } from './updateTsConfigLibJson';

export function addTsConfigTypes(tree: Tree, path: string, types: string[]) {
  updateTsConfigLibJson(tree, path, json => {
    json.compilerOptions.types = Array.from(
      new Set([...(json.compilerOptions.types || []), ...types]),
    );
    return json;
  });
}
