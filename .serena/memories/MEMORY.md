# space-arch - Project Memory

## Overview
Open-source TypeScript utility library monorepo. Publishes packages under `@space-arch/` namespace to npm.

## Quick Reference
- **Package manager**: pnpm (workspace protocol)
- **Monorepo tool**: Nx 21.5.3
- **Language**: TypeScript 5.9.2 (strict)
- **Test runner**: Vitest 3.2.3 (edge-runtime)
- **Build tool**: Vite 7.1.6

## Key Packages
- `packages/util/enum` - Enum utilities with type inference
- `packages/util/ts` - Advanced TypeScript type utilities  
- `packages/util/drizzle` - Drizzle ORM utilities
- `packages/nx/plugin/std` - Nx plugin for project config standardization

## Essential Commands
See `suggested_commands.md` for full list.

| Task | Command |
|------|---------|
| Test all | `nx run-many -t test` |
| Lint all | `nx run-many -t lint` |
| Typecheck all | `nx run-many -t typecheck` |
| Affected tasks | `nx affected -t lint test build` |

## Detailed Memory Files
- `project-overview.md` - Full project structure and architecture
- `suggested_commands.md` - All development commands
- `style-conventions.md` - Code style and TypeScript conventions
- `task-completion.md` - What to run after completing a task
