# Code Style & Conventions: space-architects

## TypeScript
- **Strict mode**: all strict flags enabled
- `noUnusedLocals: true` - prefix with `_` if intentionally unused
- `noImplicitReturns: true`
- `noImplicitOverride: true`
- `noUncheckedIndexedAccess: true`
- `noFallthroughCasesInSwitch: true`
- **No explicit `any`** - use proper types or `unknown`
- Module system: `nodenext` (import paths must include `.js` extension for local imports)
- Target: ESNext

## Prettier (.prettierrc)
- Semi-colons: `true`
- Single quotes: `true`
- Trailing commas: `all`
- Tab width: `2`
- Print width: `80`
- Arrow function parens: `avoid` (i.e., `x => x`)
- **Import order** (via prettier-plugin-sort-imports):
  1. `server-only` imports
  2. Third-party packages
  3. `@space-architects/*` packages
  4. Relative imports

## ESLint (flat config)
- Based on Nx TypeScript/JavaScript presets
- Prettier integrated (formatting errors as lint errors)
- `@nx/enforce-module-boundaries` - strict cross-package dependency rules
- Max 1 empty line between blocks; 1 empty line at EOF

## Naming Conventions
- Files: kebab-case (e.g., `my-utility.ts`, `my-utility.spec.ts`)
- Exports: camelCase for functions/variables, PascalCase for types/classes/interfaces
- Test files: `*.spec.ts` or `*.test.ts` co-located with source

## Module Exports
- Each package has an `index.ts` or specified entry points
- Dual output: ESM (`.js`) + CJS (`.cjs`)
- TypeScript declarations (`.d.ts`) always included
- Use named exports (avoid default exports)

## Commit Messages (Conventional Commits)
- `feat:` → minor version bump
- `fix:` → patch version bump
- `feat!:` or `BREAKING CHANGE:` → major version bump
- `chore:`, `docs:`, `refactor:`, `test:` → no version bump
