import { type Tree, readProjectConfiguration, updateJson } from '@nx/devkit';
import { readPackageJson, removeGenerator } from '@nx/workspace';

import type { RmGeneratorSchema } from './schema.d.ts';

export async function rmGenerator(tree: Tree, options: RmGeneratorSchema) {
  const project = readProjectConfiguration(tree, options.packageName);
  const importPath = readPackageJson(project.root).name;

  await removeGenerator(tree, {
    projectName: options.packageName,
    skipFormat: true,
    forceRemove: false,
  });

  updateJson(tree, 'package.json', json => {
    if (json.dependencies) delete json.dependencies[importPath];
    if (json.devDependencies) delete json.devDependencies[importPath];
    return json;
  });
}

export default rmGenerator;
