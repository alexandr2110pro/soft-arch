---
description: Write, modify, and fix Justfiles with correct syntax
allowed-tools: Read, Glob, Grep, Edit, Write, Bash(just *), Bash(which just)
---

## Request

$ARGUMENTS

## Instructions

You are an expert in `just`, the command runner. Your goal is to write correct, clean, professional Justfiles. Use the reference section below as your single source of truth for syntax -- do not guess or hallucinate syntax.

### Phase 1: Discover

1. **Find existing Justfiles.** Use Glob to search for `Justfile`, `justfile`, `.justfile`, and `*.just` in the project root and common locations.
2. **Read existing Justfiles.** If found, read them fully. Understand the current recipes, settings, variables, and style (tabs vs spaces, quiet vs verbose, shebang vs line-by-line).
3. **Understand the project context.** Check CLAUDE.md and package.json to understand what tooling the project uses so recipes reference the correct commands.

### Phase 2: Plan

1. **Interpret the request.** Determine whether the user wants to:
   - Create a new Justfile from scratch
   - Add recipes to an existing Justfile
   - Modify or fix existing recipes
   - Review a Justfile for correctness
2. **Match existing style.** If a Justfile exists, match its conventions: indentation style, use of `@` prefixes, shebang vs line-by-line recipes, comment style, grouping.
3. **Design the recipes.** For each recipe, decide:
   - Parameters and their types (required, default, variadic, exported)
   - Dependencies (prior and subsequent)
   - Attributes needed (`[group]`, `[confirm]`, `[private]`, etc.)
   - Whether it needs shebang (multi-line logic) or line-by-line execution

### Phase 3: Execute

Write or modify the Justfile. Follow these quality rules:

- **Indentation**: Use 4 spaces unless the existing file uses a different convention. Never mix tabs and spaces.
- **Comments**: Add a `# comment` above each recipe explaining what it does (these show up in `just --list`).
- **Grouping**: Use `[group('name')]` to organize related recipes when there are 5+ recipes.
- **Quiet by default**: Prefer `@` prefix on echo-heavy lines, or use `set quiet` if most recipes should be quiet.
- **Shebang recipes**: Use `#!/usr/bin/env bash` + `set -euo pipefail` for any recipe with conditionals, loops, or variable assignments across lines.
- **Dependencies**: Use dependency syntax (`recipe: dep1 dep2`) rather than calling `just dep1` inside recipe bodies.
- **Error handling**: Use `-` prefix on lines where failure is acceptable. Use `[confirm]` for destructive operations.
- **Private helpers**: Prefix with `_` and add `[private]` for internal-only recipes.

### Phase 4: Verify

1. **Check if `just` is installed** by running `which just`.
2. **If installed**, run `just --fmt --check --unstable` to verify formatting (or `just --fmt --unstable` to auto-format if the user requests it).
3. **If installed**, run `just --summary` to confirm all recipes parse correctly.
4. **If not installed**, manually review the output against the reference below for correctness.

Report what was created or changed, listing each recipe with a one-line description.

---

## Just Syntax Reference

Use this section as the authoritative reference. Do not invent syntax not documented here.

### Recipe Definition

```just
# Comment shown in `just --list`
[attributes]
@recipe-name param $EXPORTED_PARAM param_with_default="val" +variadic_one_or_more *variadic_zero_or_more: dependency1 dependency2 && subsequent_dep
    command {{param}}
```

| Element | Syntax | Notes |
|---|---|---|
| Recipe | `name:` | Lowercase kebab-case by convention |
| Parameter | `name` | Required positional arg |
| Default param | `name="value"` | Uses `=`, value is a Just expression |
| Variadic 1+ | `+name` | Must be last param; one or more args |
| Variadic 0+ | `*name` | Must be last param; zero or more args |
| Export param as env | `$NAME` | Available as `$NAME` in shell |
| Dependency | `recipe: dep1 dep2` | Run before recipe |
| Dep with args | `recipe: (dep "arg1" variable)` | Parens required |
| Subsequent dep | `recipe: prior && after` | `after` runs only if recipe succeeds |
| Quiet recipe | `@recipe:` | Suppress command echo for all lines |
| Quiet line | `    @command` | Suppress echo for one line |
| Ignore error | `    -command` | Continue on failure |
| Combine | `    -@command` or `    @-command` | Both prefixes |

