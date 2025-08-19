# FZF - Command-line Fuzzy Finder

FZF is a general-purpose fuzzy finder that can be used with any list: files, command history, processes, hostnames, bookmarks, git commits, etc.

## Key Bindings (Shell)

| Binding | Description |
|---------|-------------|
| `Ctrl+R` | Fuzzy search command history |
| `Ctrl+T` | Fuzzy find files and paste to command line |
| `Alt+C` | Fuzzy change directory |

## Basic Usage

```bash
# Find files
find . -type f | fzf

# Search with preview
fzf --preview 'cat {}'

# Multi-select with Tab
fzf -m

# Search git commits
git log --oneline | fzf
```

## Common Patterns

### Open File in Editor
```bash
# Open selected file in vim
vim $(fzf)

# With preview
vim $(fzf --preview 'bat --color=always {}')
```

### Kill Process
```bash
# Interactive process killer
kill -9 $(ps aux | fzf | awk '{print $2}')
```

### Git Operations
```bash
# Checkout branch
git checkout $(git branch -a | fzf)

# Show commit
git show $(git log --oneline | fzf | cut -d' ' -f1)
```

### Search and Edit
```bash
# Search file contents and edit
rg --files-with-matches "pattern" | fzf --preview 'rg --color=always -n "pattern" {}' | xargs vim
```

## Advanced Options

### Preview Window
```bash
# Right side preview
fzf --preview 'cat {}' --preview-window=right:50%

# Hidden by default, toggle with ?
fzf --preview 'cat {}' --preview-window=hidden --bind '?:toggle-preview'
```

### Custom Bindings
```bash
# Execute command on selection
fzf --bind 'enter:execute(vim {})'

# Multiple actions
fzf --bind 'ctrl-v:execute(vim {}),ctrl-d:execute(rm -i {})'
```

## Environment Variables

```bash
# Default options
export FZF_DEFAULT_OPTS="--height 40% --layout=reverse --border"

# Default command (using fd)
export FZF_DEFAULT_COMMAND="fd --type f --hidden --follow"

# Ctrl+T command
export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_COMMAND"

# Alt+C command
export FZF_ALT_C_COMMAND="fd --type d"
```

## Integration Examples

### With Ripgrep
```bash
# Search file contents interactively
rg-fzf() {
  rg --color=always --line-number --no-heading "$@" |
    fzf --ansi \
        --color "hl:-1:underline,hl+:-1:underline:reverse" \
        --delimiter : \
        --preview 'bat --color=always {1} --highlight-line {2}' \
        --preview-window 'up,60%,border-bottom,+{2}+3/3'
}
```

### With Git
```bash
# Interactive git add
git add $(git status -s | fzf -m | awk '{print $2}')

# Browse git stashes
git stash list | fzf --preview 'git stash show -p {1}' | cut -d: -f1 | xargs git stash apply
```

## Tips & Tricks

1. **Multi-selection**: Use `Tab` to select multiple items
2. **Exact matching**: Prefix with `'` for exact match
3. **Inverse match**: Prefix with `!` to exclude
4. **Toggle sorting**: Press `Ctrl+R` to toggle sort

## Useful Aliases

```bash
# Preview files
alias fzfp='fzf --preview "bat --color=always {}"'

# Change directory with preview
alias fzfd='cd $(fd --type d | fzf --preview "ls -la {}")'
```

## See Also

- `sigao help ripgrep` - Fast text search
- `sigao help fd` - Fast file finder
- `sigao help bat` - File previewer
- Official wiki: https://github.com/junegunn/fzf/wiki