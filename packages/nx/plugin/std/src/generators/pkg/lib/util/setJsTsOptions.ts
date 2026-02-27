import type { Tree } from '@nx/devkit';

import { updateArrayProperty } from './updateArrayProperty.ts';
import { updateTsConfigLibJson } from './updateTsConfigLibJson.ts';
import { updateTsConfigSpecJson } from './updateTsConfigSpecJson.ts';

export function setJsTsOptions(tree: Tree, path: string) {
  updateTsConfigSpecJson(tree, path, json => {
    json.compilerOptions.module = 'nodenext';
    json.compilerOptions.moduleResolution = 'nodenext';
    return json;
  });

  updateTsConfigLibJson(tree, path, json => {
    json.compilerOptions.module = 'nodenext';
    json.compilerOptions.moduleResolution = 'nodenext';
    updateArrayProperty(json.compilerOptions, 'types', ['node', 'vite/client']);
    return json;
  });
}