### Line Execution Model

**Each recipe line runs in a fresh shell.** This means:

```just
# WRONG -- cd is lost on next line
build:
    cd src
    make          # runs in original dir, NOT src/

# RIGHT -- single line
build:
    cd src && make

# RIGHT -- line continuation
build:
    cd src && \
        make

# RIGHT -- shebang (whole body = one script)
build:
    #!/usr/bin/env bash
    set -euo pipefail
    cd src
    make
```

### Attributes

Place `[attr]` on the line(s) before the recipe. Multiple can be comma-separated or stacked.

| Attribute | Effect |
|---|---|
| `[private]` | Hide from `just --list` |
| `[no-cd]` | Run in caller's directory, not justfile's |
| `[no-exit-message]` | Suppress error message on failure |
| `[confirm]` | Prompt "Run recipe?" before executing |
| `[confirm("Custom prompt?")]` | Custom confirmation prompt |
| `[group('name')]` | Group in `just --list` output |
| `[doc('text')]` | Override comment for `--list` display |
| `[linux]` | Only run on Linux |
| `[macos]` | Only run on macOS |
| `[windows]` | Only run on Windows |
| `[unix]` | Only run on Linux/macOS/BSDs |
| `[script]` | Run body as single script (like shebang) |
| `[script('interpreter')]` | Run body with specified interpreter |
| `[positional-arguments]` | Pass params as `$1`, `$2`, etc. |
| `[working-directory('path')]` | Set working directory for recipe |
| `[no-quiet]` | Override `set quiet` for this recipe |
| `[default]` | Module's default recipe |
| `[parallel]` | Run dependencies in parallel |
| `[env('KEY', 'VALUE')]` | Set environment variable |

Combine: `[private, group('helpers'), no-cd]`

### Variables & Expressions

```just
# Assignment
version := "1.0.0"
export DB_URL := "postgres://localhost/dev"

# Backtick evaluation (runs at parse time)
git_hash := `git rev-parse --short HEAD`

# Concatenation (+) and path join (/)
output := "build" / "release" / "app-" + version

# Conditional
profile := if env("CI", "") != "" { "release" } else { "debug" }

# Regex match
greeting := if "hello" =~ 'hel+o' { "matched" } else { "no match" }
```

**Interpolation in recipe bodies:** `{{variable_name}}` or `{{expression}}`
**Shell variables in recipe bodies:** `$VAR` or `${VAR}` (these are shell, not just)

Do NOT confuse `{{just_var}}` with `$shell_var`.

### String Types

| Syntax | Name | Behavior |
|---|---|---|
| `'text'` | Single-quoted | Literal, no escapes |
| `"text"` | Double-quoted | Supports `\"`, `\\`, `\n`, `\t`, `\u{hex}` |
| `'''...'''` | Indented single | Literal, leading whitespace stripped |
| `"""..."""` | Indented double | Escapes, leading whitespace stripped |
| `` `cmd` `` | Backtick | Execute shell command, capture stdout |
| `x'text'` | Shell-expanded | `$VAR`, `${VAR}`, `~` expanded |
| `f'text'` | Format string | `{{expr}}` interpolated |

### Settings

Place at top of Justfile. Boolean settings default to `true` when no value given.

```just
set shell := ["bash", "-uc"]
set dotenv-load                         # Load .env file
set dotenv-filename := ".env.local"     # Custom .env filename
set dotenv-path := "/path/to/.env"      # Absolute path to .env
set dotenv-required                     # Error if .env missing
set dotenv-override                     # .env overrides existing env vars
set export                              # Export all vars as env vars
set positional-arguments                # Pass params as $1, $2...
set quiet                               # Suppress command echo globally
set fallback                            # Fall back to parent justfile
set ignore-comments                     # Don't pass comments to shell
set tempdir := "/tmp"                   # Temp directory for scripts
set working-directory := "src"          # Default working directory
set unstable                            # Enable unstable features
set allow-duplicate-recipes             # Last definition wins
set allow-duplicate-variables           # Last assignment wins
set windows-shell := ["powershell.exe", "-NoLogo", "-Command"]
```

### Built-in Functions

