export interface PkgGeneratorSchema {
  path: string;
  kind: 'ts-reference-based' | 'ts-paths-based';
  buildable: boolean;
  publishable: boolean;
  env: 'node' | 'jsdom' | 'edge';
  preset: 'nextjs' | 'react' | 'js';
}
