# cheat-utils - Show Utilities Guide

Display the Sigao utilities and tools reference guide with detailed examples.

## Usage

```bash
cheat-utils
cheat-utils | grep docker
cheat-utils | less
```

## Description

The `cheat-utils` function displays a comprehensive guide for all the modern CLI utilities installed by Sigao. It provides practical examples and use cases for tools like ripgrep, fd, bat, eza, fzf, and many others. The display uses:
- `glow` for beautiful markdown rendering (if installed)
- `bat` for syntax-highlighted display (if installed)
- `cat` as fallback

## Examples

### View Full Utilities Guide
```bash
cheat-utils
# Displays detailed usage for:
# - Text searching with ripgrep
# - File finding with fd
# - File viewing with bat
# - Directory listing with eza
# - Fuzzy finding with fzf
# - And 15+ other modern tools
```

### Find Specific Tool Usage
```bash
# Find ripgrep examples
cheat-utils | grep -A5 "Ripgrep"

# Find docker utilities
cheat-utils | grep -B2 -A5 "lazydocker"

# Find all fuzzy finding tools
cheat-utils | grep -i "fzf"
```

### Quick Tool Reference
```bash
# See what tools are covered
cheat-utils | grep "^###"

# Count available utilities
cheat-utils | grep "^###" | wc -l
```

## Implementation

```bash
cheat-utils() {
  local utils_guide="$HOME/.sigao-cheatsheet-utils.md"
  
  if [ ! -f "$utils_guide" ]; then
    echo "Utilities guide not found at $utils_guide"
    echo "Run 'sigao' to set up the development environment."
    return 1
  fi
  
  if command -v glow >/dev/null 2>&1; then
    glow "$utils_guide"
  elif command -v bat >/dev/null 2>&1; then
    bat --style=plain "$utils_guide"
  else
    cat "$utils_guide"
  fi
}
```

## Guide Contents

The utilities guide covers:

### Text & Search Tools
- **ripgrep (rg)**: Lightning-fast text search
- **fd**: Modern find replacement
- **fzf**: Command-line fuzzy finder

### File & Directory Tools
- **bat**: Cat with syntax highlighting
- **eza**: Modern ls replacement
- **zoxide**: Smarter cd command
- **broot**: Interactive tree view

### System Monitoring
- **htop/btop**: Process viewers
- **ncdu**: Disk usage analyzer
- **procs**: Modern ps replacement

### Development Tools
- **lazygit**: Terminal UI for git
- **lazydocker**: Terminal UI for docker
- **httpie**: Modern HTTP client
- **jq**: JSON processor

### Terminal Tools
- **tmux**: Terminal multiplexer
- **glow**: Markdown renderer
- **tldr**: Simplified man pages

## Tips & Tricks

### Learn One Tool at a Time
```bash
# Pick a tool and explore its section
cheat-utils | sed -n '/### Ripgrep/,/###/p'
```

### Create Practice Environment
```bash
# Make a sandbox directory
mkdir ~/utils-practice
cd ~/utils-practice

# Try examples from the guide
cheat-utils | grep -A3 "# Find"
```

### Combine with Help System
```bash
# Get basic reference
cheat-utils | grep -A5 "### Bat"

# Get detailed help
sigao help bat
```

## File Location

The utilities guide is stored at: `~/.sigao-cheatsheet-utils.md`

## Benefits of Modern Tools

- **Faster**: Tools like ripgrep and fd are significantly faster than traditional alternatives
- **User-Friendly**: Better defaults and clearer output
- **Feature-Rich**: Syntax highlighting, git integration, interactive interfaces
- **Cross-Platform**: Work consistently across Linux, macOS, and WSL

## Related Commands

- `cheat` - Show command shortcuts cheatsheet
- `sigao help` - Detailed help for any tool
- `tldr` - Quick examples for commands

## See Also

- `sigao help cheat` - Command reference
- `sigao help <tool>` - Detailed help for specific tools
- Modern Unix tools: https://github.com/ibraheemdev/modern-unix