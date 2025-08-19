# Shell Configuration - Bash and Zsh Setup

Configure and enhance your shell environment with modern features and integrations.

## Overview

Sigao configures your shell (Bash or Zsh) with:
- Enhanced completion and history
- Color support and syntax highlighting
- Smart PATH management (especially for WSL)
- Integration with all installed tools
- Custom aliases and functions

## Shell Selection

During installation, Sigao asks which shell you prefer:
- **Bash** - Enhanced with completions and better defaults
- **Zsh** - Includes Oh My Zsh with plugins

## Bash Configuration

### Features Added
- bash-completion for better tab completion
- Improved history settings
- Color prompt support
- Integration with direnv, nvm, pyenv
- Custom aliases and functions
- Starship prompt

### Configuration Files
```bash
~/.bashrc         # Main configuration
~/.bash_profile   # Login shell setup
~/.profile        # Environment variables
```

### Bash Enhancements
```bash
# Better history
export HISTSIZE=10000
export HISTFILESIZE=20000
export HISTCONTROL=ignoredups:erasedups
shopt -s histappend

# Better completion
if [ -f /etc/bash_completion ]; then
    . /etc/bash_completion
fi
```

## Zsh Configuration

### Oh My Zsh
Sigao installs Oh My Zsh with selected plugins:
- zsh-autosuggestions
- zsh-syntax-highlighting
- git
- docker
- kubectl

### Configuration Files
```bash
~/.zshrc          # Main configuration
~/.zprofile       # Login shell setup
~/.zshenv         # Environment variables
```

### Zsh Features
```bash
# Syntax highlighting
source $ZSH/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

# Auto suggestions
source $ZSH/plugins/zsh-autosuggestions/zsh-autosuggestions.zsh

# Better completion
autoload -Uz compinit && compinit
```

## WSL-Specific Configuration

### PATH Cleanup
Sigao automatically cleans Windows paths from WSL:
```bash
# Removes Windows npm, node, etc.
# Preserves VS Code and browsers
# Adds /snap/bin for WSL tools
```

### Git Credential Manager
```bash
# Automatic setup for Windows credential manager
git config --global credential.helper "/mnt/c/Program Files/Git/mingw64/bin/git-credential-manager.exe"
```

## Environment Integration

### Tool Integrations Added
- **NVM**: Automatic Node.js version switching
- **pyenv**: Python version management
- **direnv**: Per-directory environments
- **Starship**: Cross-shell prompt
- **fzf**: Fuzzy finder key bindings

### PATH Management
```bash
# Added to PATH:
~/.local/bin      # User binaries
~/.cargo/bin      # Rust tools
~/.dotnet         # .NET SDK
$GOPATH/bin       # Go binaries
```

## Custom Aliases

### Navigation
```bash
dev         # cd ~/dev
devs        # cd ~/dev/sigaostudios  
devp        # cd ~/dev/personal
devw        # cd ~/dev/work
proj        # Smart project navigation
projects    # List all projects
```

### Git Shortcuts
```bash
g           # git
gs          # git status
ga          # git add
gc          # git commit
gp          # git push
gl          # git log
```

### Modern Tool Aliases
```bash
cat → bat   # If bat is installed
ls → eza    # If eza is installed
find → fd   # If fd is installed
grep → rg   # If ripgrep is installed
```

## Custom Functions

### Installed Functions
- `mkcd` - Make directory and enter it
- `extract` - Universal archive extractor
- `proj` - Smart project navigation
- `worktree-add` - Git worktree helper
- `cheat` - Show command cheatsheet
- `repos` - List GitHub repositories
- `ghclone` - Clone with GitHub CLI

## Switching Shells

### Change Default Shell
```bash
# Switch to Zsh
chsh -s $(which zsh)

# Switch to Bash
chsh -s $(which bash)

# Verify current shell
echo $SHELL
```

### Try Without Switching
```bash
# Launch Zsh
zsh

# Launch Bash
bash

# Exit back to default
exit
```

## Customization

### Adding Aliases
```bash
# Edit shell config
nano ~/.bashrc  # or ~/.zshrc

# Add custom alias
alias myproject='cd ~/dev/myproject'

# Reload configuration
source ~/.bashrc
```

### Adding to PATH
```bash
# Add to ~/.bashrc or ~/.zshrc
export PATH="$HOME/my-tools:$PATH"

# Verify
echo $PATH
```

## Troubleshooting

### Slow Shell Startup
```bash
# Profile startup time (Zsh)
zsh -xv 2>&1 | ts -i "%.s" > zsh-startup.log

# Profile startup time (Bash)
bash -xv 2>&1 | ts -i "%.s" > bash-startup.log
```

### PATH Issues
```bash
# Check PATH
echo $PATH | tr ':' '\n'

# Find command location
which node
type node
```

### Reset Configuration
```bash
# Backup current config
cp ~/.bashrc ~/.bashrc.backup

# Restore from Sigao
sigao shell --reconfigure
```

## Related Topics

- `sigao help aliases` - All available aliases
- `sigao help navigation` - Directory navigation
- `sigao help starship` - Prompt customization
- `sigao help direnv` - Environment management

## See Also

- Bash Manual: https://www.gnu.org/software/bash/manual/
- Zsh Documentation: https://zsh.sourceforge.io/Doc/
- Oh My Zsh: https://ohmyz.sh/