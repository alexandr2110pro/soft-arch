import { Tree } from '@nx/devkit';
import { moveGenerator } from '@nx/workspace';

import { MvGeneratorSchema } from './schema';

export async function mvGenerator(tree: Tree, options: MvGeneratorSchema) {
  const { packageName, newPath } = options;

  await moveGenerator(tree, {
    projectName: packageName,
    destination: newPath,
    updateImportPath: true,
    newProjectName: newPath.split('/').slice(1).join('-'),
  });
}

export default mvGenerator;
