# Sigao Provision

Environment provisioning tool extracted from sigao-cli. This standalone tool provides a modular system for setting up development environments with various tools and configurations.

## Installation

```bash
npm install -g sigao-provision
```

Or run directly with npx:

```bash
npx sigao-provision
```

## Usage

### Interactive Mode

Run without arguments to interactively select modules to install:

```bash
sigao-provision install
```

### Install Specific Modules

```bash
sigao-provision install node docker python
```

### Install All Modules

```bash
sigao-provision install --all
```

### List Available Modules

```bash
sigao-provision install --list
```

### Check Installed Modules

```bash
sigao-provision check
```

### Dry Run Mode

Preview what would be installed without making changes:

```bash
sigao-provision install --dry-run
```

## Available Modules

### Core Tools
- **shell** - Shell configuration (bash/zsh)
- **essentials** - Essential tools (git, gh, ripgrep, curl, wget)
- **git-enhanced** - Git configuration and SSH setup

### Development Environments
- **node** - Node.js via NVM
- **python** - Python via pyenv
- **python-tools** - Python development tools (black, ruff, mypy, pytest)
- **dotnet** - .NET SDK
- **docker** - Docker and Docker Compose
- **cargo** - Rust toolchain

### CLI Tools
- **cli-tools** - Modern CLI tools (bat, eza, fd, fzf, htop, etc.)
- **shell-enhancements** - Starship prompt and custom aliases
- **direnv** - Directory-based environment management
- **claude** - Claude Code CLI
- **azure-cli** - Azure CLI

## Module Dependencies

The tool automatically handles module dependencies. For example:
- `git-enhanced` depends on `git` (from essentials)
- `python-tools` depends on `python`
- Most modules benefit from having `shell` configured first

## Platform Support

- Ubuntu/Debian (apt)
- macOS (brew)
- Fedora/RHEL (dnf)
- Arch Linux (pacman)
- WSL (Windows Subsystem for Linux)

## Features

- **Modular Architecture**: Each tool is a separate module that can be installed independently
- **Dependency Resolution**: Automatically installs required dependencies
- **Cross-Platform**: Works on Linux, macOS, and WSL
- **Idempotent**: Safe to run multiple times
- **Progress Indicators**: Visual feedback during installation
- **Dry Run Mode**: Preview changes before applying
- **Configuration Collection**: Collects user preferences upfront

## Development

```bash
# Clone the repository
git clone <repository-url>
cd sigao-provision

# Install dependencies
npm install

# Run locally
npm start

# Run with custom command
node src/index.js install --list
```

## Architecture

- **BaseInstaller**: Base class for all installers
- **Module Registry**: Dynamic module loading system
- **Platform Detection**: Automatic OS and package manager detection
- **Shell Utilities**: Cross-platform command execution
- **Logger**: Colored console output with levels

## License

MIT