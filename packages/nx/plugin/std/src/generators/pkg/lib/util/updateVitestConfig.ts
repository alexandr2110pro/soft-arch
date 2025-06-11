import { Tree } from '@nx/devkit';
import * as path from 'path';
import type { ViteUserConfig } from 'vitest/config' with { 'resolution-mode': 'import' };

import type { PkgGeneratorSchema } from '../../schema';

export function updateVitestConfig(
  tree: Tree,
  projectRoot: string,
  env: PkgGeneratorSchema['env'],
) {
  const viteConfigPath = path.join(projectRoot, 'vite.config.ts');

  if (!tree.exists(viteConfigPath)) return;

  const viteConfigContent = tree.read(viteConfigPath, 'utf-8');
  if (!viteConfigContent) return;

  // Check if the file already has passWithNoTests configured
  if (viteConfigContent.includes('passWithNoTests:')) return;

  // Find the test configuration block and add passWithNoTests
  const updatedContent = viteConfigContent
    .replace(/(\s+test:\s*\{)(\s*)/, '$1\n    passWithNoTests: true,$2')
    .replace(
      /(\s+environment:\s*['"])([^'"]*)(['"])/,
      `$1${intoVitestEnv(env)}$3`,
    );

  tree.write(viteConfigPath, updatedContent);
}

function intoVitestEnv(
  env: PkgGeneratorSchema['env'],
): NonNullable<ViteUserConfig['test']>['environment'] {
  switch (env) {
    case 'node':
      return 'node';
    case 'jsdom':
      return 'jsdom';
    case 'edge':
      return 'edge-runtime';
    default:
      throw new Error(`Unknown environment: ${env}`);
  }
}
