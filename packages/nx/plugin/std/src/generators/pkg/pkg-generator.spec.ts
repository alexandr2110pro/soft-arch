import {
  type Tree,
  readJson,
  readProjectConfiguration,
  updateJson,
  writeJson,
} from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing.js';
import { vi } from 'vitest';

import { resolveViteConfigPath } from './lib/util/resolveViteConfigPath.js';
import { pkgGenerator } from './pkg-generator.js';
import type { PkgGeneratorSchema } from './schema.d.ts';

describe('ts-reference-based publishable package', () => {
  let tree: Tree;

  const options: PkgGeneratorSchema = {
    path: 'packages/foo/bar-baz',
    kind: 'ts-reference-based',
    publishable: true,
    buildable: true,
    env: 'node',
  };

  beforeAll(async () => {
    // Mock fetch for npm registry calls
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
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
      } as any),
    );

    tree = createEmptyReferenceBasedWorkspace();
    await pkgGenerator(tree, options);
  });

  afterAll(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should run successfully', () => {
    expect(readProjectConfiguration(tree, 'foo-bar-baz')).toBeDefined();
  });

  it('should create references to the package in the tsconfig.json', () => {
    expect(readJson(tree, 'tsconfig.json').references).toEqual([
      { path: './packages/foo/bar-baz' },
    ]);
  });

  it('should not create paths reference in the tsconfig.base.json', () => {
    expect(
      readJson(tree, 'tsconfig.base.json').compilerOptions.paths,
    ).toBeUndefined();
  });

  it('should add the new package to dependencies in the package.json', () => {
    expect(readJson(tree, 'package.json').dependencies).toEqual({
      '@ns/foo-bar-baz': 'workspace:*',
    });
  });

  it('should generate expected package.json', () => {
    const packageJson = tree
      .read('packages/foo/bar-baz/package.json')
      ?.toString();
    expect(packageJson).toMatchSnapshot();
  });

  it('should not create project.json', () => {
    expect(tree.exists('packages/foo/bar-baz/project.json')).toBe(false);
  });

  it('should generate expected vite.config.ts', () => {
    expect(readViteConfig(tree, 'packages/foo/bar-baz')).toMatchSnapshot();
  });

  it('should configure vite to build both esm and cjs', () => {
    expect(readViteConfig(tree, 'packages/foo/bar-baz')).toContain(
      `formats: ['es' as const, 'cjs' as const],`,
    );
  });

  it('should configure vitest to pass with no tests', () => {
    expect(readViteConfig(tree, 'packages/foo/bar-baz')).toContain(
      `passWithNoTests: true,`,
    );
  });

  it('should configure configure jsdom environment, if env is jsdom', async () => {
    const jsdomTree = createEmptyReferenceBasedWorkspace();
    await pkgGenerator(jsdomTree, { ...options, env: 'jsdom' });
    expect(readViteConfig(jsdomTree, 'packages/foo/bar-baz')).toContain(
      `environment: 'jsdom',`,
    );
  });

  it('should configure configure edge environment, if env is edge', async () => {
    const edgeTree = createEmptyReferenceBasedWorkspace();
    await pkgGenerator(edgeTree, { ...options, env: 'edge' });
    expect(readViteConfig(edgeTree, 'packages/foo/bar-baz')).toContain(
      `environment: 'edge-runtime',`,
    );
  });
});

