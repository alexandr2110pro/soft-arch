import {
  OverwriteStrategy,
  type Tree,
  generateFiles,
  joinPathFragments,
} from '@nx/devkit';

export function initCursorRules(tree: Tree, namespace: string) {
  generateFiles(
    tree,
    joinPathFragments(__dirname, '../files/cursor-rules'),
    '.cursor/rules',
    { namespace },
    { overwriteStrategy: OverwriteStrategy.Overwrite },
  );
}
