# tmux - Terminal Multiplexer

tmux is a terminal multiplexer that lets you switch between multiple programs in one terminal, detach them and reattach them to a different terminal.

## Basic Concepts

- **Server**: Background process managing all tmux activity
- **Session**: Collection of windows (like a workspace)
- **Window**: Single screen within a session (like tabs)
- **Pane**: Split section within a window

## Getting Started

```bash
# Start new session
tmux

# Start named session
tmux new -s myproject

# List sessions
tmux ls

# Attach to session
tmux attach -t myproject

# Detach from session
Ctrl+b d
```

## Key Bindings

All commands start with the prefix key: `Ctrl+b`

### Session Management
| Command | Action |
|---------|--------|
| `Ctrl+b d` | Detach from session |
| `Ctrl+b $` | Rename session |
| `Ctrl+b s` | List sessions |
| `Ctrl+b (` | Previous session |
| `Ctrl+b )` | Next session |

### Window Management
| Command | Action |
|---------|--------|
| `Ctrl+b c` | Create new window |
| `Ctrl+b ,` | Rename window |
| `Ctrl+b n` | Next window |
| `Ctrl+b p` | Previous window |
| `Ctrl+b 0-9` | Switch to window 0-9 |
| `Ctrl+b w` | List windows |
| `Ctrl+b &` | Kill window |

### Pane Management
| Command | Action |
|---------|--------|
| `Ctrl+b %` | Split vertically |
| `Ctrl+b "` | Split horizontally |
| `Ctrl+b o` | Switch to next pane |
| `Ctrl+b ↑/↓/←/→` | Navigate panes |
| `Ctrl+b q` | Show pane numbers |
| `Ctrl+b x` | Kill pane |
| `Ctrl+b z` | Toggle pane zoom |
| `Ctrl+b {` | Move pane left |
| `Ctrl+b }` | Move pane right |

### Other Commands
| Command | Action |
|---------|--------|
| `Ctrl+b ?` | Show all key bindings |
| `Ctrl+b :` | Command prompt |
| `Ctrl+b [` | Enter copy mode |
| `Ctrl+b ]` | Paste buffer |

## Common Workflows

### Development Setup
```bash
# Create session for project
tmux new -s webapp

# Split for editor and terminal
Ctrl+b %

# Create window for server
Ctrl+b c
npm run dev

# Create window for tests
Ctrl+b c
npm test --watch

# Detach and come back later
Ctrl+b d
```

### Multiple Projects
```bash
# Session per project
tmux new -s frontend
tmux new -s backend -d  # Create detached
tmux new -s database -d

# Switch between
tmux switch -t backend
```

## Configuration

Create `~/.tmux.conf`:

```bash
# Better prefix key
set -g prefix C-a
unbind C-b

# Start windows at 1
set -g base-index 1
setw -g pane-base-index 1

# Enable mouse
set -g mouse on

# Vi mode
setw -g mode-keys vi

# Better splitting
bind | split-window -h
bind - split-window -v

# Reload config
bind r source-file ~/.tmux.conf \; display "Reloaded!"

# Status bar
set -g status-bg black
set -g status-fg white
set -g status-left '#[fg=green]#S'
```

## Copy Mode

Enter copy mode to scroll and copy text:

```bash
# Enter copy mode
Ctrl+b [

# Navigation in copy mode
↑/↓/PgUp/PgDn - Scroll
/ - Search forward
? - Search backward
n/N - Next/previous match

# Vi-style selection
Space - Start selection
Enter - Copy selection

# Exit copy mode
q or Esc
```

## Advanced Features

### Synchronized Panes
```bash
# Type in all panes simultaneously
:setw synchronize-panes on
```

### Save/Restore Layout
```bash
# Save layout
Ctrl+b Ctrl+s

# Restore layout
Ctrl+b Ctrl+r

# Requires tmux-resurrect plugin
```

### Command Mode
```bash
# Enter command mode
Ctrl+b :

# Useful commands
:new-window -n logs 'tail -f /var/log/syslog'
:split-window -h -p 30  # 30% width
:resize-pane -R 10      # Resize right 10 cells
```

## Scripting tmux

### Create Complex Layout
```bash
#!/bin/bash
tmux new-session -d -s dev
tmux rename-window -t dev:0 'editor'
tmux send-keys -t dev:0 'vim' C-m

tmux new-window -t dev:1 -n 'server'
tmux send-keys -t dev:1 'npm run dev' C-m

tmux new-window -t dev:2 -n 'tests'
tmux split-window -h -t dev:2
tmux send-keys -t dev:2.0 'npm test --watch' C-m
tmux send-keys -t dev:2.1 'htop' C-m

tmux attach -t dev
```

## Tips & Tricks

1. **Zoom pane**: `Ctrl+b z` to focus on one pane
2. **Swap panes**: `Ctrl+b {` or `}`
3. **Break pane to window**: `Ctrl+b !`
4. **Join pane from window**: `:join-pane -s 2`
5. **Pipe pane output**: `:pipe-pane -o 'cat >> output.log'`

## Common Issues

### Colors Not Working
```bash
# In .bashrc/.zshrc
export TERM=screen-256color

# Or in .tmux.conf
set -g default-terminal "screen-256color"
```

### Scrolling Issues
```bash
# Enable mouse mode
set -g mouse on

# Or use copy mode
Ctrl+b [
```

## Plugins

Popular plugins via TPM (Tmux Plugin Manager):
- `tmux-resurrect` - Save/restore sessions
- `tmux-continuum` - Automatic save/restore
- `tmux-sensible` - Better defaults
- `tmux-yank` - Better copy/paste

## See Also

- `sigao help aliases` - tmux is installed by cli-tools
- Screen to tmux: https://www.dayid.org/comp/tm.html
- tmux cheat sheet: https://tmuxcheatsheet.com/