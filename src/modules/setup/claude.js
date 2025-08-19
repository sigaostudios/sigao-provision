import { runShellScript, runWithSpinner } from '../../utils/shell.js';
import { BaseInstaller } from './base.js';
import { readModification, updateModification, getCurrentVersion } from './change-index.js';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

export class ClaudeInstaller extends BaseInstaller {
  async isInstalled() {
    try {
      const result = await runShellScript(`
        # Unset npm_config_prefix to avoid NVM conflicts
        unset npm_config_prefix
        unset NPM_CONFIG_PREFIX
        
        # Check multiple possible locations for claude
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" 2>/dev/null
        
        # Add npm-global to PATH
        export PATH="$HOME/.npm-global/bin:$PATH"
        
        # Check if claude is installed (in PATH or npm-global)
        if which claude >/dev/null 2>&1; then
          exit 0  # claude found in PATH
        elif [ -x "$HOME/.npm-global/bin/claude" ]; then
          exit 0  # claude found in npm-global
        elif [ -x "$HOME/.nvm/versions/node/$(node --version 2>/dev/null)/bin/claude" ]; then
          exit 0  # claude found in NVM directory
        else
          # Try to find claude in any NVM node version
          for dir in "$HOME/.nvm/versions/node/"*/bin/claude; do
            if [ -x "$dir" ]; then
              exit 0  # claude found in an NVM version
            fi
          done
          exit 1  # claude not found
        fi
      `, { silent: true }); // Run silently to avoid red error text
      return result.exitCode === 0;
    } catch {
      return false;
    }
  }

  async install() {
    await runWithSpinner('Installing Claude Code CLI...', async () => {
      try {
        // First check if NVM is properly installed
        const nvmCheck = await runShellScript(`
          if [ -f "$HOME/.nvm/nvm.sh" ]; then
            echo "NVM found at $HOME/.nvm"
          else
            echo "NVM not found"
            exit 1
          fi
        `);

        this.logger.debug(nvmCheck.stdout.trim());

        // Install Claude Code globally with NVM's npm
        // We need to ensure NVM's node is used, not system node
        const installResult = await runShellScript(`
          # Unset any npm_config_prefix to avoid conflicts with NVM
          unset npm_config_prefix
          unset NPM_CONFIG_PREFIX
          
          # Source NVM
          export NVM_DIR="$HOME/.nvm"
          [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
          
          # Check if a default version exists, if not install LTS
          if ! nvm ls default >/dev/null 2>&1; then
            echo "No default Node version found. Installing LTS..."
            nvm install --lts
            nvm alias default lts/*
          fi
          
          # Use the default version
          nvm use default
          
          # Verify we're using NVM's npm
          echo "Using npm from: $(which npm)"
          echo "Node version: $(node --version)"
          echo "NPM version: $(npm --version)"
          
          # Get current npm prefix
          NPM_PREFIX=$(npm config get prefix)
          echo "NPM prefix: $NPM_PREFIX"
          
          # Install Claude Code
          npm install -g @anthropic-ai/claude-code || {
            echo "Failed to install @anthropic-ai/claude-code"
            exit 1
          }
          
          # Configuration will be added separately through helper functions
        `);

        this.logger.debug('Claude installation output:', installResult.stdout);
        
        // Configure shell to load NVM default
        await this.configureShell();
      } catch (_error) {
        // Provide helpful error messages
        if (_error.message.includes('NVM not found')) {
          throw new Error('NVM is not installed. Please run the Node.js installer first and restart your shell.');
        }
        if (_error.message.includes('command not found: nvm')) {
          throw new Error('NVM is installed but not loaded in the shell. Please restart your terminal and try again.');
        }
        if (_error.message.includes('EACCES') || _error.message.includes('permission denied')) {
          throw new Error('Permission error: NPM is trying to use system directories. Please ensure NVM is properly loaded.');
        }
        if (_error.message.includes('npm ERR!')) {
          throw new Error(`NPM installation error: ${_error.message}`);
        }
        throw _error;
      }
    });
  }

  postInstall() {
    this.logger.info('Claude Code CLI has been installed successfully!');
    this.logger.info('');
    this.logger.info('Next steps:');
    this.logger.info('1. Restart your terminal or run: source ~/.bashrc (or ~/.zshrc)');
    this.logger.info('2. Run "claude" to start the CLI');
    this.logger.info('3. You will be prompted to authenticate on first use');
    this.logger.info('4. For VS Code integration, run "code ." then "claude" in the terminal');
    this.logger.info('');
    this.logger.info('For more information, visit: https://claude.ai/code');
    return true;
  }

  async configureShell() {
    // Shell configuration for Claude is now minimal
    // NVM default loading is handled by the shell module's tool-integrations section
    // This prevents duplicate NVM configurations
    this.logger.debug('Shell configuration for Claude completed');
  }

  async verify() {
    try {
      const result = await runShellScript(`
        # Unset npm_config_prefix to avoid NVM conflicts
        unset npm_config_prefix
        unset NPM_CONFIG_PREFIX
        
        # Source NVM if available
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" 2>/dev/null
        
        # Add npm-global to PATH
        export PATH="$HOME/.npm-global/bin:$PATH"
        
        # Try to find and run claude from various locations
        if which claude >/dev/null 2>&1; then
          claude --version
        elif [ -x "$HOME/.npm-global/bin/claude" ]; then
          "$HOME/.npm-global/bin/claude" --version
        else
          # Try to find claude in NVM directories
          for dir in "$HOME/.nvm/versions/node/"*/bin; do
            if [ -x "$dir/claude" ]; then
              "$dir/claude" --version
              exit 0
            fi
          done
          exit 1
        fi
      `, { silent: true }); // Run silently to avoid red error text
      this.logger.debug(`Claude Code version: ${result.stdout.trim()}`);
      return true;
    } catch {
      return false;
    }
  }
}
