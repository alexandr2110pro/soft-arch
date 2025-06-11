import { Tree, updateJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import initGenerator from './init-generator';
import { InitGeneratorSchema } from './schema';

describe('init generator', () => {
  let tree: Tree;
  const options: InitGeneratorSchema = {};

  beforeEach(() => {
    tree = createWorkspace();
  });

  it('should write standard eslint config', async () => {
    await initGenerator(tree, options);
    expect(tree.read('eslint.config.mjs', 'utf-8')?.toString()).toContain(
      'prettierRecommended',
    );
  });

  it('should write standard prettier config', async () => {
    await initGenerator(tree, options);
    expect(tree.read('.prettierrc', 'utf-8')?.toString()).toContain(
      '@trivago/prettier-plugin-sort-imports',
    );
  });
});

// ------------------------------------------------------------

function createWorkspace() {
  const tree = createTreeWithEmptyWorkspace();

  updateJson(tree, 'package.json', json => {
    json.name = '@ns/source';
    return json;
  });

  tree.write('eslint.config.mjs', '');
  tree.write('.prettierrc', '{}');

  return tree;
}
