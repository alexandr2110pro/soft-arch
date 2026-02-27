import { logger } from '@nx/devkit';

import { versionMatchLatest } from './versionMatch.ts';

type VersionConstraintSegment = `${number | '*'}`;
export type VersionConstraint =
  | 'latest'
  | 'canary'
  | `${'^' | '~' | '>' | '<' | '>=' | '<=' | '=' | '!='}${string}`
  | `${VersionConstraintSegment}.${VersionConstraintSegment}.${VersionConstraintSegment}`;

/**
 * Resolves versions matching constraints from npm registry.
 * @param packages - A record of package names and their version constraints
 * @returns A record of package names and their resolved versions
 */
export async function versionResolve(
  packages: Record<string, VersionConstraint>,
): Promise<Record<string, string>> {
  const promises = Object.entries(packages).map(([name, constraint]) =>
    resolveOne(name, constraint),
  );

  const results = await Promise.all(promises);
  return Object.fromEntries(results);
}

//-------------------------------------

function shouldFetch(constraint: string): boolean {
  return (
    constraint === 'latest' ||
    constraint === 'canary' ||
    constraint.includes('*')
  );
}

interface NpmPackageData {
  'dist-tags': { latest: string; canary?: string };
  versions: Record<string, any>;
}

async function packageFetch(packageName: string): Promise<NpmPackageData> {
  const response = await fetch(`https://registry.npmjs.org/${packageName}`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json() as Promise<NpmPackageData>;
}

function constraintApply(
  constraint: string,
  packageData: NpmPackageData,
): string {
  if (constraint === 'latest') {
    return packageData['dist-tags'].latest;
  }

  if (constraint === 'canary') {
    return packageData['dist-tags'].canary || packageData['dist-tags'].latest;
  }

  // Handle version constraints like "2.3.*", "1.*.*"
  const matchingVersion = versionMatchLatest(
    Object.keys(packageData.versions),
    constraint,
  );
  return matchingVersion || constraint;
}

async function resolveOne(
  packageName: string,
  constraint: string,
): Promise<[string, string]> {
  if (!shouldFetch(constraint)) return [packageName, constraint];

  try {
    const packageData = await packageFetch(packageName);
    const resolvedVersion = constraintApply(constraint, packageData);
    return [packageName, resolvedVersion];
  } catch (error) {
    logger.warn(
      `Failed to fetch version for ${packageName}: ${(error as Error).message}, using fallback`,
    );
    return [packageName, constraint];
  }
}
