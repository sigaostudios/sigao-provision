# fd - Fast and User-Friendly Alternative to find

fd is a simple, fast, and user-friendly alternative to the traditional `find` command.

## Basic Usage

```bash
# Find files by name
fd pattern

# Find in specific directory
fd pattern /path/to/dir

# Case-insensitive search
fd -i pattern

# Find by extension
fd -e py
fd -e js -e jsx
```

## Common Options

| Option | Description |
|--------|-------------|
| `-H` | Include hidden files |
| `-I` | Include ignored files |
| `-i` | Case-insensitive |
| `-e EXT` | Filter by extension |
| `-t TYPE` | Filter by type (f/d/l/x) |
| `-d DEPTH` | Max search depth |
| `-x CMD` | Execute command |
| `-E PATTERN` | Exclude pattern |

## File Type Filters

```bash
# Files only
fd -t f pattern

# Directories only
fd -t d pattern

# Executable files
fd -t x pattern

# Symbolic links
fd -t l pattern

# Empty files/dirs
fd -t e pattern
```

## Pattern Matching

```bash
# Simple patterns
fd test              # Files containing "test"
fd '^test'           # Files starting with "test"
fd 'test$'           # Files ending with "test"

# Regex patterns
fd '^src/.*\.js$'    # JS files in src

# Glob patterns
fd -g '*.py'         # All Python files
fd -g '**/test/*.js' # Test JS files
```

## Including/Excluding

```bash
# Include hidden files
fd -H pattern

# Include gitignored files
fd -I pattern

# Include everything (hidden + ignored)
fd -HI pattern

# Exclude patterns
fd -E node_modules -E .git pattern
fd -E '*.log' pattern
```

## Executing Commands

```bash
# Execute command on results
fd -e py -x python {}

# With placeholder
fd -e jpg -x convert {} {.}.png

# Parallel execution
fd -e py -X python
```

### Placeholders
- `{}` - Full path
- `{.}` - Path without extension
- `{/}` - Basename
- `{//}` - Parent directory
- `{/.}` - Basename without extension

## Integration Examples

### With fzf
```bash
# Interactive file selection
fd -t f | fzf

# With preview
fd -t f | fzf --preview 'bat {}'

# Open in editor
vim $(fd -t f | fzf)
```

### With ripgrep
```bash
# Search in specific files
fd -e rs | xargs rg 'pattern'

# Search and edit
fd -e py | xargs rg -l 'TODO' | xargs vim
```

### File Operations
```bash
# Delete all .log files
fd -e log -X rm

# Copy files to directory
fd -e pdf -x cp {} ~/Documents/PDFs/

# Rename files
fd -e jpeg -x mv {} {.}.jpg
```

## Advanced Examples

### Size Filters
```bash
# Files larger than 1MB
fd -S +1M

# Files smaller than 100KB
fd -S -100k

# Files between 1MB and 10MB
fd -S +1M -S -10M
```

### Time Filters
```bash
# Modified in last 24 hours
fd --changed-within 24h

# Modified more than 30 days ago
fd --changed-before 30d

# Specific date
fd --changed-after 2024-01-01
```

### Complex Searches
```bash
# Python files, not in venv, modified recently
fd -e py -E '*venv*' --changed-within 7d

# Large images
fd -e jpg -e png -S +5M

# Empty directories
fd -t d -e
```

## Performance Tips

1. **Use specific paths**: `fd pattern src/` is faster than `fd pattern`
2. **Limit depth**: `fd -d 3 pattern` for shallow searches
3. **Use type filters**: `-t f` avoids checking directories
4. **Exclude early**: `-E` patterns are checked first

## Configuration

Create `~/.config/fd/ignore` for global ignores:
```
node_modules/
.git/
*.log
*.tmp
```

## Aliases in Sigao

Sigao automatically aliases `find` to `fd` when available.

## Common Patterns

```bash
# Clean build artifacts
fd -e pyc -e pyo -X rm
fd -t d -name __pycache__ -X rm -rf

# Find broken symlinks
fd -t l -x test -e {} ';' echo {}

# List project directories
fd -t d -d 2 .git ~/dev --exec dirname
```

## See Also

- `sigao help ripgrep` - Fast text search
- `sigao help fzf` - Interactive filtering
- `sigao help bat` - File viewing
- Official repo: https://github.com/sharkdp/fd