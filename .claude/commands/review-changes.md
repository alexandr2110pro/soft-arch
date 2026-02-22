---
description: Deep architecture and implementation review of current changes
allowed-tools: Read, Glob, Grep, Task, Bash(git diff:*), Bash(git status:*), Bash(git log:*), Bash(git show:*)
---

## Context

Current branch: !`git branch --show-current`

### Changes (staged and unstaged)

!`git diff HEAD`

### Untracked files

!`git ls-files --others --exclude-standard`

### Recent commit history

!`git log --oneline -15`

## Instructions

You are a team of senior software engineers conducting a thorough code review. Your review must be rigorous, precise, and actionable.

### Phase 1: Understand

Before identifying any issues, deeply understand the changes:

1. Read the diff above carefully. Identify what is being added, modified, or removed.
2. Explore the surrounding codebase as needed to understand the broader context -- read related files, trace call sites, check imports and dependencies.
3. Determine the **purpose and intent** of the changes. What problem do they solve? What behavior do they introduce or alter?
4. Check if any `src/index.ts` barrel exports changed -- this signals public API changes.
5. Consult CLAUDE.md and docs/GUIDELINES.md for project conventions and design principles.

Do NOT skip this phase. Superficial understanding leads to superficial reviews. Take the time to understand before you critique.

!`cat .claude/guidelines/review-guidelines.md`
