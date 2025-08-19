# Glow - Markdown Renderer for Terminal

Glow is a terminal-based markdown reader designed from the ground up to bring out the beauty and power of the command line.

## Basic Usage

```bash
# Read a file
glow README.md

# Read from stdin
echo "# Hello" | glow -

# Page through file (like less)
glow -p README.md

# Read from URL
glow https://raw.githubusercontent.com/charmbracelet/glow/master/README.md
```

## Display Modes

### Pager Mode (Default for Files)
```bash
glow -p file.md
# or just
glow file.md
```

Navigation in pager:
- `j/k` or `↓/↑` - Scroll line by line
- `d/u` - Scroll half page down/up
- `f/b` or `Space/Backspace` - Page down/up
- `g/G` - Go to top/bottom
- `/` - Search forward
- `?` - Search backward
- `n/N` - Next/previous search result
- `q` - Quit

### Glamour Rendering
```bash
# Force glamour rendering (no pager)
glow -s dark README.md
```

## Styling Options

### Color Schemes
```bash
# Dark mode (default)
glow -s dark file.md

# Light mode
glow -s light file.md

# No colors
glow -s notty file.md

# Custom style
glow -s dracula file.md
```

### Width Control
```bash
# Set width
glow -w 80 file.md

# Use terminal width
glow -w 0 file.md
```

## Working with Multiple Files

```bash
# View multiple files
glow README.md CONTRIBUTING.md

# All markdown files
glow *.md

# Recursive search
glow --all
```

## Configuration

Config file: `~/.config/glow/glow.yml`

```yaml
# Glow config
local:
  # Show local files only
  mouse: true
  pager: true
  width: 80

# Style
style: "dark"
```

## Environment Variables

```bash
# Set default style
export GLOW_STYLE="light"

# Set default width
export GLOW_WIDTH="100"

# Disable mouse
export GLOW_ENABLE_MOUSE="false"
```

## Integration with Sigao

Sigao uses glow for:
- `sigao help` - Display help pages
- `sigao cheat` - Show cheatsheets
- Shell functions `cheat()` and `cheat-utils()`

## Common Use Cases

### Documentation Browser
```bash
# Browse all docs
glow --all

# Search in docs
glow --all | grep -i "install"
```

### Note Taking
```bash
# Quick preview while editing
vim notes.md
# In another terminal:
glow -p notes.md
```

### Code Documentation
```bash
# View project docs
glow README.md CONTRIBUTING.md docs/*.md
```

### Piping Output
```bash
# Pretty print markdown from command
echo "# System Info\n\n$(uname -a)" | glow -

# Format JSON as markdown table
cat data.json | jq -r '.[] | "| \(.name) | \(.value) |"' | glow -
```

## Tips & Tricks

1. **Mouse Support**: Click links, scroll with mouse wheel
2. **Search**: Use `/` to search in pager mode
3. **Style Preview**: `glow --list-styles` (if available)
4. **Quick Exit**: Press `q` in pager mode

## Comparison with Other Tools

| Feature | glow | bat | less |
|---------|------|-----|------|
| Markdown rendering | ✓ | ✗ | ✗ |
| Syntax highlighting | ✓ | ✓ | ✗ |
| Pager mode | ✓ | ✓ | ✓ |
| Mouse support | ✓ | ✗ | ✗ |
| Live preview | ✗ | ✗ | ✗ |

## Troubleshooting

### No Colors
- Check terminal supports 256 colors
- Try different style: `glow -s dark`
- Set `TERM=xterm-256color`

### Width Issues
- Use `glow -w 80` for fixed width
- Use `glow -w 0` for terminal width

### Large Files
- Glow automatically uses pager for large files
- Use `glow -p` to force pager mode

## See Also

- `sigao help bat` - Syntax highlighting for code
- `sigao help help` - Sigao help system
- Official site: https://github.com/charmbracelet/glow