describe('ts-reference-based not publishable package', () => {
  let tree: Tree;

  const options: PkgGeneratorSchema = {
    path: 'packages/foo/bar-baz',
    kind: 'ts-reference-based',
    publishable: false,
    buildable: false,
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

  it('should create expected package.json without publish configuration', async () => {
    await pkgGenerator(tree, options);
    const packageJson = readJson(tree, 'packages/foo/bar-baz/package.json');
    expect(packageJson).toEqual({
      name: '@ns/foo-bar-baz',
      version: '0.0.1',
      private: true,
      type: 'module',
      main: './src/index.ts',
      types: './src/index.ts',
      exports: {
        './package.json': './package.json',
        '.': {
          types: './src/index.ts',
          import: './src/index.ts',
          default: './src/index.ts',
        },
      },
      dependencies: {},
      nx: expect.objectContaining({
        name: 'foo-bar-baz',
      }),
    });

    // Should not have publishable-specific fields
    expect(packageJson.publishConfig).toBeUndefined();
    expect(packageJson.files).toBeUndefined();
    // Should not have CJS exports (require field) since publishable is false
    expect(packageJson.exports['.'].require).toBeUndefined();
  });

  it('should generate expected package.json', async () => {
    await pkgGenerator(tree, options);
    const packageJson = tree
      .read('packages/foo/bar-baz/package.json')
      ?.toString();
    expect(packageJson).toMatchSnapshot();
  });

  it('should not create project.json', async () => {
    await pkgGenerator(tree, options);
    expect(tree.exists('packages/foo/bar-baz/project.json')).toBe(false);
  });

  it('should generate expected vite.config.ts', async () => {
    await pkgGenerator(tree, options);
    expect(readViteConfig(tree, 'packages/foo/bar-baz')).toMatchSnapshot();
  });

  it('should generate vite.config.ts with test configuration only', async () => {
    await pkgGenerator(tree, options);
    const viteConfig = tree
      .read('packages/foo/bar-baz/vite.config.ts')
      ?.toString();
    expect(viteConfig).toContain('passWithNoTests: true');
    expect(viteConfig).toContain("environment: 'node'");
    // Should not contain build configuration since it's not publishable
    expect(viteConfig).not.toContain('build:');
  });

  it('should configure vitest to pass with no tests', async () => {
    await pkgGenerator(tree, options);
    expect(readViteConfig(tree, 'packages/foo/bar-baz')).toContain(
      `passWithNoTests: true,`,
    );
  });

  it('should configure configure jsdom environment, if env is jsdom', async () => {
    await pkgGenerator(tree, { ...options, env: 'jsdom' });
    expect(readViteConfig(tree, 'packages/foo/bar-baz')).toContain(
      `environment: 'jsdom',`,
    );
  });

  it('should configure configure edge environment, if env is edge', async () => {
    await pkgGenerator(tree, { ...options, env: 'edge' });
    expect(readViteConfig(tree, 'packages/foo/bar-baz')).toContain(
      `environment: 'edge-runtime',`,
    );
  });

  it('should create project with minimal configuration', async () => {
    await pkgGenerator(tree, options);
    const projectConfig = readProjectConfiguration(tree, 'foo-bar-baz');

    // Should have basic targets for a non-publishable library
    expect(projectConfig.targets?.test).toBeDefined();
    expect(projectConfig.targets?.lint).toBeDefined();

    // Should not have build target since it's not publishable
    expect(projectConfig.targets?.build).toBeUndefined();

    // Test target should use vitest executor for running tests
    expect(projectConfig.targets?.test?.executor).toBe('@nx/vitest:test');
  });

  it('should not have publish-related npm scripts or configuration', async () => {
    await pkgGenerator(tree, options);
    const packageJson = readJson(tree, 'packages/foo/bar-baz/package.json');

    // Should not have build scripts for publishing
    expect(packageJson.scripts?.build).toBeUndefined();
    expect(packageJson.scripts?.prepublishOnly).toBeUndefined();

    // Should be marked as private
    expect(packageJson.private).toBe(true);

    // Should not have repository info from rootPackageJsonBase since it's not publishable
    expect(packageJson.repository).toBeUndefined();
    expect(packageJson.homepage).toBeUndefined();
    expect(packageJson.bugs).toBeUndefined();
    expect(packageJson.author).toBeUndefined();
    expect(packageJson.license).toBeUndefined();
  });
});

describe('ts-path-based publishable package', () => {
  let tree: Tree;

  const options: PkgGeneratorSchema = {
    path: 'packages/foo/bar-baz',
    kind: 'ts-paths-based',
    publishable: true,
    buildable: true,
    env: 'node',
  };

  beforeAll(async () => {
    // Mock fetch for npm registry calls
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
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
      } as any),
    );

    tree = createEmptyPathBasedWorkspace();
    await pkgGenerator(tree, options);
  });

  afterAll(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should run successfully', () => {
    expect(readProjectConfiguration(tree, 'foo-bar-baz')).toBeDefined();
    expect(tree.exists('tsconfig.base.json')).toBe(true);
  });

  it('should update paths in tsconfig.base.json', () => {
    expect(readJson(tree, 'tsconfig.base.json').compilerOptions.paths).toEqual({
      '@ns/foo-bar-baz': ['packages/foo/bar-baz/src/index.ts'],
    });
  });

  it('should create expected package.json', () => {
    expect(readJson(tree, 'packages/foo/bar-baz/package.json')).toEqual({
      ...rootPackageJsonBase(),
      repository: {
        ...rootPackageJsonBase().repository,
        directory: 'packages/foo/bar-baz',
      },
      publishConfig: { access: 'public' },
      dependencies: {},
      main: './index.js',
      name: '@ns/foo-bar-baz',
      type: 'module',
      types: './index.d.ts',
      version: '0.0.1',
      nx: expect.objectContaining({
        name: 'foo-bar-baz',
      }),
    });
  });

  it('should not create project.json', () => {
    expect(tree.exists('packages/foo/bar-baz/project.json')).toBe(false);
  });

  it('should generate expected vite.config.ts', () => {
    expect(readViteConfig(tree, 'packages/foo/bar-baz')).toMatchSnapshot();
  });

  it('should configure vite to build both esm and cjs, if publishable', () => {
    expect(readViteConfig(tree, 'packages/foo/bar-baz')).toContain(
      `formats: ['es' as const, 'cjs' as const],`,
    );
  });

  it('should configure vitest to pass with no tests', () => {
    expect(readViteConfig(tree, 'packages/foo/bar-baz')).toContain(
      `passWithNoTests: true,`,
    );
  });

  it('should not add the package to the root package.json', () => {
    expect(readJson(tree, 'package.json').dependencies).toEqual({});
  });

  it('should configure configure jsdom environment if env is jsdom', async () => {
    const jsdomTree = createEmptyPathBasedWorkspace();
    await pkgGenerator(jsdomTree, { ...options, env: 'jsdom' });
    expect(readViteConfig(jsdomTree, 'packages/foo/bar-baz')).toContain(
      `environment: 'jsdom',`,
    );
  });

  it('should configure configure edge environment if env is edge', async () => {
    const edgeTree = createEmptyPathBasedWorkspace();
    await pkgGenerator(edgeTree, { ...options, env: 'edge' });
    expect(readViteConfig(edgeTree, 'packages/foo/bar-baz')).toContain(
      `environment: 'edge-runtime',`,
    );
  });
});

