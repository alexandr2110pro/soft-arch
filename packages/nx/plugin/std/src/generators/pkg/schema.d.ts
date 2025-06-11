export interface PkgGeneratorSchema {
  path: string;
  kind: 'ts-reference-based' | 'ts-paths-based';
  publishable: boolean;
  env: 'node' | 'jsdom' | 'edge';
}
