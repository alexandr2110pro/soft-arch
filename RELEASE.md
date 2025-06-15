# Release Process

## Overview

- ✅ **Manual releases** - Triggered via GitHub Actions, never automatic
- ✅ **Unified versioning** - All packages share the same version  
- ✅ **Conventional commits** - Automatic version bumping based on commit messages
- ✅ **GitHub releases** - Created automatically with changelog
- ✅ **npm publishing** - Automatic publishing to npmjs.org

## Quick Release

1. **Go to GitHub Actions** → "Prepare Release"
2. **Set `dry-run: false`** 
3. **Click "Run workflow"**

That's it! The system will:
- Analyze commits since last release
- Determine version bump (patch/minor/major)
- Update CHANGELOG.md
- Create GitHub release
- Publish packages to npm

## Conventional Commits

Use these prefixes for automatic version bumping:

- `feat:` → **minor** bump (0.1.0 → 0.2.0)
- `fix:` → **patch** bump (0.1.0 → 0.1.1)  
- `feat!:` or `BREAKING CHANGE:` → **major** bump (0.1.0 → 1.0.0)

Examples:
```bash
git commit -m "feat: add new utility function"
git commit -m "fix: handle edge case in parser"
git commit -m "feat!: remove deprecated API"
```

## Local Development

```bash
# Start local registry (auto-configured)
nx local-registry

# Test release locally (no publishing)
nx release --dry-run

# Test publishing to local registry
nx release publish --registry=http://localhost:4873
```

## Registry Configuration

- **Local development**: `http://localhost:4873` (Verdaccio, managed by Nx)
- **CI/Production**: `https://registry.npmjs.org` (npm registry)

The system automatically uses the correct registry based on environment. 