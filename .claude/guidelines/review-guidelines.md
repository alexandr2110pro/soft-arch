### Phase 2: Review

Evaluate the code through each of the following lenses. Only report genuine findings -- skip lenses with nothing meaningful to flag.

- **Correctness & Bugs** -- Does the code do what it intends? Logic errors, off-by-one mistakes, incorrect assumptions, unhandled edge cases, type mismatches, incorrect error handling.
- **Architecture & Design** -- Are responsibilities well-separated? Are abstractions at the right level? Does the design fit the existing architecture?
- **Separation of Concerns & Behavior Locality** -- Is the code split along the right boundaries? Things that change together should live together (Beck); things that hide independent design decisions should be separated (Parnas). Watch for both directions:
  - *Over-separation*: a single feature scattered across many files/layers requiring "ping-pong reading" to understand; shallow modules whose interface is more complex than their implementation (Ousterhout); abstractions with a single consumer that add indirection without hiding complexity; shotgun surgery where one behavioral change touches many files.
  - *Under-separation*: god modules mixing unrelated responsibilities; a change to one concern risking breakage in another; files that change for many unrelated reasons (divergent change).
- **Overengineering** -- Unnecessary complexity, premature abstractions, over-generalization, speculative features, or code designed for hypothetical future requirements. Three similar lines are better than a bad abstraction. Is the solution the simplest that solves the actual problem?
- **Public API Surface** -- Is the export necessary? Is it backward compatible with the previous version? Is the function/type well-typed with appropriate generic constraints? Will type inference work correctly for consumers?
- **Type Safety** -- Are generics properly constrained? Does type inference produce the expected types? Are there unnecessary type assertions (`as`) that could be avoided? Are `as const` assertions used where needed for literal type inference?
- **Project Conventions** -- Does the code follow the conventions established in CLAUDE.md and docs/GUIDELINES.md (naming, structure, patterns, tooling)?
  - kebab-case files, camelCase functions, PascalCase types
  - `.js` extensions on local imports
  - Named exports only, proper barrel exports in `index.ts`
  - `as const` on array arguments where literal types are needed
  - Functional style (no unnecessary classes)
  - Import ordering (handled by Prettier)
- **Design Principles** -- Are SOLID principles respected? Are relevant patterns applied correctly? Any anti-patterns?
- **Code Quality** -- Readability, clarity, naming, complexity. Is the code easy to understand and maintain?
- **Nesting & Function Size** -- Flat is better than nested; small is better than large.
  - *Deep nesting (4+ indentation levels)*: arrow anti-pattern, nested conditionals lacking guard clauses, nested try/catch blocks that should be flattened or extracted.
  - *Bumpy road*: multiple independent chunks of nested conditional logic in one function -- each bump should be its own function.
  - *Long functions*: functions handling multiple distinct concerns (look for blank-line-separated blocks doing unrelated things), functions that can't be described in one sentence, functions with 5+ parameters or 6+ unrelated local variables.
  - Refer to the "Flat Over Nested" section in docs/GUIDELINES.md for flattening techniques.
- **Refactoring Opportunities**:
  - Reuse of existing utilities/functions that the code is duplicating
  - New code that could be lifted into reusable utilities
  - Better naming or structural organization
- **Testing** -- Is the code adequately tested? Are there missing test cases for edge cases, error paths, or important behavior? Is the test code itself clean and well-structured?
- **Consistency** -- Does the code maintain consistency with surrounding code in style, patterns, and conventions?
- **Other** -- Anything else worth flagging

### Phase 3: Report

Present your findings organized by severity:

1. **Critical** -- Must fix. Bugs, correctness problems, breaking API changes.
2. **Important** -- Should fix. Design issues, convention violations, significant quality concerns.
3. **Suggestions** -- Worth improving. Real but lower-priority improvements the author should consider acting on now.

For each finding:
- State the issue clearly and concisely
- Reference the specific file and code
- Explain *why* it's a problem
- Suggest a fix when the solution is clear

Rules:
- **Verify before reporting.** You have tools (Read, Glob, Grep) -- use them. If a potential issue can be confirmed or dismissed by reading a file, checking a config, or searching the codebase, do that yourself. Never report "check if X" or "verify whether Y" -- either confirm it's a problem and report it, or confirm it's fine and omit it.
- Every finding must describe a **concrete problem or improvement the author should act on now**. If there's no action to take, don't mention it.
- Never include observations about well-implemented code ("this is correct," "no change needed," "confirming this is intentional").
- Never include future-proofing notes ("when you add X later, you'll need to refactor Y").
- Never include "this is fine but..." or "no issue here, just noting..." patterns -- if it's not a problem, omit it entirely.
- Do not manufacture issues to appear thorough. If the code is solid, say so briefly and stop.
- No fluff -- every sentence in the report must earn its place by pointing to something that needs fixing or improving.
