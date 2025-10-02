import type { Tree } from '@nx/devkit';

import { updateArrayProperty } from './updateArrayProperty';
import { updateTsConfigLibJson } from './updateTsConfigLibJson';
import { updateTsConfigSpecJson } from './updateTsConfigSpecJson';

export function setJsTsOptions(tree: Tree, path: string, buildable: boolean) {
  updateTsConfigSpecJson(tree, path, json => {
    json.compilerOptions.module = 'esnext';
    json.compilerOptions.moduleResolution = 'bundler';
    return json;
  });

  updateTsConfigLibJson(tree, path, json => {
    json.compilerOptions.module = 'esnext';
    json.compilerOptions.moduleResolution = 'bundler';
    updateArrayProperty(json.compilerOptions, 'types', [
      'node',
      ...(buildable ? ['vite/client'] : []),
    ]);
    return json;
  });
}
