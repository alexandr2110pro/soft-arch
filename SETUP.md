# Development Setup

## Prerequisites

- Node.js 18+
- pnpm
- Git

## Quick Start

```bash
# Clone and install
git clone <repo-url>
cd space-arch
pnpm install

# Start local registry for testing packages
nx local-registry

# Test a release locally
nx release --dry-run
```

## Publishing Setup (CI/CD)

### GitHub Secrets Required

Add these secrets in GitHub Settings → Secrets → Actions:

1. **`NPM_ACCESS_TOKEN`**
   - Create at [npmjs.com](https://npmjs.com) → Account Settings → Access Tokens
   - Grant read/write access to `@space-arch/*` packages

### Package Configuration

Each publishable package needs:

```json
{
  "name": "@space-arch/package-name",
  "version": "0.0.1", 
  "files": ["dist"],
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts"
}
```

## Local Testing

```bash
# Test package builds
nx run-many -t build --projects=tag:npm:public

# Test release (no publishing)
nx release --dry-run

# Publish to local registry
nx release publish --registry=http://localhost:4873
```

## First Release

1. Go to GitHub Actions → "Prepare Release" 
2. Set `dry-run: false`
3. Run workflow

Done! 🚀 