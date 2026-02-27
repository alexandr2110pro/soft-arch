import type { Tree } from '@nx/devkit';
import { moveGenerator } from '@nx/workspace';

import type { MvGeneratorSchema } from './schema.d.ts';

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
