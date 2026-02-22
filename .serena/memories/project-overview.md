# Project Overview: space-architects

## Purpose
Open-source TypeScript utility library monorepo publishing packages under `@space-architects/` to npm. MIT licensed.

## Tech Stack
- TypeScript 5.9.2 (strict, nodenext modules, ESNext target)
- Nx 21.5.3 with plugins: @nx/js, @nx/vite, @nx/next, @nx/eslint, @nx/web
- Vite 7.1.6 + vite-plugin-dts for library builds
- SWC 1.12.1 for fast compilation
- Vitest 3.2.3 (edge-runtime environment, global test API)
- ESLint 9.29.0 (flat config) + Prettier 3.5.3
- pnpm workspace manager
- Drizzle ORM 0.44.2, Zod 3.25.64, React 19.1.0, Next.js 15.3.3, UUID 11.1.0

## Project Structure
```
space-architects/
├── packages/
│   ├── util/
│   │   ├── enum/      - Enum utilities with type inference
│   │   ├── ts/        - Advanced TypeScript type utilities
│   │   └── drizzle/   - Drizzle ORM utilities
│   └── nx/plugin/std/ - Nx plugin for standardized project configuration
├── local/             - Local dev files
├── scripts/           - Utility scripts
├── .github/workflows/ - CI/CD
├── .verdaccio/        - Local npm registry config
├── nx.json            - Nx workspace config
├── tsconfig.base.json - Base TypeScript config
├── pnpm-workspace.yaml
├── eslint.config.mjs  - ESLint flat config
├── .prettierrc
└── vitest.workspace.ts
```

## Key Config Files
- `nx.json` - Nx plugins, cache, release config, task defaults
- `tsconfig.base.json` - Shared strict TS config with path aliases
- `eslint.config.mjs` - Flat config with Nx module boundaries
- `.prettierrc` - Formatting rules + import-sort plugin

## Architecture Decisions
- **Fixed versioning**: All packages share the same semver (conventional commits drive bumping)
- **Dual output**: Each package exports ESM (.js) and CJS (.cjs) with .d.ts files
- **Tag-based publishing**: Packages tagged `npm:public` are published to npm
- **Nx cache**: Build outputs cached; tests depend on builds (`dependsOn: ["^build"]`)
- **Module boundaries**: Strict cross-package dependency enforcement via Nx

## Release Process
- Triggered via GitHub Actions "Prepare Release" workflow
- Local testing: `nx local-registry` (Verdaccio on port 4873)
- Conventional commits: feat → minor, fix → patch, feat! → major
- NPM_ACCESS_TOKEN secret required for publishing
