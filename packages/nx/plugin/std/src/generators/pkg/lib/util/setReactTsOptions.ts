import { type Tree, joinPathFragments } from '@nx/devkit';

import { updateArrayProperty } from './updateArrayProperty.ts';
import { updateTsConfigLibJson } from './updateTsConfigLibJson.ts';
import { updateTsConfigSpecJson } from './updateTsConfigSpecJson.ts';

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

export function setReactTsOptions(tree: Tree, path: string) {
  tree.write(joinPathFragments(path, '.babelrc'), BABELRC);

  updateTsConfigSpecJson(tree, path, json => {
    json.compilerOptions.jsx = 'react-jsx';
    json.compilerOptions.module = 'esnext';
    json.compilerOptions.moduleResolution = 'bundler';
    return json;
  });

  updateTsConfigLibJson(tree, path, json => {
    json.compilerOptions.jsx = 'react-jsx';
    json.compilerOptions.module = 'esnext';
    json.compilerOptions.moduleResolution = 'bundler';

    updateArrayProperty(json.compilerOptions, 'types', [
      'node',
      '@nx/react/typings/cssmodule.d.ts',
      '@nx/react/typings/image.d.ts',
      'vite/client',
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
      'eslint.config.js',
      'eslint.config.cjs',
      'eslint.config.mjs',
    ]);

    return json;
  });
}
