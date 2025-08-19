# Ripgrep (rg) - Lightning Fast Text Search

Ripgrep is a line-oriented search tool that recursively searches directories for a regex pattern. It's faster than grep, ag, ack, and respects .gitignore by default.

## Basic Usage

```bash
# Search for pattern
rg "pattern"

# Case insensitive
rg -i "pattern"

# Search specific file types
rg --type js "function"

# Search with context
rg -C 3 "error"  # 3 lines before and after
```

## Common Options

| Option | Description |
|--------|-------------|
| `-i` | Case insensitive search |
| `-v` | Invert match (show non-matching lines) |
| `-w` | Match whole words only |
| `-n` | Show line numbers |
| `-c` | Count matches per file |
| `-l` | Only show filenames with matches |
| `-L` | Only show filenames without matches |
| `-A NUM` | Show NUM lines after match |
| `-B NUM` | Show NUM lines before match |
| `-C NUM` | Show NUM lines before and after |

## File Type Filtering

```bash
# Search only JavaScript files
rg --type js "console.log"

# Search multiple types
rg --type js --type ts "import"

# Exclude file types
rg --type-not md "TODO"

# List available types
rg --type-list
```

## Pattern Matching

```bash
# Regex patterns
rg "user_\d+"  # user_123, user_456, etc.

# Fixed strings (no regex)
rg -F "user.email"

# Multiple patterns
rg -e "error" -e "warning" -e "critical"
```

## Including/Excluding Files

```bash
# Include hidden files
rg --hidden "pattern"

# Include files ignored by .gitignore
rg --no-ignore "pattern"

# Include everything
rg -uu "pattern"  # -u twice = --hidden --no-ignore

# Glob patterns
rg --glob "*.js" "pattern"
rg --glob "!*.test.js" "pattern"  # Exclude tests
```

## Output Control

```bash
# No filename headers
rg --no-heading "pattern"

# JSON output
rg --json "pattern"

# Only matching parts
rg -o "\w+@\w+\.\w+"  # Extract emails

# Replace text in output
rg "foo" --replace "bar"
```

## Performance Tips

### Parallel Search
```bash
# Use more threads
rg --threads 8 "pattern"

# Use all available cores
rg --threads 0 "pattern"
```

### Smart Case
```bash
# Case insensitive if pattern is lowercase
# Case sensitive if pattern has uppercase
rg --smart-case "pattern"
```

## Integration with Other Tools

### With FZF
```bash
# Interactive file search
rg --files | fzf --preview 'bat {}'

# Search content and preview
rg --line-number . | fzf --delimiter : --preview 'bat {1} -H {2}'
```

### With Vim
```bash
# Open files containing pattern
vim $(rg -l "pattern")

# Use as grepprg in vim
:set grepprg=rg\ --vimgrep
```

## Advanced Examples

### Search and Replace
```bash
# Dry run (show what would change)
rg "old_name" --files-with-matches | xargs sed -i.bak 's/old_name/new_name/g'

# With confirmation
rg -l "pattern" | xargs -I {} sh -c 'echo "Edit {}?" && read && vim {}'
```

### Complex Searches
```bash
# Find TODO comments with author
rg "TODO.*:" --type js -o | sort | uniq -c

# Find functions with specific parameter
rg "function.*userId" --type js -A 5

# Find imports from specific module
rg "^import.*from ['\""]react['\"]" --type js
```

## Configuration File

Create `~/.config/ripgrep/config`:
```
# Always use smart case
--smart-case

# Always show line numbers
--line-number

# Custom types
--type-add=web:*.{html,css,js,jsx,ts,tsx}

# Global ignores
--glob=!.git/*
--glob=!node_modules/*
```

Set environment variable:
```bash
export RIPGREP_CONFIG_PATH="$HOME/.config/ripgrep/config"
```

## Aliases in Sigao

Sigao automatically aliases `grep` to `rg` when available.

## See Also

- `sigao help fzf` - Combine with fuzzy finder
- `sigao help fd` - Fast file finder
- `sigao help bat` - Syntax highlighting for results
- Official guide: https://github.com/BurntSushi/ripgrep/blob/master/GUIDE.md