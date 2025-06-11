import {
  Tree,
  readJson,
  readProjectConfiguration,
  updateJson,
  writeJson,
} from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { pkgGenerator } from './pkg-generator.js';
import type { PkgGeneratorSchema } from './schema.js';

describe('ts-reference-based package generator', () => {
  let tree: Tree;

  const options: PkgGeneratorSchema = {
    path: 'packages/foo/bar-baz',
    kind: 'ts-reference-based',
    publishable: true,
    env: 'node',
  };

  beforeEach(() => {
    tree = createEmptyReferenceBasedWorkspace();
  });

  it('should run successfully', async () => {
    await pkgGenerator(tree, options);
    expect(readProjectConfiguration(tree, 'foo-bar-baz')).toBeDefined();
  });

  it('should create references to the package in the tsconfig.json', async () => {
    await pkgGenerator(tree, options);

    expect(readJson(tree, 'tsconfig.json').references).toEqual([
      { path: './packages/foo/bar-baz' },
    ]);
  });

  it('should not create paths reference in the tsconfig.base.json', async () => {
    await pkgGenerator(tree, options);
    expect(
      readJson(tree, 'tsconfig.base.json').compilerOptions.paths,
    ).toBeUndefined();
  });

  it('should add the new package to dependencies in the package.json', async () => {
    await pkgGenerator(tree, options);
    expect(readJson(tree, 'package.json').dependencies).toEqual({
      '@ns/foo-bar-baz': 'workspace:*',
    });
  });

  it('should create expected package.json', async () => {
    await pkgGenerator(tree, options);
    expect(readJson(tree, 'packages/foo/bar-baz/package.json')).toEqual({
      dependencies: {},
      exports: {
        '.': {
          default: './dist/index.js',
          import: './dist/index.js',
          require: './dist/index.cjs',
          types: './dist/index.d.ts',
        },
        './package.json': './package.json',
      },
      files: ['dist', '!**/*.tsbuildinfo'],
      main: './dist/index.js',
      module: './dist/index.js',
      name: '@ns/foo-bar-baz',
      type: 'module',
      types: './dist/index.d.ts',
      version: '0.0.1',
    });
  });

  it('should generate expected vite.config.ts', async () => {
    await pkgGenerator(tree, options);
    expect(
      tree.read('packages/foo/bar-baz/vite.config.ts')?.toString(),
    ).toMatchSnapshot();
  });

  it('should configure vite to build both esm and cjs, if publishable', async () => {
    await pkgGenerator(tree, options);
    expect(
      tree.read('packages/foo/bar-baz/vite.config.ts')?.toString(),
    ).toContain(`formats: ['es' as const, 'cjs' as const],`);
  });

  it('should configure vitest to pass with no tests', async () => {
    await pkgGenerator(tree, options);
    expect(
      tree.read('packages/foo/bar-baz/vite.config.ts')?.toString(),
    ).toContain(`passWithNoTests: true,`);
  });

  it('should configure configure jsdom environment, if env is jsdom', async () => {
    await pkgGenerator(tree, { ...options, env: 'jsdom' });
    expect(
      tree.read('packages/foo/bar-baz/vite.config.ts')?.toString(),
    ).toContain(`environment: 'jsdom',`);

    expect(
      readJson(tree, 'packages/foo/bar-baz/tsconfig.lib.json').compilerOptions
        .types,
    ).toEqual(['jsdom', 'vite/client']);
  });

  it('should configure configure edge environment, if env is edge', async () => {
    await pkgGenerator(tree, { ...options, env: 'edge' });
    expect(
      tree.read('packages/foo/bar-baz/vite.config.ts')?.toString(),
    ).toContain(`environment: 'edge-runtime',`);

    expect(
      readJson(tree, 'packages/foo/bar-baz/tsconfig.lib.json').compilerOptions
        .types,
    ).toEqual(['@edge-runtime/types', 'vite/client']);
  });
});

