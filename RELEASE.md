# Release Process Documentation

This document outlines the automated release process for the Space Architects monorepo using Nx Release and GitHub Actions.

## Overview

Our release system provides:
- ✅ **Manual release control** - No automatic releases on main branch pushes
- ✅ **Unified versioning** - All packages maintain the same version
- ✅ **Semantic versioning** - Version bumps determined by conventional commits
- ✅ **Automated changelog** - Generated from commit history
- ✅ **GitHub releases** - Automatic creation with release notes
- ✅ **NPM publishing** - Automatic publishing to npmjs.org

## Branching Strategy

### Development Flow
1. Create feature/fix branches from `main`
2. Submit PRs for review
3. Merge to `main` (CI runs, but NO release)
4. Manually trigger release when ready

### Release Flow
```
main branch → manual trigger → prepare release → GitHub release → npm publish
```

## Conventional Commits

Use conventional commit format for automatic version determination:

```bash
# Patch release (0.1.0 → 0.1.1)
fix: resolve memory leak in utility function

# Minor release (0.1.0 → 0.2.0)  
feat: add new TypeScript utility helpers

# Major release (0.1.0 → 1.0.0)
feat!: redesign plugin API structure
BREAKING CHANGE: Plugin interface has changed
```

### Commit Types
- `feat:` - New features (minor bump)
- `fix:` - Bug fixes (patch bump)
- `feat!:` or `BREAKING CHANGE:` - Breaking changes (major bump)
- `docs:`, `style:`, `refactor:`, `test:`, `chore:` - No version bump

## Release Process

### Prerequisites

1. **GitHub Secrets** - Configure in repository settings:
   - `NPM_ACCESS_TOKEN` - NPM access token with publish permissions
   - `NX_CLOUD_ACCESS_TOKEN` - Nx Cloud access token (optional)

2. **NPM Access Token Setup**:
   - Go to [npmjs.com](https://npmjs.com) → Account → Access Tokens
   - Create "Granular Access Token" with:
     - Read/write access to your packages
     - Read/write access to your organization
   - Add as `NPM_ACCESS_TOKEN` secret in GitHub

### Step-by-Step Release

#### 1. Prepare for Release
```bash
# Ensure main branch is up to date
git checkout main
git pull origin main

# Check what will be released (local)
pnpm dlx nx release --dry-run
```

#### 2. Trigger Release Preparation
1. Go to **GitHub Actions** tab
2. Select **"Prepare Release"** workflow
3. Click **"Run workflow"**
4. Choose options:
   - `dry-run: true` - Preview changes without making them
   - `dry-run: false` - Execute the actual release

#### 3. Review and Execute
1. **First run with `dry-run: true`** to preview:
   - Check version bump looks correct
   - Review changelog entries
   - Verify which packages will be released

2. **Run again with `dry-run: false`** to execute:
   - Creates version commit and git tag
   - Generates CHANGELOG.md
   - Creates GitHub release
   - Triggers automatic npm publishing

#### 4. Automatic Publishing
Once GitHub release is created, the **"Publish Packages"** workflow automatically:
- Builds all packages
- Publishes to npm with provenance
- Updates package status

## Configuration

### Nx Release Configuration (`nx.json`)
```json
{
  "release": {
    "projectsRelationship": "fixed",
    "projects": ["packages/**"],
    "releaseTagPattern": "v{version}",
    "git": {
      "commitMessage": "chore: release version {version} [no ci]"
    },
    "version": {
      "conventionalCommits": true,
      "preVersionCommand": "pnpm dlx nx run-many -t build --projects=tag:npm:public"
    },
    "changelog": {
      "workspaceChangelog": {
        "createRelease": "github",
        "file": "CHANGELOG.md"
      }
    }
  }
}
```

### Package Configuration
Each publishable package needs:
```json
{
  "publishConfig": {
    "access": "public"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/alexandr-bsu/space-architects.git",
    "directory": "packages/path/to/package"
  }
}
```

## Troubleshooting

### Common Issues

**1. "No changes detected"**
- Ensure you have conventional commits since last release
- Check that `fetch-depth: 0` is set in workflows
- Verify git tags exist for previous releases

**2. "Permission denied to push"**
- Check GitHub token permissions
- Ensure branch protection rules allow bot commits
- Verify PAT token has necessary scopes

**3. "npm publish failed"**
- Verify NPM_ACCESS_TOKEN is valid and has publish permissions
- Check package names don't conflict with existing packages
- Ensure all packages have correct `publishConfig`

### Manual Recovery

If something goes wrong, you can manually:
```bash
# Revert failed release commit
git reset --hard HEAD~1
git push --force-with-lease

# Delete failed tag
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0

# Start over with release preparation
```

## First Release Setup

For initial setup, run the first release locally:
```bash
# Set initial version and create first tag
pnpm dlx nx release --skip-publish --first-release
```

This creates the baseline for future automated releases.

## Monitoring

- **GitHub Actions**: Monitor workflow execution in the Actions tab
- **Nx Cloud**: View build cache and task distribution (if configured)
- **NPM**: Check package publishing status on npmjs.com
- **Releases**: View all releases in GitHub Releases section 