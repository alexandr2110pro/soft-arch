# Release Process

## Overview

- **Independent versioning** -- each package evolves at its own pace
- **Manual releases** -- triggered via GitHub Actions, never automatic
- **Conventional commits** -- automatic version bumping based on commit messages
- **Per-package changelogs** -- each package maintains its own `CHANGELOG.md`
- **npm publishing** -- automatic publishing with provenance to npmjs.org

## Conventional Commits

Use scoped conventional commits to target specific packages:

```bash
git commit -m "feat(util-ts): add DeepPartial type"      # minor bump for util-ts
git commit -m "fix(nx-plugin-std): handle empty config"   # patch bump for nx-plugin-std
git commit -m "refactor(util-enum): simplify internals"   # patch bump for util-enum
git commit -m "feat!: remove deprecated API"              # major bump for affected packages
```

Version bump rules:
- `feat:` -> **minor** bump
- `fix:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`, `build:`, `ci:`, `revert:` -> **patch** bump
- `feat!:` or `BREAKING CHANGE:` -> **major** bump
- `chore:` -> no version bump

Unscoped commits that touch files in multiple packages bump all affected packages. Nx determines affected packages by analyzing which files changed in each commit.

### Dependency updates

When `util-ts` bumps, Nx automatically patch-bumps `util-enum` (which depends on it) and updates its `package.json` dependency reference via the `updateDependents` mechanism.

## Creating a Release

1. Go to **GitHub Actions** -> "Release" workflow
2. Click **"Run workflow"** with `dry-run: true` (default) to preview
3. Review the output -- it shows which packages will be bumped and to what version
4. If satisfied, re-run with `dry-run: false`

The workflow automatically:
- Bumps versions in each affected package's `package.json`
- Updates inter-package dependency references as needed
- Generates/updates per-package `CHANGELOG.md` files
- Commits, tags (e.g., `util-ts@1.7.0`, `util-enum@1.6.2`), and pushes
- Builds all public packages
- Publishes affected packages to npm (with provenance)
- Creates a GitHub Release for each tag

### First release under independent versioning

When running the workflow for the first time after migrating from fixed versioning, enable the `first-release` flag. This tells Nx to create the initial per-package tags (`util-ts@X.Y.Z`, `util-enum@X.Y.Z`, etc.) based on each package's current version on disk.

## Local Development

### Preview

```bash
# Preview what the next release would look like
nx release --dry-run
```

### Verdaccio (local registry)

```bash
# Terminal 1: start local registry
nx local-registry

# Terminal 2: release and publish locally
nx release --skip-publish --first-release     # first time only
nx release --skip-publish                     # subsequent releases
nx release publish --registry=http://localhost:4873
```

## Registry Configuration

- **Local development**: `http://localhost:4873` (Verdaccio, managed by Nx)
- **CI/Production**: `https://registry.npmjs.org` (npm registry)

The `.npmrc` in the repo points `@space-arch` to localhost for local Verdaccio testing. The CI workflow overrides this by writing `~/.npmrc` with the npm registry auth.
