import { type Tree, readProjectConfiguration, updateJson } from '@nx/devkit';
import { readPackageJson, removeGenerator } from '@nx/workspace';

import { RmGeneratorSchema } from './schema';

export async function rmGenerator(tree: Tree, options: RmGeneratorSchema) {
  const project = readProjectConfiguration(tree, options.packageName);
  const importPath = readPackageJson(project.root).name;

  await removeGenerator(tree, {
    projectName: options.packageName,
    skipFormat: true,
    forceRemove: false,
  });

  updateJson(tree, 'package.json', json => {
    delete json.dependencies[importPath];
    delete json.devDependencies[importPath];
    return json;
  });
}

export default rmGenerator;
