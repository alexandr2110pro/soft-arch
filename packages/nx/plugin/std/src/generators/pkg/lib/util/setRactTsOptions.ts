import { Tree, joinPathFragments } from '@nx/devkit';

import { updateArrayProperty } from './updateArrayProperty';
import { updateTsConfigLibJson } from './updateTsConfigLibJson';
import { updateTsConfigSpecJson } from './updateTsConfigSpecJson';

const BABELRC = `
{
  "presets": [
    [
      "@nx/react/babel",
      {
        "runtime": "automatic",
        "useBuiltIns": "usage"
      }
    ]
  ],
  "plugins": []
}
`.trim();

export function setReactTsOptions(
  tree: Tree,
  path: string,
  buildable: boolean,
) {
  tree.write(joinPathFragments(path, '.babelrc'), BABELRC);

  updateTsConfigSpecJson(tree, path, json => {
    json.compilerOptions.jsx = 'react-jsx';
    json.compilerOptions.module = 'esnext';
    json.compilerOptions.moduleResolution = 'bundler';
  });

  updateTsConfigLibJson(tree, path, json => {
    json.compilerOptions.jsx = 'react-jsx';
    json.compilerOptions.module = 'esnext';
    json.compilerOptions.moduleResolution = 'bundler';

    updateArrayProperty(json.compilerOptions, 'types', [
      'node',
      '@nx/react/typings/cssmodule.d.ts',
      '@nx/react/typings/image.d.ts',
      ...(buildable ? ['vite/client'] : []),
    ]);

    updateArrayProperty(json, 'include', [
      'src/**/*.js',
      'src/**/*.jsx',
      'src/**/*.ts',
      'src/**/*.tsx',
    ]);

    updateArrayProperty(json, 'exclude', [
      'out-tsc',
      'dist',
      '**/*.spec.ts',
      '**/*.test.ts',
      '**/*.spec.tsx',
      '**/*.test.tsx',
      '**/*.spec.js',
      '**/*.test.js',
      '**/*.spec.jsx',
      '**/*.test.jsx',
      'vite.config.ts',
      'vite.config.mts',
      'vitest.config.ts',
      'vitest.config.mts',
      'src/**/*.test.ts',
      'src/**/*.spec.ts',
      'src/**/*.test.tsx',
      'src/**/*.spec.tsx',
      'src/**/*.test.js',
      'src/**/*.spec.js',
      'src/**/*.test.jsx',
      'src/**/*.spec.jsx',
      'eslint.config.js',
      'eslint.config.cjs',
      'eslint.config.mjs',
    ]);

    return json;
  });
}
