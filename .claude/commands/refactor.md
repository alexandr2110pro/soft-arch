---
description: Refactor code guided by software design principles and project conventions
allowed-tools: Read, Glob, Grep, Task, Edit, Write, Bash(pnpm nx lint:*), Bash(pnpm nx typecheck:*), Bash(nx run:*), Bash(nx affected:*)
---

## Refactoring Scope

$ARGUMENTS

## Instructions

You are a senior software engineer performing a focused refactoring. Your goal is to improve code quality, clarity, and maintainability without changing external behavior.

### Phase 1: Discover & Understand

Before changing anything, deeply understand the code:

1. **Locate all relevant code.** Use Glob, Grep, and Task (Explore agents) to find every file in scope. If the scope is a directory or file path, read it directly. If abstract, search the codebase.
2. **Read and understand the code.** Trace call sites, check imports, understand how pieces fit together.
3. **Identify the current design.** What does this code do? What patterns are used? What are its responsibilities?
4. **Check the public API surface.** Read `src/index.ts` -- what is exported? Will the refactoring change any exports?
5. **Consult project conventions** from @CLAUDE.md and @docs/GUIDELINES.md.

Do NOT skip this phase. You must understand code before refactoring it.

### Phase 2: Analyze

Evaluate the code through each of the following lenses. Only report findings where refactoring is warranted.

#### General Design

- **Separation of Concerns** -- Things that change together should live together. Watch for over-separation (shotgun surgery), under-separation (god modules), or wrong axis (splitting by technical layer when feature/domain would be clearer).
- **Overengineering** -- Unnecessary complexity, premature abstractions, over-generalization, speculative features. Three similar lines are better than a bad abstraction.
- **Nesting & Flatness** -- Aim for max 1-2 indentation levels. Use guard clauses and early returns. Flatten arrow anti-patterns, nested conditionals, nested try/catch.
- **Function Size & Cohesion** -- Functions should do one thing. Signs of trouble: multiple concerns separated by blank lines, can't describe purpose in one sentence, 5+ parameters, 6+ unrelated local variables.
- **DRY (pragmatically)** -- A bad abstraction is worse than no abstraction. Only extract when genuinely beneficial.

#### Library API Design

- **Public API surface** -- Are exports minimal and intentional? Only export what consumers need.
- **Backward compatibility** -- Will this refactoring break existing consumers? If so, flag it explicitly.
- **Generic type parameters** -- Are generics properly constrained? Does inference work as expected?
- **Documentation** -- Do public functions have JSDoc with `@example`?

#### Project Conventions (@CLAUDE.md, @docs/GUIDELINES.md)

- **Naming** -- kebab-case files, camelCase functions, PascalCase types.
- **TypeScript** -- Rely on inference; use `as const` where needed; use `satisfies` for type validation; prefer `unknown` over `any` (but `any` is acceptable in type utility internals).
- **Exports** -- Named exports only. Barrel exports in `src/index.ts` with `.js` extensions.
- **Functional style** -- Plain functions, no unnecessary classes.
- **Import ordering** -- Enforced by Prettier; don't fight the formatter.

### Phase 3: Plan

Present your refactoring plan organized by priority:

1. **Critical** -- Bugs, correctness issues discovered during analysis.
2. **Important** -- Design issues, convention violations, significant quality concerns.
3. **Suggestions** -- Real but lower-priority improvements worth making.

For each item:
- State the issue clearly
- Reference the specific file and code
- Explain *why* it's a problem
- Describe the proposed change

Rules:
- Every finding must describe a **concrete improvement to act on now**.
- Never include observations about well-implemented code.
- Never include future-proofing notes.
- Do not manufacture issues to appear thorough. If the code is solid, say so briefly.

### Phase 4: Refactor

After presenting the plan, proceed with the refactoring:

1. Apply changes from highest to lowest priority.
2. Preserve all existing behavior -- refactoring must not change what the code does.
3. If public API changes are necessary, document them clearly.
4. Update tests alongside implementation changes.
5. After changes, run lint and typecheck on affected projects:
   - `pnpm nx lint <project-name>`
   - `pnpm nx typecheck <project-name>`
6. Fix any lint or type errors introduced by the refactoring.

### Phase 5: Summary

Provide a concise summary of:
- What was changed and why
- Which files were modified
- Any public API changes (additions, removals, modifications)
- Any trade-offs or decisions made
- Anything that was intentionally left unchanged and why
