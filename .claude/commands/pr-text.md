Generate a PR title and description for the current branch against the origin/main branch.

## Steps

1. Run `git log origin/main..HEAD --oneline` to see all commits on the branch.
2. Run `git diff origin/main...HEAD --stat` to see the scope of changes.
3. If needed, read specific changed files or diffs to understand the intent.

## Output format

Produce a concise title and a markdown description body. Example:

**Title:** `feat(util-enum): add enumExclude utility`

**Description:**

```
## Summary

- Bullet points capturing the essence of what changed and why
- Focus on user/developer-facing impact, not implementation minutiae
- Group related changes into single bullets

## Affected Packages

- `@space-arch/util-enum`

## Public API Changes

- Added: `enumExclude()` function and `EnumExclude` type
```

## Rules

- The title must be under 72 characters and use conventional commit format.
- The description should have a `## Summary` section with concise bullet points.
- Include `## Affected Packages` listing which `@space-arch/*` packages are touched.
- Include `## Public API Changes` if any exports in `index.ts` files changed (added, removed, modified).
- Capture the *why* and *what*, not the *how*. Avoid listing every file touched.
- Do not include testing/verification/QA instructions.
- Do not add `Co-Authored-By` lines or mention Claude.
