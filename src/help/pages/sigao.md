# Sigao CLI Overview

The Sigao CLI is a comprehensive tool for setting up AI-first development environments and automating complex coding tasks.

## Installation

### Initial Setup
```bash
# Interactive setup
npx @sigaostudios/sigao-cli

# Install everything
npx @sigaostudios/sigao-cli --yes

# Install specific components
npx @sigaostudios/sigao-cli -c node,docker,python
```

### Using the Alias
After installation, use the convenient alias:
```bash
sigao          # Runs npx @sigaostudios/sigao-cli
```

## Core Commands

### Setup Command
```bash
sigao setup    # Run interactive installer
sigao setup --yes    # Install all components
sigao setup --list   # List available components
sigao setup --dry-run    # Preview without installing
```

### Work Command
Execute AI-powered workpackages:
```bash
sigao work package.json
sigao work package.json --model opus
sigao work package.json --dry-run
sigao work package.json --output-dir ./output
```

Options:
- `--model <model>` - Claude model (sonnet, opus, or full name)
- `--dry-run` - Preview without executing
- `--output-dir <dir>` - Output directory
- `--log-level <level>` - Logging verbosity

See `sigao help work` for details.

### Generate Command
Create workpackages from requirements:
```bash
sigao generate requirements.md workpackage.json
```

### Help System
```bash
sigao help              # Show all help topics
sigao help <topic>      # Show specific topic
sigao help -p <topic>   # Show with pager mode
sigao cheat            # Quick reference
```

## Components

Sigao can install and configure:

### Development Tools
- **Shell**: Bash/Zsh with enhancements
- **Git**: Enhanced with aliases and tools
- **Node.js**: Via NVM with auto-switching
- **Python**: Via pyenv with virtualenv
- **Docker**: Container development
- **.NET**: C# development tools

### Modern CLI Tools
- **zoxide**: Smart cd replacement
- **fzf**: Fuzzy finder
- **ripgrep**: Fast search
- **bat**: Better cat
- **eza**: Modern ls
- **lazygit**: Git UI
- And many more...

### AI Tools
- **Claude Code CLI**: AI pair programming
- **Workpackage System**: Task automation

## Key Features

### 1. Shell Enhancements
- Starship prompt with git info
- Smart aliases and functions
- Directory navigation helpers
- Auto-completion everywhere

### 2. Project Organization
```
~/dev/
├── personal/      # Personal projects
├── work/          # Work projects
├── sigaostudios/  # Sigao projects
└── .tools/        # Shared tools
```

### 3. AI Automation
- Define complex tasks in JSON
- Claude executes step-by-step
- Automatic testing and validation
- Full context preservation

### 4. WSL Optimization
- PATH cleanup for Node.js
- Windows tool preservation
- Git credential sharing
- VS Code integration

## Configuration

### Environment Variables
```bash
# Sigao work output
export SIGAO_OUTPUT_DIR="$HOME/.sigao"

# Claude CLI path (if custom)
export CLAUDE_CLI_PATH="/path/to/claude"
```

### Shell Configuration
Configuration is added to:
- `~/.bashrc` for Bash
- `~/.zshrc` for Zsh

### Tool Configs
- `~/.config/starship.toml` - Prompt
- `~/.gitconfig` - Git settings
- `~/.config/ripgrep/config` - Search

## Common Workflows

### New Development Environment
```bash
# 1. Install Sigao
npx @sigaostudios/sigao-cli --yes

# 2. Restart shell
exec $SHELL

# 3. Verify installation
sigao help
```

### Starting New Project
```bash
# Navigate to organization
devp  # personal projects

# Create project
mkcd my-new-app

# Initialize
git init
npm init -y

# Start working
code .
```

### AI-Assisted Development
```bash
# Create workpackage from requirements
sigao generate requirements.md tasks.json

# Review and edit tasks.json

# Execute with Claude
sigao work tasks.json

# Use Opus for complex refactoring
sigao work tasks.json --model opus
```

## Troubleshooting

### Installation Issues
```bash
# Check what's installed
sigao setup --list

# Re-run specific component
sigao setup -c node
```

### PATH Issues (WSL)
```bash
# Verify PATH is clean
echo $PATH | tr ':' '\n' | grep -E "(npm|node)"

# Reload shell config
exec $SHELL
```

### Component Verification
Each component can be verified:
```bash
# Examples
command -v node    # Node.js
command -v docker  # Docker
command -v claude  # Claude CLI
```

## Getting Help

1. **Built-in Help**: `sigao help <topic>`
2. **Quick Reference**: `sigao cheat`
3. **GitHub Issues**: Report bugs and request features
4. **Documentation**: Full docs on GitHub

## Tips

1. Run `sigao` anytime to see the help screen
2. Use `--dry-run` to preview changes
3. Keep your shell config clean with `exec $SHELL`
4. Combine tools: `fd | fzf | xargs vim`
5. Let Claude handle complex refactoring via workpackages

## See Also

- `sigao help work` - Workpackage automation
- `sigao help navigation` - Project navigation
- `sigao help git` - Git workflow
- GitHub: https://github.com/sigaostudios/sigao-ai-devkit