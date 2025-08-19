# eza - A Modern Replacement for ls

eza is a modern replacement for ls with colors, icons, and more features.

## Basic Usage

```bash
# List files
eza

# List with details (like ls -l)
eza -l

# List all files including hidden
eza -a

# List with icons
eza --icons

# Tree view
eza --tree
```

## Common Options

| Option | Description |
|--------|-------------|
| `-a, --all` | Show hidden files |
| `-l, --long` | Display extended details |
| `-h, --header` | Add a header row |
| `-R, --recurse` | Recurse into directories |
| `--icons` | Display icons |
| `--tree` | Display as tree |
| `-L, --level` | Limit tree depth |
| `-s, --sort` | Sort by field |
| `-r, --reverse` | Reverse sort order |
| `-g, --group` | Show group ownership |

## Sorting Options

```bash
# Sort by size
eza -s size

# Sort by modified time
eza -s modified

# Sort by name (default)
eza -s name

# Sort by type
eza -s type

# Reverse order
eza -s size -r
```

## Display Modes

### Long Format
```bash
# Basic long format
eza -l

# With header
eza -lh

# With git status
eza -l --git

# Without permissions
eza -l --no-permissions
```

### Tree View
```bash
# Tree view
eza --tree

# Limited depth
eza --tree -L 2

# Tree with details
eza --tree -l

# Tree with icons
eza --tree --icons
```

## Filtering

```bash
# Only directories
eza -D

# Only files
eza -f

# Ignore glob patterns
eza -I "*.log|node_modules"

# Git ignore
eza --git-ignore
```

## Color and Style

```bash
# Always use colors
eza --color=always

# Never use colors
eza --color=never

# Custom time format
eza -l --time-style=long-iso
```

## Git Integration

```bash
# Show git status
eza -l --git

# Legend:
# N = New file
# M = Modified
# I = Ignored
```

## Extended Attributes

```bash
# Show extended attributes
eza -l@

# Show file headers
eza -lh

# Show blocks
eza -lb
```

## Aliases in Sigao

Sigao sets up these aliases:
- `ls` → `eza --icons`
- `ll` → `eza -la --icons`
- `la` → `eza -a --icons`
- `lt` → `eza --tree --icons`

## Common Use Cases

### Project Overview
```bash
# See project structure
lt -L 2 -I "node_modules|.git"

# List with git status
ll --git
```

### Find Large Files
```bash
# Sort by size, largest first
eza -l -s size -r

# Only show files over 1MB
eza -l | awk '$5 ~ /M|G/'
```

### Recent Files
```bash
# Sort by modified time
eza -l -s modified -r

# Today's files
eza -l --changed-within=1d
```

## Configuration

eza respects these environment variables:
```bash
# Default options
export EZA_COLORS="di=34:ex=32"

# Icon settings
export EZA_ICONS_AUTO=true
```

## Tips & Tricks

1. **Quick tree**: `lt` shows tree with icons
2. **All details**: `ll` shows all files with details
3. **Git awareness**: Use `--git` to see file status
4. **Performance**: Use `--git-ignore` in large repos
5. **Piping**: Use `--color=always` when piping to `less`

## Comparison with ls

| ls command | eza equivalent |
|------------|----------------|
| `ls -la` | `eza -la` |
| `ls -lh` | `eza -lh` |
| `ls -lt` | `eza -l -s modified` |
| `ls -lS` | `eza -l -s size` |
| `ls -R` | `eza -R` or `eza --tree` |

## See Also

- `sigao help bat` - Better file viewing
- `sigao help fd` - Better file finding
- `sigao help ripgrep` - Fast file searching
- Official docs: https://eza.rocks/