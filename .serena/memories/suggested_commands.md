# Suggested Commands: space-architects

## Daily Development

```bash
# Install dependencies
pnpm install

# Run affected tasks (CI-like check)
nx affected -t lint test build

# Run all tests
nx run-many -t test

# Run tests for a specific package
nx run <project-name>:test

# Lint all projects
nx run-many -t lint

# Lint specific project
nx run <project-name>:lint

# TypeScript type checking
nx run-many -t typecheck
nx run <project-name>:typecheck

# Build
nx run-many -t build
nx run-many -t build --projects=tag:npm:public  # Only public packages
nx run <project-name>:build
```

## Local Registry (Testing Releases)

```bash
# Start Verdaccio local registry (port 4873)
nx local-registry

# In another terminal, publish to local registry
nx release publish --registry=http://localhost:4873
```

## Release

```bash
# Dry-run release to preview changes
nx release --dry-run

# Actual release (usually done via GitHub Actions)
nx release
```

## Utilities

```bash
# Check Nx project graph
nx graph

# View project details
nx show project <project-name>

# Clear Nx cache
nx reset
```

## Package Manager

```bash
# Add root dependency
pnpm add -D <package> -w

# Add dependency to specific package
pnpm add <package> --filter <project-name>
```
