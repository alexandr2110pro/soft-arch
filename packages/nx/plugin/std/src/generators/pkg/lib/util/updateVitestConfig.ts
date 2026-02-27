import { type Tree } from '@nx/devkit';
import type { ViteUserConfig } from 'vitest/config';

import type { PkgGeneratorSchema } from '../../schema.d.ts';

import { resolveViteConfigPath } from './resolveViteConfigPath.ts';

export async function updateVitestConfig(
  tree: Tree,
  projectRoot: string,
  env: PkgGeneratorSchema['env'],
) {
  const viteConfigPath = resolveViteConfigPath(tree, projectRoot);

  if (!viteConfigPath) return;

  let viteConfigContent = tree.read(viteConfigPath, 'utf-8');
  if (!viteConfigContent) return;

  // Check if the file already has passWithNoTests configured
  if (!viteConfigContent.includes('passWithNoTests:')) {
    viteConfigContent = viteConfigContent.replace(
      /(\s+test:\s*\{)(\s*)/,
      '$1\n    passWithNoTests: true,$2',
    );
  }

  // Replace the environment value
  viteConfigContent = viteConfigContent.replace(
    /(\s+environment:\s*['"])([^'"]*)(['"])/,
    `$1${intoVitestEnv(env)}$3`,
  );

  tree.write(viteConfigPath, viteConfigContent);
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
