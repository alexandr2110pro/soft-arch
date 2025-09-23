import { type Tree, joinPathFragments, updateJson } from '@nx/devkit';

export function updateTsConfigSpecJson(
  tree: Tree,
  projectPath: string,
  updater: (json: any) => any,
) {
  updateJson(
    tree,
    joinPathFragments(projectPath, 'tsconfig.spec.json'),
    updater,
  );
}
