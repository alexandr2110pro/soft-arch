---
description: Deeply explore and document the given scope
allowed-tools: Read, Glob, Grep, Task, Edit, Write, Bash(pnpm nx *)
---

## Documentation Scope and output

$ARGUMENTS

## Instructions

You are a lead engineer and architect of this project.
Your goal is to write great concise and crystal-clear technical documentation.

### Phase 1: Discover & Understand

Understand very well the given documentation scope and its context.

**Research the scope from every relevant angle:**

- **Implementation**: Read the actual source code -- functions, types, generics, exports. Understand what exists and how it works.
- **Public API**: Map every export in `src/index.ts`. Understand what consumers see and use.
- **Type-level behavior**: Understand generic parameters, constraints, inference behavior, and how types compose.
- **Internal relationships**: Map how in-scope components connect to each other -- calls, imports, type dependencies.
- **External relationships**: Map how in-scope components connect to external packages (e.g., `util-enum` depends on `util-ts`).
- **Testing**: Understand what is tested and how. Tests often serve as the best usage examples.

**Skip angles that don't apply.** Not every scope has external dependencies or complex type behavior.

**Use the right tools for exploration:**
- Serena's symbolic tools (`get_symbols_overview`, `find_symbol`, `find_referencing_symbols`) for efficient code reading
- `search_for_pattern` for finding usage patterns across the codebase
- `Glob` and `Grep` for file discovery
- Read full files only when necessary -- prefer targeted symbol reads

### Phase 2: Process & Plan

Organize the collected information into a documentation outline:

1. **Identify the key concepts** -- What are the 3-7 most important things a reader needs to understand?
2. **Determine the structure** -- What sections, what order? Start with the big picture, drill into details.
3. **Plan usage examples** -- Extract real examples from tests. Where would showing type inference behavior be helpful?
4. **Plan cross-references** -- What existing docs should be linked to?
5. **Draft the outline** -- Section headings with bullet points of what each section will cover.

### Phase 3: Check completeness

Review your outline against the collected information:

- **Coverage check**: Does every public export have documentation?
- **Gap check**: Are there questions you can't answer yet? Things you assumed but didn't verify?
- **Depth check**: Is the level of detail appropriate -- enough to be useful, not so much it's noise?

**If gaps exist, go back to Phase 1** for targeted research, then update the plan.

### Phase 4: Write

Compose the final documentation following these principles:

**Writing style:**
- **Stay pragmatic and concise.** Every sentence must earn its place.
- Lead with the "what" and "why" before the "how".
- **Document purpose, contracts, and usage examples -- not implementation logic.** Developers can read the code for logic; docs should capture the things that aren't obvious from the code itself.
- Show type inference behavior in examples where it aids understanding.
- Use bold for key terms on first use. Use inline code for identifiers (`functionName`, `@soft-arch/package-name`).
- Prefer bullet lists over prose for enumerations.
- Keep sections short. If a section exceeds ~40 lines, consider splitting it.

**Structure conventions:**
- Start with a 1-2 sentence summary of what this doc covers.
- Include a table of contents for docs with 4+ sections.
- End with "See also" links to related documentation.

**Output location:**
- Use the location specified in the scope. If none specified, output to `docs/` in an appropriate subdirectory.
- Use `.md` format.

### Phase 5: Verify

This is the most critical phase. **Every fact must be traceable to source code.**

Go through the written documentation point by point:

1. **Fact-check every claim** -- Re-read the relevant source code to confirm. Function names, parameter types, return types, file paths, package names -- all must be exact.
2. **Verify code snippets** -- Every usage example must reflect actual call patterns found in the codebase (tests are the best source). Do not invent examples -- extract from real call sites and simplify only if necessary.
3. **Check file paths and package names** -- Every `@soft-arch/...` alias, every `packages/...` path must exist.
4. **Check cross-references** -- Every link to another doc or section must be valid.
5. **Remove anything unverified** -- If you cannot confirm a fact from source, delete it.

**If verification reveals errors, fix them. If it reveals gaps, go back to Phase 1.**
