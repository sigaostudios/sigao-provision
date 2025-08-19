# Lazygit - Simple Terminal UI for Git

Lazygit is a simple terminal UI for git commands, making complex git operations intuitive and visual.

## Starting Lazygit

```bash
# Open in current repository
lazygit

# Or use the alias
lg

# Open in specific directory
lazygit -p /path/to/repo
```

## Key Bindings

### Global
| Key | Action |
|-----|--------|
| `?` | Show help/keybindings |
| `q` | Quit |
| `p` | Pull |
| `P` | Push |
| `R` | Refresh |
| `x` | Open menu |

### Navigation
| Key | Action |
|-----|--------|
| `h/j/k/l` | Navigate (vim-style) |
| `Tab` | Next panel |
| `Shift+Tab` | Previous panel |
| `[/]` | Previous/next tab |

## Main Panels

### 1. Status Panel (Files)
| Key | Action |
|-----|--------|
| `Space` | Stage/unstage file |
| `a` | Stage/unstage all |
| `c` | Commit |
| `A` | Amend last commit |
| `d` | Discard changes |
| `D` | Discard all changes |
| `e` | Edit file |
| `o` | Open file |
| `i` | Ignore file |
| `S` | Stash files |

### 2. Branches Panel
| Key | Action |
|-----|--------|
| `Space` | Checkout branch |
| `n` | New branch |
| `d` | Delete branch |
| `r` | Rebase onto branch |
| `M` | Merge into current |
| `f` | Fast-forward |
| `R` | Rename branch |

### 3. Commits Panel
| Key | Action |
|-----|--------|
| `Space` | Checkout commit |
| `g` | Reset to commit |
| `s` | Squash down |
| `f` | Fixup commit |
| `r` | Reword commit |
| `d` | Delete commit |
| `c` | Cherry-pick |
| `C` | Copy commit SHA |

### 4. Stash Panel
| Key | Action |
|-----|--------|
| `Space` | Apply stash |
| `g` | Pop stash |
| `d` | Drop stash |
| `n` | New stash |

## Common Workflows

### Basic Commit Flow
1. Review changes in Status panel
2. Stage files with `Space`
3. Press `c` to commit
4. Write commit message
5. Press `Enter` to confirm

### Interactive Rebase
1. Go to Commits panel
2. Navigate to commit before the ones you want to edit
3. Press `e` to start interactive rebase
4. Use `s` to squash, `r` to reword, `d` to drop
5. Press `m` to continue rebase

### Branch Management
1. Go to Branches panel
2. Create new branch with `n`
3. Switch branches with `Space`
4. Merge with `M`
5. Delete old branches with `d`

### Resolving Conflicts
1. Conflicts shown in red in Status panel
2. Press `Enter` to see conflict
3. Choose version with arrow keys
4. Stage resolved file with `Space`
5. Continue rebase/merge with `m`

## Advanced Features

### Cherry-picking
1. Go to Commits panel in source branch
2. Select commits with `c`
3. Switch to target branch
4. Press `v` to paste commits

### Custom Commands
1. Press `x` for menu
2. Select "Custom Commands"
3. Define in config file

### Filtering
- Press `/` in any list panel
- Type to filter items
- `Esc` to clear filter

## Configuration

Config file: `~/.config/lazygit/config.yml`

```yaml
# Example configuration
gui:
  theme:
    selectedLineBgColor:
      - reverse
  showFileTree: true
  showCommandLog: false

git:
  paging:
    colorArg: always
    pager: delta

keybinding:
  universal:
    quit: 'q'
    quit-alt1: '<c-c>'

os:
  editCommand: 'code'
  editCommandTemplate: '{{editor}} {{filename}}'
```

## Tips & Tricks

1. **Quick commit**: `Shift+C` for commit with skip hooks
2. **Undo**: `z` opens undo/redo panel
3. **Search commits**: `/` in commits panel
4. **Copy to clipboard**: `C` copies SHA, branch name, etc.
5. **Bulk operations**: Use `Shift+↓/↑` to select multiple items

## Integration with Editor

```yaml
# VSCode
os:
  editCommand: 'code'

# Neovim
os:
  editCommand: 'nvim'

# Open at specific line
os:
  editCommandTemplate: '{{editor}} +{{line}} {{filename}}'
```

## Troubleshooting

### Performance Issues
- Disable file tree: Set `showFileTree: false`
- Reduce refresh rate in config
- Use simpler diff tool

### Display Issues
- Try different terminal
- Check locale settings
- Update lazygit version

## Useful Aliases

```bash
# Quick access
alias lg='lazygit'

# Open with status
alias lgs='lazygit -s'

# Specific repo
lgr() { lazygit -p "$1"; }
```

## See Also

- `sigao help git` - Git aliases and commands
- `sigao help navigation` - Project navigation
- Official docs: https://github.com/jesseduffield/lazygit