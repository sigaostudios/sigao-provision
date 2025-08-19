# cheat - Show Command Cheatsheet

Display the Sigao command reference cheatsheet with syntax highlighting.

## Usage

```bash
cheat
cheat | grep git
cheat | less
```

## Description

The `cheat` function displays a comprehensive cheatsheet of all Sigao-installed commands, aliases, and custom functions. It automatically uses the best available viewer:
- `glow` for beautiful markdown rendering (if installed)
- `bat` for syntax-highlighted display (if installed)
- `cat` as fallback

## Examples

### View Full Cheatsheet
```bash
cheat
# Displays the complete command reference with:
# - Git aliases and commands
# - Docker shortcuts
# - Navigation helpers
# - Modern CLI tools usage
# - Custom functions
```

### Search for Specific Commands
```bash
# Find all git-related commands
cheat | grep -i git

# Find docker commands
cheat | grep -A2 "Docker"

# Find navigation shortcuts
cheat | grep -E "dev|proj"
```

### Page Through Content
```bash
# Use with less for pagination
cheat | less

# Use with specific pager
cheat | more
```

## Implementation

```bash
cheat() {
  local cheatsheet="$HOME/.sigao-cheatsheet.md"
  
  if [ ! -f "$cheatsheet" ]; then
    echo "Cheatsheet not found at $cheatsheet"
    echo "Run 'sigao' to set up the development environment."
    return 1
  fi
  
  if command -v glow >/dev/null 2>&1; then
    glow "$cheatsheet"
  elif command -v bat >/dev/null 2>&1; then
    bat --style=plain "$cheatsheet"
  else
    cat "$cheatsheet"
  fi
}
```

## Cheatsheet Contents

The cheatsheet includes:

- **Git Shortcuts**: g, gs, ga, gc, gp, gl, gd, gb, gco, gcb, gm, gr, gf
- **GitHub CLI**: repos, ghclone, ghpr, ghis
- **Docker Commands**: d, dc, dps, dex, dlog, dprune
- **Navigation**: dev, proj, projects, mkcd
- **Modern Tools**: Usage for ripgrep, fd, bat, eza, fzf, etc.
- **Custom Functions**: extract, worktree-add, cheat, cheat-utils
- **Python/Node.js**: py, pip, venv, ni, nr, ns, nt, nb

## Tips & Tricks

### Create Custom Cheatsheet
```bash
# Add your own commands to personal cheatsheet
echo "## My Commands" >> ~/.my-cheatsheet.md
echo "alias mycommand='...'" >> ~/.my-cheatsheet.md
```

### Quick Reference Window
```bash
# Open in new terminal window (tmux)
tmux new-window 'cheat | less'

# Keep visible in split pane
tmux split-window -h 'cheat | less'
```

### Print Specific Section
```bash
# Extract just git commands
cheat | sed -n '/## Git/,/##/p'
```

## File Location

The cheatsheet is stored at: `~/.sigao-cheatsheet.md`

## Related Commands

- `cheat-utils` - Display utilities and tools guide
- `sigao help` - Access detailed help for any command
- `tldr` - Simplified man pages (if installed)

## See Also

- `sigao help cheat-utils` - Utilities reference
- `sigao help aliases` - All available aliases
- `sigao help navigation` - Navigation shortcuts