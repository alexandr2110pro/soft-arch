import { Tree, readJson, updateJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { vi } from 'vitest';

import cfgGenerator from './cfg-generator';
import type { CfgGeneratorSchema } from './schema';

describe('cfg generator', () => {
  let tree: Tree;
  const options: CfgGeneratorSchema = {
    options: ['lint', 'cursor-rules'],
  };

  beforeEach(() => {
    tree = createWorkspace();

    // Mock fetch for npm registry calls
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        'dist-tags': {
          latest: '1.1.0',
          canary: '1.1.0-canary.1',
        },
        versions: {
          '1.0.0': {},
          '0.9.0': {},
          '1.1.0-canary.1': {},
        },
      }),
    } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should write standard eslint config', async () => {
    await cfgGenerator(tree, options);
    expect(tree.read('eslint.config.mjs', 'utf-8')?.toString()).toContain(
      'prettierRecommended',
    );
  });

  it('should write standard prettier config', async () => {
    await cfgGenerator(tree, options);
    expect(tree.read('.prettierrc', 'utf-8')?.toString()).toContain(
      '@trivago/prettier-plugin-sort-imports',
    );
  });
  it('should add expected dev dependencies', async () => {
    await cfgGenerator(tree, options);
    const devDependencies = readJson(tree, 'package.json').devDependencies;
    // note, we mock npm response for versions. Therefore all versions are 1.1.0
    expect(devDependencies).toEqual({
      '@eslint/js': '1.1.0',
      '@trivago/prettier-plugin-sort-imports': '1.1.0',
      '@types/node': '1.1.0',
      eslint: '1.1.0',
      'eslint-config-prettier': '1.1.0',
      'eslint-plugin-prettier': '1.1.0',
      'jsonc-eslint-parser': '1.1.0',
      prettier: '1.1.0',
      'prettier-plugin-classnames': '1.1.0',
      'prettier-plugin-merge': '1.1.0',
      'prettier-plugin-tailwindcss': '1.1.0',
      typescript: '1.1.0',
      'typescript-eslint': '1.1.0',
    });
  });

  it('should write standard cursor rules', async () => {
    await cfgGenerator(tree, options);
    expect(tree.exists('.cursor/rules/core-rules.mdc')).toBe(true);
    expect(tree.exists('.cursor/rules/commit-rules.mdc')).toBe(true);
    expect(tree.exists('.cursor/rules/rust-rules.mdc')).toBe(true);
    expect(tree.exists('.cursor/rules/typescript-rules.mdc')).toBe(true);
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
