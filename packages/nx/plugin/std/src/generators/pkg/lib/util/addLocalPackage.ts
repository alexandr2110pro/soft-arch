import { type Tree, readJson, updateJson } from '@nx/devkit';

export interface AddLocalPackageOptions {
  packageName: string;
  version?: string;
  isDev?: boolean;
}

/**
 * Adds a local package to the root package.json dependencies
 * @param tree - The NX Tree instance
 * @param options - Configuration options for adding the package
 */
export function addLocalPackage(
  tree: Tree,
  options: AddLocalPackageOptions,
): void {
  const { packageName, version = 'workspace:*', isDev = false } = options;

  updateJson(tree, 'package.json', json => {
    const dependencyKey = isDev ? 'devDependencies' : 'dependencies';

    // Ensure the dependencies object exists
    if (!json[dependencyKey]) {
      json[dependencyKey] = {};
    }

    // Add the package with the specified version
    json[dependencyKey][packageName] = version;

    return json;
  });
}

/**
 * Extracts the scope from the root package.json name field
 * @param tree - The NX Tree instance
 * @returns The scope (e.g., '@space-arch') or null if no scope
 */
function getWorkspaceScope(tree: Tree): string | null {
  const rootPackageJson = readJson(tree, 'package.json');
  const packageName = rootPackageJson.name;

  if (packageName && packageName.startsWith('@')) {
    const scopeMatch = packageName.match(/^(@[^/]+)/);
    return scopeMatch ? scopeMatch[1] : null;
  }

  return null;
}

/**
 * Adds a local package with the workspace scope automatically applied
 * @param tree - The NX Tree instance
 * @param packageName - The package name (without scope)
 * @param isDev - Whether to add to devDependencies instead of dependencies
 */
export function addScopedLocalPackage(
  tree: Tree,
  packageName: string,
  isDev = false,
): void {
  const scope = getWorkspaceScope(tree);
  const fullPackageName = scope ? `${scope}/${packageName}` : packageName;

  addLocalPackage(tree, {
    packageName: fullPackageName,
    version: 'workspace:*',
    isDev,
  });
}
