# Coding Guidelines

Coding style, design patterns, and conventions for this project. Applies to both human developers and AI coding assistants.

---

## Table of Contents

1. [General Principles](#1-general-principles)
2. [TypeScript Conventions](#2-typescript-conventions)
3. [Testing](#3-testing)
4. [Project Structure & Conventions](#4-project-structure--conventions)

---

## 1. General Principles

### Design Philosophy

- Write clean, idiomatic TypeScript following language and ecosystem best practices
- Prioritize readability, maintainability, and developer experience over micro-optimization
- Use meaningful names; avoid magic numbers and strings
- SOLID principles and GRASP patterns -- apply pragmatically, not dogmatically
- KISS and YAGNI -- avoid unnecessary complexity, abstractions, dependencies, code, tests, docs, and comments
- DRY only when truly beneficial -- a bad abstraction is worse than no abstraction
- Implement the right abstractions when genuinely needed
- Delay architectural decisions when possible

### Separation of Concerns & Behavior Locality

Split by **design decision hidden**, not by technical kind. Things that change together should live together; start co-located, extract when forced.

Prefer **deep modules** (simple interface, rich implementation) over shallow ones. If a change requires editing many files, the split axis is wrong (shotgun surgery).

### Flat Over Nested

Aim for **max 1-2 indentation levels**. Deeper nesting signals a need to refactor.

**Guard clauses & early returns** -- the single most effective technique. Invert conditions, exit early.

```ts
// BAD -- entire body nested inside conditions
function process(input: string | null) {
  if (input) {
    if (input.length > 0) {
      // ... 20 lines of logic
    }
  }
}

// GOOD -- guard clauses, flat happy path
function process(input: string | null) {
  if (!input) return;
  if (input.length === 0) return;
  // ... main logic at top level of nesting
}
```

**Techniques by nesting form:**

| Nesting form | Preferred fix | Also consider |
|---|---|---|
| Chained conditionals | Guard clauses + early return | Combine predicates, extract helper |
| Nested loops | Extract inner loop to function | Functional transforms (`.map`, `.filter`) |
| Nested error handling | Extract each level to own function | Return error values |
| Callback chains | `async`/`await` | `Promise.all()` for parallel |
| Deep member access | Safe navigation (`?.`) | Default-value accessors |

### Function Size

Functions should do one thing. Signs a function is too large:

- Multiple distinct concerns separated by blank lines
- Can't describe the function's purpose in one clear sentence
- 5+ parameters (consider a parameter object or splitting responsibilities)
- 6+ local variables tracking unrelated state

No hard line limit. A 60-line function doing one coherent thing is fine; a 25-line function juggling three concerns should be split. Assess by **number of responsibilities**, not lines of code.

### Command-Query Separation (Pragmatic)

A **query** reads data without side effects. A **command** mutates state.

The real anti-patterns:

1. **Side effect + return of unrelated data** -- a function that performs a non-trivial side effect AND returns data unrelated to it.
2. **Mutate A, return B** -- a function that creates/updates one thing but returns a different one.
3. **Hidden mutation in a query** -- a function that looks like a read but silently writes. If it mutates, the name must say so.

### No Embedded Resource Lifecycle

Don't embed resource creation/teardown inside business logic. Functions do work *or* manage lifecycle, not both.

```ts
// BAD -- function conditionally creates its own dependency
function process(connection?: DB) {
  const ownsConnection = !connection;
  if (ownsConnection) connection = createConnection();
  try {
    // ... actual work
  } finally {
    if (ownsConnection) connection.close();
  }
}

// GOOD -- lifecycle at the edges, logic receives ready-to-use dependency
function process(db: DB) {
  // ... actual work using db
}

// entry point owns the lifecycle
const db = createConnection();
process(db);
```

### Dependency Direction

Higher-level packages import from lower-level packages, never upward:

```
util-enum      -> util-ts
util-drizzle   -> (external: drizzle-orm, uuid)
nx-plugin-std  -> (external: @nx/devkit)
```

If you need to import "upward," that's a design smell. Fix by moving the shared type down or introducing an interface.

---

## 2. TypeScript Conventions

### Rely on Inference

Do NOT annotate return types or variable types unless heavily justified. TypeScript's inference is excellent -- use it.

```ts
// BAD -- redundant return type
function enumValues<T extends Record<string, string>>(
  obj: T,
): T[keyof T][] {
  return Object.values(obj);
}

// GOOD -- let inference work
function enumValues<T extends Record<string, string>>(obj: T) {
  return Object.values(obj) as T[keyof T][];
}
```

When to add explicit types:
- Public API contracts that need to be stable (rare)
- When inference produces an overly complex or unreadable type
- When the inferred type is incorrect or too wide

### `as const` and `Object.freeze`

Use `as const` for readonly literal types and `Object.freeze` for runtime immutability:

```ts
// as const on array arguments for tuple inference
const MY_ENUM = enumObject(['FOO', 'BAR'] as const);

// Object.freeze for immutable runtime objects
return Object.freeze(
  names.reduce(
    (res, key) => Object.assign(res, { [key]: key }),
    {} as EnumObject<TNamesTuple>,
  ),
);
```

Always use `as const` on array arguments when the caller needs literal type inference.

### `satisfies` Operator

Use `satisfies` when you want to validate a value against a type while preserving the narrower inferred type:

```ts
const config = {
  port: 3000,
  host: 'localhost',
} satisfies ServerConfig;
// config.port is `3000` (literal), not `number`
```

Also useful for exhaustiveness checks:

```ts
default:
  throw new Error('Unhandled case', { cause: value satisfies never });
```

### Functional Composition Over Classes

Prefer plain functions and function composition. Reserve classes only for cases where they are genuinely needed (e.g., `Proxy`-based patterns like `lazyDrizzle`).

```ts
// GOOD -- plain function with generics
export function enumObject<U extends string, TNamesTuple extends readonly U[]>(
  names: TNamesTuple,
): EnumObject<TNamesTuple> {
  return Object.freeze(
    names.reduce(
      (res, key) => Object.assign(res, { [key]: key }),
      {} as EnumObject<TNamesTuple>,
    ),
  );
}

// AVOID -- unnecessary class wrapper
class EnumBuilder<T extends string> {
  constructor(private names: T[]) {}
  build() { /* ... */ }
}
```

### Generics Best Practices

- Constrain generics to the minimum needed: `<T extends string>` not `<T>`
- Use meaningful generic names for complex signatures: `TNamesTuple` not `T2`
- Single-letter generics (`T`, `U`, `K`, `V`) are fine for simple cases
- Prefer inference from arguments over explicit generic parameters

### Avoid `any`

Prefer `unknown` over `any` for truly unknown values. However, `any` is acceptable in **type utility implementations** where it is necessary for type-level manipulation (e.g., conditional types, Proxy handlers). The ESLint rule `@typescript-eslint/no-explicit-any` is intentionally off for this reason.

```ts
// BAD -- lazy any in application code
function handle(data: any) { /* ... */ }

// GOOD -- use unknown and narrow
function handle(data: unknown) {
  if (typeof data === 'string') { /* ... */ }
}

// OK -- any in type utility implementation (necessary)
get(_target, prop) {
  const db = getDb();
  const value = (db as any)[prop as keyof T];
  return typeof value === 'function' ? value.bind(db) : value;
}
```

### Unused Variables

Prefix with `_` to satisfy ESLint's `varsIgnorePattern: '^_'` rule:

```ts
const [_ignored, important] = someFunction();
```

### Discriminated Unions

Prefer discriminated unions over class hierarchies for modeling variants:

```ts
type ColumnType =
  | { kind: 'uuid'; version: 7 }
  | { kind: 'text'; maxLength: number }
  | { kind: 'timestamp'; withTimezone: boolean };
```

### Import Ordering

Enforced by Prettier with `@trivago/prettier-plugin-sort-imports`. The order is:

1. `server-only`
2. Third-party packages
3. `@soft-arch/*`
4. Relative imports (`../`)
5. Relative imports (`./`)

Don't fight the formatter -- let it handle import ordering.

### `.js` Extensions on Local Imports

Required by `nodenext` module resolution. Always use `.js` extension for local imports, even though the source files are `.ts`:

```ts
// CORRECT
export { enumObject } from './lib/enum-object.js';

// WRONG -- will fail at runtime
export { enumObject } from './lib/enum-object';
```

### Barrel Exports

Every package has `src/index.ts` as its public API. Export both the function/value and its type:

```ts
// src/index.ts
export { type EnumObject, enumObject } from './lib/enum-object.js';
export { type EnumPrefixed, enumPrefixed } from './lib/enum-prefixed.js';
export type { EnumInferFromValues } from './lib/enum-infer-from-values.js';
```

Export only what consumers need. Don't re-export internal implementation details.

---

## 3. Testing

### Framework

**Vitest** is the test framework. Run tests via Nx:

```bash
nx run <project-name>:test
nx run <project-name>:test --testFile=<filename>
nx run-many -t test
```

### Test Environment

Tests run in `edge-runtime` environment (configured per-package in `vite.config.ts`). Global test functions (`describe`, `it`, `expect`, `vi`) are available without imports (`globals: true`), but explicit imports from `vitest` are also fine.

### Build Dependencies

Test targets depend on `^build` -- dependency packages must be built before tests run. If you change `util-ts`, it must be built before `util-enum` tests can pass.

### Test Structure

Tests are **colocated** with source files: `enum-object.ts` and `enum-object.spec.ts` side by side.

```ts
import { enumObject } from './enum-object.js';

describe('enumObject', () => {
  it('should create a frozen enum from string array', () => {
    const MY_ENUM = enumObject(['FOO', 'BAR'] as const);

    expect(MY_ENUM).toEqual({ FOO: 'FOO', BAR: 'BAR' });
    expect(Object.isFrozen(MY_ENUM)).toBe(true);
  });

  it('should provide type-safe access', () => {
    const MY_ENUM = enumObject(['A', 'B'] as const);
    expect(MY_ENUM.A).toBe('A');
  });
});
```

### Parameterized Tests

Use `it.each` for testing multiple cases:

```ts
it.each([
  ['get', 'select'],
  ['insert', 'insert'],
  ['update', 'update'],
  ['delete', 'delete'],
])('should proxy %s method', (method, expected) => {
  // ...
});
```

### Test Helpers

Create focused helper functions for test setup. Keep them in the test file unless shared across multiple test files:

```ts
function createMockDb() {
  return {
    select: vi.fn().mockReturnValue([]),
    insert: vi.fn(),
  };
}
```

---

## 4. Project Structure & Conventions

### Package Layout

```
packages/<category>/<name>/
  src/
    lib/              # Implementation files (kebab-case)
      feature.ts
      feature.spec.ts # Colocated tests
    index.ts          # Barrel exports (public API)
  package.json        # With nx.name and nx.tags
  vite.config.ts      # Vite library mode config
  tsconfig.json       # Extends base
  tsconfig.lib.json   # Library build config
  tsconfig.spec.json  # Test config
```

### Naming Conventions

| What | Convention | Examples |
|------|-----------|----------|
| Files | kebab-case | `enum-object.ts`, `lazy-drizzle.ts` |
| Functions | camelCase | `enumObject`, `enumMerge`, `lazyDrizzle` |
| Types / Interfaces | PascalCase | `EnumObject`, `Simplify`, `PropValues` |
| Test files | Colocated `.spec.ts` | `enum-object.spec.ts` |
| Packages | kebab-case in path | `packages/util/enum/` |
| npm scope | `@soft-arch/` | `@soft-arch/util-enum` |

### Nx Project Names

Project names are defined in `package.json` under `"nx": { "name": "..." }`:

- `packages/util/ts/` -> `util-ts`
- `packages/util/enum/` -> `util-enum`
- `packages/util/drizzle/` -> `util-drizzle`
- `packages/nx/plugin/std/` -> `nx-plugin-std`

### Publishing

- Only packages tagged `npm:public` in `package.json` `nx.tags` are published to npm
- All packages share a **fixed version** (bumped together on every release)
- Packages emit **dual output**: ESM (`.js`) + CJS (`.cjs`) + TypeScript declarations (`.d.ts`)
- Each package exposes a `@soft-arch/source` custom export condition pointing to TypeScript source (used for in-monorepo development)

### Build Tools

- **Vite** (library mode) for `util/*` packages -- emits ESM + CJS + `.d.ts` via `vite-plugin-dts`
- **`@nx/js:tsc`** for `nx-plugin-std` -- preserves asset files like `generators.json`

### Creating New Packages

Use the Nx generator:

```bash
nx g @soft-arch/nx-plugin-std:pkg
```

Follow the prompts to select kind, path, publishability, and environment.

### Module Boundaries

Enforced by `@nx/enforce-module-boundaries` ESLint rule. Packages should only depend on their declared dependencies. Check `package.json` dependencies to understand the allowed import graph.

### Named Exports Only

Always use named exports. Never use default exports:

```ts
// GOOD
export function enumObject() { /* ... */ }
export type EnumObject<T> = { /* ... */ };

// BAD
export default function enumObject() { /* ... */ }
```

### No Console in Library Code

Never use `console.log`, `console.warn`, or `console.error` in library source code. These are utility packages consumed by others -- logging decisions belong to the consumer.
