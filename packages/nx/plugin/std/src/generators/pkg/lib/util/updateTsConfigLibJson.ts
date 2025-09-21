import { type Tree, joinPathFragments, updateJson } from '@nx/devkit';

export function updateTsConfigLibJson(
  tree: Tree,
  projectPath: string,
  updater: (json: any) => any,
) {
  updateJson(
    tree,
    joinPathFragments(projectPath, 'tsconfig.lib.json'),
    updater,
  );
}
