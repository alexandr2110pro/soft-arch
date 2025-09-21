import type { Tree } from '@nx/devkit';

import { setReactTsOptions } from './setRactTsOptions';
import { updateArrayProperty } from './updateArrayProperty';
import { updateTsConfigLibJson } from './updateTsConfigLibJson';

export function setNextTsOptions(tree: Tree, path: string, buildable: boolean) {
  setReactTsOptions(tree, path, buildable);
  updateTsConfigLibJson(tree, path, json => {
    updateArrayProperty(json.compilerOptions, 'types', [
      'next',
      '@nx/next/typings/image.d.ts',
    ]);
    return json;
  });
}