describe('ts-path-based publishable package', () => {
  let tree: Tree;

  const options: PkgGeneratorSchema = {
    path: 'packages/foo/bar-baz',
    kind: 'ts-paths-based',
    publishable: true,
    env: 'node',
  };

  beforeEach(() => {
    tree = createEmptyPathBasedWorkspace();
  });

  it('should run successfully', async () => {
    await pkgGenerator(tree, options);
    expect(readProjectConfiguration(tree, 'foo-bar-baz')).toBeDefined();
    expect(tree.exists('tsconfig.base.json')).toBe(true);
  });

  it('should update paths in tsconfig.base.json', async () => {
    await pkgGenerator(tree, options);
    expect(readJson(tree, 'tsconfig.base.json').compilerOptions.paths).toEqual({
      '@ns/foo-bar-baz': ['packages/foo/bar-baz/src/index.ts'],
    });
  });

  it('should create expected package.json', async () => {
    await pkgGenerator(tree, options);
    expect(readJson(tree, 'packages/foo/bar-baz/package.json')).toEqual({
      dependencies: {},
      main: './index.js',
      name: '@ns/foo-bar-baz',
      type: 'module',
      types: './index.d.ts',
      version: '0.0.1',
    });
  });

  it('should generate expected vite.config.ts', async () => {
    await pkgGenerator(tree, options);
    expect(
      tree.read('packages/foo/bar-baz/vite.config.ts')?.toString(),
    ).toMatchSnapshot();
  });

  it('should configure vite to build both esm and cjs, if publishable', async () => {
    await pkgGenerator(tree, options);
    expect(
      tree.read('packages/foo/bar-baz/vite.config.ts')?.toString(),
    ).toContain(`formats: ['es' as const, 'cjs' as const],`);
  });

  it('should configure vitest to pass with no tests', async () => {
    await pkgGenerator(tree, options);
    expect(
      tree.read('packages/foo/bar-baz/vite.config.ts')?.toString(),
    ).toContain(`passWithNoTests: true,`);
  });

  it('should not add the package to the root package.json', async () => {
    await pkgGenerator(tree, options);
    expect(readJson(tree, 'package.json').dependencies).toEqual({});
  });

  it('should configure configure jsdom environment if env is jsdom', async () => {
    await pkgGenerator(tree, { ...options, env: 'jsdom' });
    expect(
      tree.read('packages/foo/bar-baz/vite.config.ts')?.toString(),
    ).toContain(`environment: 'jsdom',`);

    expect(
      readJson(tree, 'packages/foo/bar-baz/tsconfig.lib.json').compilerOptions
        .types,
    ).toEqual(['jsdom', 'vite/client']);
  });

  it('should configure configure edge environment if env is edge', async () => {
    await pkgGenerator(tree, { ...options, env: 'edge' });
    expect(
      tree.read('packages/foo/bar-baz/vite.config.ts')?.toString(),
    ).toContain(`environment: 'edge-runtime',`);

    expect(
      readJson(tree, 'packages/foo/bar-baz/tsconfig.lib.json').compilerOptions
        .types,
    ).toEqual(['@edge-runtime/types', 'vite/client']);
  });
});

//---------------------------------------

function createEmptyPathBasedWorkspace() {
  const tree = createTreeWithEmptyWorkspace();

  updateJson(tree, 'package.json', json => {
    json.name = '@ns/source';
    return json;
  });

  writeJson(tree, 'tsconfig.base.json', {
    compilerOptions: {
      rootDir: '.',
      baseUrl: '.',
      target: 'ESNext',
      module: 'esnext',
      lib: ['ESNext', 'dom'],
      paths: {},
    },
  });

  return tree;
}

function createEmptyReferenceBasedWorkspace() {
  const tree = createTreeWithEmptyWorkspace();

  updateJson(tree, 'package.json', json => {
    json.workspaces = ['packages/*'];
    json.name = '@ns/source';
    return json;
  });

  writeJson(tree, 'tsconfig.base.json', {
    compilerOptions: {
      composite: true,
      declaration: true,
    },
  });

  writeJson(tree, 'tsconfig.json', {
    extends: './tsconfig.base.json',
    files: [],
    references: [],
  });

  // TODO: support other package managers
  tree.write('pnpm-workspace.yaml', '');

  return tree;
}
