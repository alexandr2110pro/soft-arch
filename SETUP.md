# Release System Setup Instructions

This guide will help you configure the automated release system for production use.

## Required GitHub Secrets

Configure these secrets in your GitHub repository settings:

### 1. NPM_ACCESS_TOKEN

**Purpose**: Allows GitHub Actions to publish packages to npm

**Setup Steps**:
1. Go to [npmjs.com](https://npmjs.com) and log in
2. Navigate to **Account Settings** → **Access Tokens**
3. Click **"Generate New Token"** → **"Granular Access Token"**
4. Configure the token:
   - **Expiration**: Set appropriate expiration (recommend 1 year)
   - **Scope**: Select your organization if publishing under an org scope
   - **Packages**: Grant **Read/Write** access to:
     - `@space-architects/util-ts`
     - `@space-architects/nx-plugin-std`
     - Any other packages you plan to publish
5. Copy the generated token
6. In GitHub repository: **Settings** → **Secrets and Variables** → **Actions**
7. Add **Repository Secret**: `NPM_ACCESS_TOKEN` = `your_token_here`

### 2. NX_CLOUD_ACCESS_TOKEN (Optional)

**Purpose**: Enables Nx Cloud features for faster builds

**Setup Steps**:
1. Go to [nx.app](https://nx.app) and connect your repository
2. Copy your access token from the workspace settings
3. Add as repository secret: `NX_CLOUD_ACCESS_TOKEN` = `your_token_here`

## Repository Configuration

### Branch Protection Rules

Configure branch protection for `main`:

1. **Settings** → **Branches** → **Add rule**
2. Branch name pattern: `main`
3. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
     - Add status check: `main` (from CI workflow)
   - ✅ Require branches to be up to date before merging
   - ✅ Restrict pushes that create files larger than 100MB

### Repository Settings

1. **General** → **Pull Requests**:
   - ✅ Allow merge commits
   - ✅ Allow squash merging
   - ✅ Allow rebase merging
   - ✅ Always suggest updating pull request branches
   - ✅ Automatically delete head branches

## First Release

After setting up secrets, create your first release:

### Option A: Automated First Release
1. Push this commit to main
2. Go to **Actions** → **"Prepare Release"**
3. Click **"Run workflow"**
4. Set `dry-run: false` and run
5. This will create v0.1.0 and establish the baseline

### Option B: Manual First Release
```bash
# Run locally to create initial release
pnpm dlx nx release --skip-publish --first-release

# Push the changes
git push --follow-tags
```

## Testing the System

### Test Release (Dry Run)
1. Make a commit with conventional format:
   ```bash
   git commit -m "feat: add new feature for testing"
   ```
2. Go to **Actions** → **"Prepare Release"**
3. Run with `dry-run: true`
4. Review the output to ensure it detects changes correctly

### Test Publishing (Local Registry)
Use the included Verdaccio local registry for testing:
```bash
# Start local registry
pnpm dlx nx local-registry

# In another terminal, test publishing
pnpm dlx nx release publish --registry=http://localhost:4873
```

## Monitoring

After setup, monitor these areas:

- **GitHub Actions**: Check workflow runs in Actions tab
- **GitHub Releases**: Verify releases are created correctly
- **NPM**: Check packages appear on npmjs.com
- **Changelog**: Verify CHANGELOG.md is generated properly

## Conventional Commits

Ensure your team uses conventional commit format:

```bash
# Setup git hooks for commit message validation
npm install --save-dev @commitlint/config-conventional @commitlint/cli
echo "export default {extends: ['@commitlint/config-conventional']};" > commitlint.config.js

# Install husky for git hooks
npm install --save-dev husky
npx husky init
echo "npx --no-install commitlint --edit \$1" > .husky/commit-msg
```

## Troubleshooting

### Common Setup Issues

**1. NPM Token Errors**
- Ensure token has correct scopes and hasn't expired
- Verify organization access if using scoped packages
- Check token format (should start with `npm_`)

**2. GitHub Token Permissions**
- Default `GITHUB_TOKEN` has sufficient permissions for most operations
- For advanced scenarios, create a Personal Access Token

**3. Build Failures**
- Ensure all packages can be built successfully: `pnpm dlx nx run-many -t build`
- Check TypeScript compilation errors
- Verify dependencies are correctly declared

**4. First Release Issues**
- If no tags exist, use `--first-release` flag
- Ensure conventional commits exist since last tag
- Check git history is available (not shallow clone)

## Next Steps

Once setup is complete:

1. ✅ Test with a dry-run release
2. ✅ Create your first production release
3. ✅ Train team on conventional commit format
4. ✅ Document your specific release workflow
5. ✅ Set up monitoring and notifications as needed

The system is now ready for production use! 🚀 