import { Tree } from '@nx/devkit';

import { resolveViteConfigPath } from './resolveViteConfigPath.js';

/**
 * Updates the vite config file to include both ES and CJS formats
 * @param tree - The NX Tree instance
 * @param path - The path to the project directory
 */
export function updateViteBuildFormats(tree: Tree, path: string): void {
  const viteConfigPath = resolveViteConfigPath(tree, path);

  if (viteConfigPath) {
    const viteConfig = tree.read(viteConfigPath, 'utf-8');

    if (viteConfig) {
      const updatedConfig = viteConfig.replace(
        /formats:\s*\[[^\]]*\]/,
        `formats: ['es' as const, 'cjs' as const]`,
      );
      tree.write(viteConfigPath, updatedConfig);
    }
  }
}
