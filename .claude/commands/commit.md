Analyze the staged git changes thoroughly and then commit them.

## Rules

- Use conventional commit format: `type(scope): description`
- Scopes: `util-ts`, `util-enum`, `util-drizzle`, `nx-plugin-std`, `docs`, `ci`, `config`
- If changes span multiple packages, use the most significant scope or omit scope
- Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `build`, `ci`, `style`, `revert`
- `chore:` does NOT trigger a release; all other types do
- `feat` -> minor bump, everything else -> patch, `feat!` or `BREAKING CHANGE` footer -> major bump
- Keep subject line under 72 characters
- Use imperative mood ("add" not "added")
- The message body should be concise but informative. Focus on the *why*, not the *what*.

NEVER MENTION THAT THE COMMIT IS CO-AUTHORED BY CLAUDE.
TEXT LIKE THE FOLLOWING IS STRICTLY FORBIDDEN:
```
Co-Authored-By: Claude <noreply@anthropic.com>
```
