# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This is the **space-architects** open-source monorepo. It publishes TypeScript utility packages to npm under the `@space-architects` scope. This is NOT a web application -- there are no servers, APIs, or UI components.

## Coding Guidelines

> For all coding style, design patterns, and conventions, see @docs/GUIDELINES.md. Follow it when writing or reviewing code.

## Package manager

This project uses [pnpm](https://pnpm.io/) as the package manager.

## Commands

```bash
# Run all tests
nx run-many -t test

# Run a single project's tests
nx run <project-name>:test

# Lint / typecheck / build all projects
nx run-many -t lint
nx run-many -t typecheck
nx run-many -t build --projects=tag:npm:public

# Run only tasks affected by uncommitted changes
nx affected -t lint test build

# Local registry (Verdaccio on :4873) for testing releases
nx local-registry
nx release --dry-run
nx release publish --registry=http://localhost:4873
```

Nx project names (`<project-name>`) are defined via `"nx": { "name": "..." }` in each `package.json` (e.g. `util-ts`, `util-enum`, `util-drizzle`, `nx-plugin-std`).

## Architecture

### Monorepo structure

```
packages/
  util/
    ts/        → @space-architects/util-ts       – pure type-level utilities (Simplify, TupleMerge, PropValues, NonEmptyArray)
    enum/      → @space-architects/util-enum     – runtime enum helpers (enumObject, enumSuite, enumPick, enumMerge, enumPrefixed)
    drizzle/   → @space-architects/util-drizzle  – Drizzle ORM helpers (lazyDrizzle proxy, uuidV7 custom column types)
  nx/plugin/
    std/       → @space-architects/nx-plugin-std – workspace generators (pkg, cfg, mv, rm)
```

All packages share a **fixed version** (bumped together on every release). Only packages tagged `npm:public` in their `package.json` `nx.tags` are published to npm.

### Build pipeline

- **Vite** is the build tool for `util/*` packages (library mode, emits ESM `.js` + CJS `.cjs` + `.d.ts`).
- **`@nx/js:tsc`** is used for `nx-plugin-std` (needs to preserve asset files like `generators.json`).
- Every package exposes a `@space-architects/source` custom export condition that points directly to TypeScript source, used during development inside the monorepo (`tsconfig.base.json` sets `customConditions`).
- `test` targets depend on `^build` -- dependency packages must be built before tests run.

### TypeScript

- Module system: `nodenext` -- local imports require explicit `.js` extensions.
- Strictest settings enabled: `strict`, `noUncheckedIndexedAccess`, `noImplicitReturns`, `noUnusedLocals`.
- Unused variables must be prefixed with `_`.
- `@typescript-eslint/no-explicit-any` is off -- `any` is acceptable in type utility implementations where necessary, but prefer `unknown` in all other code.

### Formatting & imports

Prettier enforces import order (via `@trivago/prettier-plugin-sort-imports`):
1. `server-only`
2. Third-party packages
3. `@space-architects/*`
4. `../` relative
5. `./` relative

### Versioning & release

Releases are triggered manually via GitHub Actions ("Prepare Release" workflow). Conventional commits determine the version bump -- all commit types other than `chore` produce a release (`feat` -> minor, everything else -> patch, `feat!` / `BREAKING CHANGE` -> major). See RELEASE.md for details.

## Additional Guidelines

- Do not add `Co-Authored-By` lines to commit messages.
- Never add `console.log`, `console.warn`, or `console.error` to library source code -- these are utility packages; logging belongs to the consumer.
- Always use `.js` extensions on local imports (required by `nodenext` module resolution).
- All public API functions should have JSDoc comments.
- When creating new exports, add them to the package's `src/index.ts` barrel file.
- Run `nx affected -t lint test build` before considering work complete.

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- You have access to the Nx MCP server and its tools, use them to help the user
- When answering questions about the repository, use the `nx_workspace` tool first to gain an understanding of the workspace architecture where applicable.
- When working in individual projects, use the `nx_project_details` mcp tool to analyze and understand the specific project structure and dependencies
- For questions around nx configuration, best practices or if you're unsure, use the `nx_docs` tool to get relevant, up-to-date docs. Always use this instead of assuming things about nx configuration
- If the user needs help with an Nx configuration or project graph error, use the `nx_workspace` tool to get any errors

# CI Error Guidelines

If the user wants help with fixing an error in their CI pipeline, use the following flow:
- Retrieve the list of current CI Pipeline Executions (CIPEs) using the `nx_cloud_cipe_details` tool
- If there are any errors, use the `nx_cloud_fix_cipe_failure` tool to retrieve the logs for a specific task
- Use the task logs to see what's wrong and help the user fix their problem. Use the appropriate tools if necessary
- Make sure that the problem is fixed by running the task that you passed into the `nx_cloud_fix_cipe_failure` tool


<!-- nx configuration end-->