| Category | Functions |
|---|---|
| **System** | `arch()`, `os()`, `os_family()`, `num_cpus()` |
| **Env** | `env("KEY")`, `env("KEY", "default")` |
| **Paths** | `justfile()`, `justfile_directory()`, `invocation_directory()`, `source_file()`, `source_directory()`, `home_directory()` |
| **Path ops** | `absolute_path(p)`, `canonicalize(p)`, `join(a, b)`, `parent_directory(p)`, `file_name(p)`, `file_stem(p)`, `extension(p)`, `without_extension(p)`, `clean(p)` |
| **Path tests** | `path_exists(p)` |
| **Strings** | `replace(s, from, to)`, `replace_regex(s, regex, to)`, `trim(s)`, `trim_start(s)`, `trim_end(s)`, `trim_start_match(s, pat)`, `trim_end_match(s, pat)` |
| **String case** | `uppercase(s)`, `lowercase(s)`, `capitalize(s)`, `snakecase(s)`, `kebabcase(s)`, `titlecase(s)`, `uppercamelcase(s)`, `lowercamelcase(s)`, `shoutysnakecase(s)` |
| **String util** | `quote(s)`, `append(suffix, s)`, `prepend(prefix, s)`, `encode_uri_component(s)` |
| **Crypto/ID** | `sha256(s)`, `sha256_file(p)`, `blake3(s)`, `blake3_file(p)`, `uuid()` |
| **DateTime** | `datetime(fmt)`, `datetime_utc(fmt)` (strftime format) |
| **Control** | `error(msg)`, `require(name)` (find executable or error) |
| **File I/O** | `read(path)` |
| **Shell** | `shell(cmd, args...)` |
| **Random** | `choose(n, alphabet)` |
| **Semver** | `semver_matches(version, requirement)` |

### Imports & Modules

```just
# Import: inline another justfile's contents
import 'ci.just'
import? 'local.just'          # Optional (no error if missing)

# Module: namespaced recipes
mod deploy                     # loads deploy.just or deploy/mod.just
mod deploy 'ops/deploy.just'   # explicit path
mod? optional_mod              # optional module
```

Invoke module recipes: `just deploy::production`

### Shebang & Script Recipes

```just
# Bash (recommended pattern)
script-recipe:
    #!/usr/bin/env bash
    set -euo pipefail
    if [[ -f "config.json" ]]; then
        echo "Config found"
    fi

# Python
[script('python3')]
analyze:
    import json
    data = json.load(open("data.json"))
    print(f"Records: {len(data)}")

# Node.js
[script('node')]
check:
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('package.json'));
    console.log(`Version: ${pkg.version}`);
```

### Common Patterns

```just
# Default recipe (runs when just is called with no arguments)
[default]
help:
    @just --list

# Alias
alias b := build

# Private helper
[private]
_ensure-tools:
    @which node > /dev/null || (echo "node required" && exit 1)

# Confirm before destructive action
[confirm("Delete all build artifacts?")]
clean:
    rm -rf dist build target

# Dotenv loading
set dotenv-load

start:
    echo "Starting with DB=$DATABASE_URL"

# Conditional per OS
[linux]
open path:
    xdg-open {{path}}

[macos]
open path:
    open {{path}}

# Parallel dependencies
[parallel]
all: build lint test
```

### Constants

| Constant | Value |
|---|---|
| `HEX` | `0123456789abcdef` |
| `HEXUPPER` | `0123456789ABCDEF` |
| `PATH_SEP` | `/` (Unix) or `\` (Windows) |
| `PATH_VAR_SEP` | `:` (Unix) or `;` (Windows) |
| ANSI: | `BOLD`, `NORMAL`, `RED`, `GREEN`, `YELLOW`, `BLUE`, `CYAN`, `CLEAR`, etc. |

### Gotchas Checklist

1. **Fresh shell per line** -- use shebang or `&&` / `\` for multi-line logic
2. **`{{var}}` vs `$var`** -- `{{}}` is just interpolation (resolved before shell); `$` is shell
3. **Indentation** -- must be consistent (all spaces OR all tabs), never mixed
4. **Path `/` operator** -- `"foo/" / "bar"` produces `"foo//bar"` (trailing slash preserved)
5. **Backticks run at parse time** -- not at recipe execution time
6. **`set shell` affects recipes** -- but NOT backtick expressions (those always use default shell)
7. **Parameters shadow variables** -- a param named `x` hides any variable `x`
8. **`export` + `set export`** -- `export x := "v"` exports one var; `set export` exports ALL
