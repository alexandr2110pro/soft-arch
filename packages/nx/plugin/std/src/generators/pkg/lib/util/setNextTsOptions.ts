import type { Tree } from '@nx/devkit';

import { setReactTsOptions } from './setReactTsOptions.ts';
import { updateArrayProperty } from './updateArrayProperty.ts';
import { updateTsConfigLibJson } from './updateTsConfigLibJson.ts';

export function setNextTsOptions(tree: Tree, path: string) {
  setReactTsOptions(tree, path);
  updateTsConfigLibJson(tree, path, json => {
    updateArrayProperty(json.compilerOptions, 'types', [
      'next',
      '@nx/next/typings/image.d.ts',
    ]);
    return json;
  });
}
