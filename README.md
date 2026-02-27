# Space Architects Open Source

A monorepo for Space Architects Open Source projects.

## Structure

- `packages/util/ts` - TypeScript utility functions and types
- `packages/nx/plugin/std` - Standard Nx plugin extensions

## Development

```bash
# Install dependencies
pnpm install

# Start local registry for testing
nx local-registry

# Run tests
nx run-many -t test

# Build all packages
nx run-many -t build --projects=tag:npm:public
```

## Publishing

Packages are published automatically via GitHub Actions using conventional commits for versioning.

See [RELEASE.md](./RELEASE.md) for release process.