describe('ts-path-based non-publishable package', () => {
  let tree: Tree;

  const options: PkgGeneratorSchema = {
    path: 'packages/foo/bar-baz',
    kind: 'ts-paths-based',
    publishable: false,
    buildable: false,
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

  it('should not create package.json (deleted for non-publishable)', async () => {
    await pkgGenerator(tree, options);
    expect(tree.exists('packages/foo/bar-baz/package.json')).toBe(false);
  });

  it('should create project.json for non-publishable package', async () => {
    await pkgGenerator(tree, options);
    expect(tree.exists('packages/foo/bar-baz/project.json')).toBe(true);

    const projectConfig = readProjectConfiguration(tree, 'foo-bar-baz');
    expect(projectConfig.targets?.test).toBeDefined();
    expect(projectConfig.targets?.lint).toBeDefined();
    expect(projectConfig.targets?.build).not.toBeDefined(); // No build target for non-publishable
  });

  it('should generate expected vite.config.ts with test configuration only', async () => {
    await pkgGenerator(tree, options);
    const viteConfig = tree
      .read('packages/foo/bar-baz/vite.config.ts')
      ?.toString();

    expect(viteConfig).toContain('passWithNoTests: true');
    expect(viteConfig).toContain("environment: 'node'");
    // Should not contain build configuration since it's not publishable
    expect(viteConfig).not.toContain('build:');
    expect(viteConfig).not.toContain('formats:');
  });

  it('should configure vitest to pass with no tests', async () => {
    await pkgGenerator(tree, options);
    expect(readViteConfig(tree, 'packages/foo/bar-baz')).toContain(
      `passWithNoTests: true,`,
    );
  });

  it('should not add the package to the root package.json', async () => {
    await pkgGenerator(tree, options);
    expect(readJson(tree, 'package.json').dependencies).toEqual({});
  });

  it('should configure jsdom environment if env is jsdom', async () => {
    await pkgGenerator(tree, { ...options, env: 'jsdom' });
    expect(readViteConfig(tree, 'packages/foo/bar-baz')).toContain(
      `environment: 'jsdom',`,
    );
  });

  it('should configure edge environment if env is edge', async () => {
    await pkgGenerator(tree, { ...options, env: 'edge' });
    expect(readViteConfig(tree, 'packages/foo/bar-baz')).toContain(
      `environment: 'edge-runtime',`,
    );
  });

  it('should generate expected vite.config.ts', async () => {
    await pkgGenerator(tree, options);
    expect(readViteConfig(tree, 'packages/foo/bar-baz')).toMatchSnapshot();
  });
});

//---------------------------------------

function createEmptyPathBasedWorkspace() {
  const tree = createTreeWithEmptyWorkspace();

  updateJson(tree, 'package.json', json => {
    return Object.assign(json, rootPackageJsonBase());
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
    Object.assign(json, rootPackageJsonBase());
    json.workspaces = ['packages/*'];
    return json;
  });

  writeJson(tree, 'tsconfig.base.json', {
    compilerOptions: {
      composite: true,
      declaration: true,
      customConditions: ['development'],
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

function readViteConfig(tree: Tree, projectRoot: string): string | undefined {
  const configPath = resolveViteConfigPath(tree, projectRoot);
  return configPath ? tree.read(configPath)?.toString() : undefined;
}

function rootPackageJsonBase() {
  return {
    name: '@ns/source',
    repository: {
      type: 'git',
      url: 'https://github.com/author/repo.git',
      directory: '.',
    },
    homepage: 'https://github.com/author/repo',
    bugs: {
      url: 'https://github.com/author/repo/issues',
    },
    author: 'Author',
    license: 'MIT',
  };
}
