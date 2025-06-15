export function versionMatchLatest(
  versions: string[],
  constraint: string,
): string | null {
  // Convert constraint like "2.3.*" to regex pattern
  const pattern = constraint.replace(/\*/g, '\\d+');
  const regex = new RegExp(`^${pattern}$`);

  // Filter versions that match the constraint
  const matchingVersions = versions.filter(version => regex.test(version));

  if (matchingVersions.length === 0) {
    return null;
  }

  // Sort versions using semver-like comparison and return the latest
  return matchingVersions.sort((a, b) => compareVersions(a, b)).pop() || null;
}

export function compareVersions(a: string, b: string): number {
  const aParts = a.split('.').map(Number);
  const bParts = b.split('.').map(Number);

  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const aPart = aParts[i] || 0;
    const bPart = bParts[i] || 0;

    if (aPart > bPart) return 1;
    if (aPart < bPart) return -1;
  }

  return 0;
}
