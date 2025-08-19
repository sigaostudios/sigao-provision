# bat - A cat Clone with Wings

bat is a cat replacement with syntax highlighting, Git integration, and automatic paging.

## Basic Usage

```bash
# View file with syntax highlighting
bat file.py

# View multiple files
bat file1.js file2.js

# Pipe content
echo "hello world" | bat

# View with specific language
bat --language=json data.txt
```

## Key Features

### Syntax Highlighting
- Automatic language detection
- Over 150 supported languages
- Customizable themes

### Git Integration
Shows git modifications in the margin:
- `+` for added lines
- `~` for modified lines
- `-` for removed lines

### Automatic Paging
- Uses less for long files
- Seamless scrolling
- Search within pager with `/`

## Common Options

| Option | Description |
|--------|-------------|
| `-n` | Show line numbers |
| `-p` | Plain output (no decorations) |
| `-A` | Show non-printable characters |
| `-r N:M` | Show lines N through M |
| `--style` | Control output style |
| `--theme` | Set color theme |

## Style Options

```bash
# Full style (default)
bat file.py

# Just line numbers
bat --style=numbers file.py

# Plain with line numbers
bat --style=plain,numbers file.py

# Everything
bat --style=full file.py
```

Style components:
- `numbers`: Line numbers
- `changes`: Git changes
- `header`: File header
- `grid`: Grid borders
- `rule`: Horizontal rules

## Themes

```bash
# List available themes
bat --list-themes

# Use specific theme
bat --theme=TwoDark file.py

# Popular themes
bat --theme=Monokai file.py
bat --theme=GitHub file.py
bat --theme=Nord file.py
```

## Integration Examples

### With ripgrep
```bash
# Search and highlight
rg "pattern" --line-number | bat

# Show files with matches
rg -l "TODO" | xargs bat
```

### With find/fd
```bash
# View all Python files
fd -e py | xargs bat

# Preview with fzf
fd -e js | fzf --preview 'bat --color=always {}'
```

### As Pager
```bash
# Use bat as man pager
export MANPAGER="sh -c 'col -bx | bat -l man -p'"

# Use for --help
alias -g -- --help='--help 2>&1 | bat --language=help --style=plain'
```

## Configuration

Create `~/.config/bat/config`:
```
# Set theme
--theme="TwoDark"

# Always show line numbers
--style="numbers,changes,header"

# Custom pager
--pager="less -FR"
```

## Advanced Usage

### Highlighting Specific Lines
```bash
# Highlight line 42
bat --highlight-line=42 file.py

# Highlight range
bat --highlight-line=10:20 file.py

# Multiple highlights
bat -H 5 -H 10:15 file.py
```

### Showing Diffs
```bash
# Compare files
diff -u file1 file2 | bat --language=diff

# Git diff
git diff | bat --language=diff
```

### Custom Language Mapping
```bash
# Treat .conf as ini
bat --map-syntax="*.conf:ini" config.conf

# Multiple mappings
bat --map-syntax="*.conf:ini" --map-syntax="Dockerfile*:Docker" files...
```

## Tips & Tricks

1. **Disable paging**: `bat --paging=never` or use `-p`
2. **Force colors**: `bat --color=always` (useful in pipes)
3. **Line ranges**: `bat -r 10:20 file` shows lines 10-20
4. **Tab width**: `bat --tabs=2` for 2-space tabs
5. **Binary files**: bat automatically detects and shows warning

## Environment Variables

```bash
# Default options
export BAT_THEME="TwoDark"
export BAT_STYLE="numbers,changes"
export BAT_PAGER="less -RF"
```

## Aliases in Sigao

Sigao automatically aliases `cat` to `bat` when available.

## Common Patterns

```bash
# Pretty print JSON
curl api.example.com/data | jq | bat --language=json

# View CSV with grid
bat --style=grid data.csv

# Quick file preview
alias preview='bat --style=numbers --color=always'
```

## See Also

- `sigao help ripgrep` - Use with search
- `sigao help fzf` - File preview integration
- `sigao help eza` - Directory listings
- Official repo: https://github.com/sharkdp/bat