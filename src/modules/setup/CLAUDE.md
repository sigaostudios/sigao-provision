# Setup Module - CLAUDE.md

## Purpose
This module contains all the installer classes for setting up development tools and environments.

## IMPORTANT: DO NOT MODIFY UNLESS EXPLICITLY ASKED
⚠️ **WARNING**: Do not make changes to any files in this directory unless the user specifically asks you to fix or modify the setup functionality. These installers are carefully crafted to work across different platforms and environments.

## Module Overview
The setup module provides installers for:
- Shell configuration (bash/zsh)
- Essential tools (git, gh, ripgrep)
- Git enhancements and configuration
- Node.js via NVM
- Claude Code CLI
- Docker and Docker Compose
- Python via pyenv
- Python development tools
- .NET SDK
- Azure CLI
- Modern CLI tools (bat, eza, fd, etc.)
- Shell enhancements (starship, aliases, functions)
- Cargo/Rust toolchain

## Architecture
- Each installer extends the `BaseInstaller` class
- Installers implement: `isInstalled()`, `install()`, `verify()`
- Optional methods: `preInstall()`, `postInstall()`, `configure()`
- Platform detection via `src/utils/platform.js`
- Shell command execution with proper error handling

## Key Files
- `base.js` - Base installer class with common functionality
- Individual installer files (e.g., `node.js`, `docker.js`, etc.)
- Each installer is self-contained with its specific logic

## Testing
When modifying installers:
1. Test on multiple platforms (Ubuntu, macOS, WSL)
2. Test both fresh installs and updates
3. Verify idempotency (running twice should be safe)
4. Check error handling and rollback capabilities

## Common Patterns
- Use `this.shell.which()` to check if commands exist
- Use `this.shell.run()` for command execution
- Implement proper cleanup in case of failures
- Support dry-run mode for all operations
- Provide clear progress indicators