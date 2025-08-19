# Starship - Cross-Shell Prompt

Starship is a minimal, blazing-fast, and infinitely customizable prompt for any shell.

## Overview

Starship shows relevant information about your current directory:
- Git branch and status
- Language versions (Node.js, Python, Rust, etc.)
- Command execution time
- Error status
- Current user/host (when SSH)
- And much more!

## Configuration

Starship config is at `~/.config/starship.toml`

### Basic Configuration
```toml
# Don't print a new line at the start
add_newline = false

# Timeout for commands
command_timeout = 100

# Format of the prompt
format = """
$username\
$hostname\
$directory\
$git_branch\
$git_status\
$nodejs\
$python\
$docker_context\
$cmd_duration\
$line_break\
$character\
"""
```

## Modules

### Directory
```toml
[directory]
style = "bold cyan"
truncation_length = 3
truncate_to_repo = true
format = "[$path]($style)[$read_only]($read_only_style) "
```

### Git Branch
```toml
[git_branch]
symbol = " "
style = "bold green"
format = "[$symbol$branch]($style) "
```

### Git Status
```toml
[git_status]
style = "bold yellow"
format = '([$all_status$ahead_behind]($style) )'
conflicted = "🏳"
ahead = "⇡${count}"
behind = "⇣${count}"
diverged = "⇕⇡${ahead_count}⇣${behind_count}"
untracked = "🤷${count}"
stashed = "📦${count}"
modified = "📝${count}"
staged = '➕${count}'
renamed = "👅${count}"
deleted = "🗑️${count}"
```

### Language Versions
```toml
[nodejs]
symbol = " "
format = "[$symbol$version]($style) "
style = "bold green"
detect_files = ["package.json", ".node-version", ".nvmrc"]

[python]
symbol = "🐍 "
style = "yellow bold"
format = '[$symbol$pyenv_prefix($version )(\($virtualenv\) )]($style)'

[rust]
symbol = " "
format = "[$symbol$version]($style) "

[golang]
symbol = " "
format = "[$symbol$version]($style) "
```

### Command Duration
```toml
[cmd_duration]
min_time = 2_000  # Show if command took > 2 seconds
format = "[⏱ $duration]($style) "
style = "bold yellow"
```

### Character (Prompt Symbol)
```toml
[character]
success_symbol = "[❯](bold green)"
error_symbol = "[❯](bold red)"
```

## Customization Examples

### Minimal Prompt
```toml
format = """
$directory$git_branch$git_status$character
"""
```

### Two-Line Prompt
```toml
format = """
$all
$character
"""
```

### Right Prompt
```toml
# Shows on the right side
right_format = """
$cmd_duration
$time
"""

[time]
disabled = false
format = '[$time]($style)'
style = "bold yellow"
```

### Custom Colors
```toml
[directory]
style = "bold #74c7ec"  # Custom hex color

[git_branch]
style = "bold #a6e3a1"  # Catppuccin green
```

## Nerd Fonts

Starship works best with a Nerd Font. Popular choices:
- FiraCode Nerd Font
- JetBrainsMono Nerd Font
- Meslo Nerd Font

Install from: https://www.nerdfonts.com/

## Performance Tips

```toml
# Disable slow modules
[package]
disabled = true

[helm]
disabled = true

# Reduce scan timeout
scan_timeout = 10

# Limit command timeout
command_timeout = 100
```

## Conditional Display

Show modules only when relevant:
```toml
[aws]
disabled = false
format = '[$symbol($profile )(\($region\) )]($style)'
# Only shows when AWS credentials are set

[kubernetes]
disabled = false
detect_folders = ["k8s", "kubernetes"]
# Only shows in k8s projects
```

## Status Indicators

### SSH Indicator
```toml
[hostname]
ssh_only = true
format = "[@$hostname](bold blue) "
```

### User Indicator
```toml
[username]
style_user = "bold yellow"
style_root = "bold red"
format = "[$user]($style) "
show_always = false  # Only show if not default user
```

## Debugging

```bash
# Check config for errors
starship config

# Explain what's shown
starship explain

# Time each module
starship timings

# Print computed config
starship print-config
```

## Sigao Configuration

Sigao installs Starship with a balanced configuration:
- Shows git information
- Shows language versions when relevant
- Shows command duration for slow commands
- Clean, readable format
- Optimized for performance

## Tips & Tricks

1. **Test changes**: Use `starship prompt` to preview
2. **Module docs**: Run `starship module <name>`
3. **Backup config**: Keep your starship.toml in version control
4. **Share configs**: Export with `starship print-config`

## Common Issues

### Icons Not Showing
- Install a Nerd Font
- Configure your terminal to use it

### Slow Prompt
- Disable unused modules
- Reduce `command_timeout`
- Check `starship timings`

### Git Status Slow
```toml
[git_status]
disabled = true  # As a last resort
```

## See Also

- `sigao help shell` - Shell configuration
- `sigao help git` - Git integration
- Official docs: https://starship.rs/