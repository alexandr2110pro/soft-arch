# Task Completion Checklist: space-architects

After completing any coding task, run the following in order:

## 1. Type Check
```bash
nx run-many -t typecheck
# or for affected only:
nx affected -t typecheck
```

## 2. Lint
```bash
nx run-many -t lint
# or for affected only:
nx affected -t lint
```

## 3. Test
```bash
nx run-many -t test
# or for affected only:
nx affected -t test
```

## 4. Build (if changing library code)
```bash
nx run-many -t build --projects=tag:npm:public
# or for affected only:
nx affected -t build
```

## Combined (CI-equivalent)
```bash
nx affected -t lint test build
```

## Notes
- Tests require build outputs (via `dependsOn: ["^build"]`), so build first if test cache is stale
- Use `nx reset` to clear cache if you suspect stale results
- Always use conventional commit messages (feat/fix/chore/etc.)
- Do NOT commit directly to main; use feature branches and PRs
