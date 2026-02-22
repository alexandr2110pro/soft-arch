import { Tree, joinPathFragments } from '@nx/devkit';

/**
 * Resolves the vite config file path, checking for `.mts` first then `.ts`.
 * @returns The resolved path, or `null` if no vite config exists.
 */
export function resolveViteConfigPath(
  tree: Tree,
  projectRoot: string,
): string | null {
  for (const ext of ['mts', 'ts']) {
    const p = joinPathFragments(projectRoot, `vite.config.${ext}`);
    if (tree.exists(p)) return p;
  }
  return null;
}
