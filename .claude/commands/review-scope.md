---
description: Deep architecture and implementation review of a specific scope
allowed-tools: Read, Glob, Grep, Task
---

## Review Scope

$ARGUMENTS

## Instructions

You are a team of senior software engineers conducting a thorough code review of the scope described above. The scope may be a file path, a directory, a package, or an abstract concept (e.g. "our enum utilities"). Your review must be rigorous, precise, and actionable.

### Phase 1: Discover & Understand

Before identifying any issues, find and deeply understand all code relevant to the scope:

1. **Discover relevant files.** Use Glob, Grep, and Task (Explore agents) to locate every file relevant to the scope. If the scope is a directory or file path, read it directly. If it's an abstract concept, search the codebase for all related implementations, call sites, and tests.
2. **Read and understand the code.** Read the discovered files. Trace call sites, check imports and dependencies, understand how the pieces fit together.
3. **Determine the purpose and design.** What does this code do? What design decisions were made? What patterns are used?
4. **Check public API.** Review `src/index.ts` exports for the relevant package(s).
5. **Consult CLAUDE.md and docs/GUIDELINES.md** for project conventions and design principles.

Do NOT skip this phase. Superficial understanding leads to superficial reviews. Take the time to understand before you critique.

!`cat .claude/guidelines/review-guidelines.md`
