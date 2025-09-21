import { type Tree, updateJson } from '@nx/devkit';
import { removeGenerator } from '@nx/workspace';

import { RmGeneratorSchema } from './schema';

export async function rmGenerator(tree: Tree, options: RmGeneratorSchema) {
  await removeGenerator(tree, {
    projectName: options.packageName,
    skipFormat: true,
    forceRemove: false,
  });

  updateJson(tree, 'package.json', json => {
    delete json.dependencies[options.packageName];
    delete json.devDependencies[options.packageName];
    return json;
  });
}

export default rmGenerator;
