import { describe, expect, it } from 'vitest';

import { compareVersions, versionMatchLatest } from './versionMatch';

describe('compareVersions', () => {
  it('should compare versions correctly', () => {
    expect(compareVersions('1.0.0', '1.0.1')).toBe(-1);
    expect(compareVersions('1.0.1', '1.0.0')).toBe(1);
    expect(compareVersions('1.0.0', '1.0.0')).toBe(0);
  });

  it('should handle major version differences', () => {
    expect(compareVersions('2.0.0', '1.9.9')).toBe(1);
    expect(compareVersions('1.9.9', '2.0.0')).toBe(-1);
  });

  it('should handle minor version differences', () => {
    expect(compareVersions('1.2.0', '1.1.9')).toBe(1);
    expect(compareVersions('1.1.9', '1.2.0')).toBe(-1);
  });

  it('should handle patch version differences', () => {
    expect(compareVersions('1.0.2', '1.0.1')).toBe(1);
    expect(compareVersions('1.0.1', '1.0.2')).toBe(-1);
  });

  it('should handle missing parts as zero', () => {
    expect(compareVersions('1.0', '1.0.0')).toBe(0);
    expect(compareVersions('1.0.0', '1.0')).toBe(0);
    expect(compareVersions('1', '1.0.0')).toBe(0);
    expect(compareVersions('1.0.0', '1')).toBe(0);
  });

  it('should handle different version lengths', () => {
    expect(compareVersions('1.0.0', '1.0.0.1')).toBe(-1);
    expect(compareVersions('1.0.0.1', '1.0.0')).toBe(1);
  });
});

describe('findLatestMatchingVersion', () => {
  const versions = [
    '1.0.0',
    '1.0.1',
    '1.1.0',
    '2.0.0',
    '2.1.0',
    '2.3.0',
    '2.3.1',
    '2.3.10',
    '2.4.0',
    '3.0.0',
    '10.0.0',
  ];

  it('should find latest version matching specific patch constraint', () => {
    expect(versionMatchLatest(versions, '2.3.*')).toBe('2.3.10');
  });

  it('should find latest version matching major constraint', () => {
    expect(versionMatchLatest(versions, '2.*.*')).toBe('2.4.0');
  });

  it('should find latest version matching minor constraint', () => {
    expect(versionMatchLatest(versions, '1.*.*')).toBe('1.1.0');
  });

  it('should handle single digit major version', () => {
    expect(versionMatchLatest(versions, '1.*.*')).toBe('1.1.0');
    expect(versionMatchLatest(versions, '2.*.*')).toBe('2.4.0');
  });

  it('should handle double digit major version', () => {
    expect(versionMatchLatest(versions, '10.*.*')).toBe('10.0.0');
  });

  it('should return null when no versions match', () => {
    expect(versionMatchLatest(versions, '5.*.*')).toBe(null);
    expect(versionMatchLatest(versions, '2.5.*')).toBe(null);
  });

  it('should handle empty versions array', () => {
    expect(versionMatchLatest([], '1.*.*')).toBe(null);
  });

  it('should handle constraint with multiple wildcards', () => {
    expect(versionMatchLatest(versions, '*.*.*')).toBe('10.0.0');
  });

  it('should handle real-world version examples', () => {
    const realVersions = [
      '8.55.0',
      '8.56.0',
      '8.57.0',
      '9.0.0',
      '9.1.0',
      '9.1.1',
    ];

    expect(versionMatchLatest(realVersions, '8.*.*')).toBe('8.57.0');
    expect(versionMatchLatest(realVersions, '9.0.*')).toBe('9.0.0');
    expect(versionMatchLatest(realVersions, '9.1.*')).toBe('9.1.1');
    expect(versionMatchLatest(realVersions, '9.1.0')).toBe('9.1.0');
  });

  it('should properly sort semantic versions', () => {
    const unsortedVersions = ['2.3.1', '2.3.10', '2.3.2', '2.3.9'];

    expect(versionMatchLatest(unsortedVersions, '2.3.*')).toBe('2.3.10');
  });

  it('should handle versions with different number of segments', () => {
    const mixedVersions = ['1.0', '1.0.0', '1.0.1', '1.1', '1.1.0'];

    expect(versionMatchLatest(mixedVersions, '1.0.*')).toBe('1.0.1');
    expect(versionMatchLatest(mixedVersions, '1.1.*')).toBe('1.1.0');
  });
});
