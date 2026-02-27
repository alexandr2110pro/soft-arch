import { type Tree, logger, readJson } from '@nx/devkit';
import type { PackageJson } from 'nx/src/utils/package-json.js';

import { initCursorRules } from './lib/initCursorRules.ts';
import { initEslintAndPrettierConfigs } from './lib/initEslintAndPrettierConfigs.ts';
import type { CfgGeneratorSchema } from './schema.d.ts';

export async function cfgGenerator(tree: Tree, options: CfgGeneratorSchema) {
  const { options: selectedOptions } = options;

  const namespace = readJson<PackageJson>(tree, 'package.json').name.split(
    '/',
  )[0];

  if (!namespace) {
    throw new Error('Namespace is not defined');
  }

  if (!namespace.startsWith('@')) {
    throw new Error('Namespace must start with @');
  }

  if (selectedOptions.includes('cursor-rules')) {
    initCursorRules(tree, namespace);
  }

  if (selectedOptions.includes('lint')) {
    await initEslintAndPrettierConfigs(tree, namespace);
  }

  logger.info(
    'Standard configuration has been applied. Run install with your package manager',
  );
}

export default cfgGenerator;
