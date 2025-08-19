import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import inquirer from 'inquirer';
import { isWSL } from '../../utils/platform.js';
import { runCommand, checkCommandExists } from '../../utils/shell.js';
import { BaseInstaller } from './base.js';
import { readModification, updateModification, getCurrentVersion } from './change-index.js';

export class ShellInstaller extends BaseInstaller {
  constructor(module, options = {}) {
    super(module, options);
    this.selectedShell = null;
    this.shellConfig = null;
  }

  async getAvailableLocale() {
    try {
      // Check available locales
      const { stdout } = await runCommand('locale', ['-a'], { returnOutput: true });
      const locales = stdout.split('\n').filter(l => l.trim());
      
      // Preferred locales in order
      const preferredLocales = [
        'en_US.UTF-8',
        'en_US.utf8',
        'C.UTF-8',
        'C.utf8'
      ];
      
      // Find the first available preferred locale
      for (const locale of preferredLocales) {
        if (locales.some(l => l.toLowerCase() === locale.toLowerCase())) {
          // Normalize the locale name
          if (locale.toLowerCase().includes('c.utf')) {
            return 'C.UTF-8';
          }
          return locale;
        }
      }
      
      // If no UTF-8 locale found, return empty (don't set locale)
      return '';
    } catch (error) {
      // If locale command fails, use safe default
      return 'C.UTF-8';
    }
  }

  async ensureLogoFile() {
    try {
      const destLogo = path.join(os.homedir(), '.sigao-logo.ans');
      
      // Check if logo already exists
      if (await this.pathExists(destLogo)) {
        return;
      }
      
      // Find the logo.ans file in the package
      const currentFileUrl = new URL(import.meta.url);
      const packageRoot = path.dirname(path.dirname(currentFileUrl.pathname));
      const sourceLogo = path.join(packageRoot, 'logo.ans');
      
      // Copy the logo file
      await fs.copyFile(sourceLogo, destLogo);
      this.logger.success('Logo copied to ~/.sigao-logo.ans');
    } catch (error) {
      this.logger.debug(`Could not copy logo file: ${error.message}`);
    }
  }

  async collectConfig() {
    const { shellChoice } = await inquirer.prompt([{
      type: 'list',
      name: 'shellChoice',
      message: 'Which shell would you like to use?',
      choices: [
        { name: 'Bash (default, stable, POSIX-compliant)', value: 'bash' },
        { name: 'Zsh with Oh My Zsh (modern features, better completions)', value: 'zsh' }
      ],
      default: 'bash'
    }]);

    return { selectedShell: shellChoice };
  }

  preInstall() {
    // Configuration is now collected upfront
    if (!this.selectedShell) {
      this.logger.warn('No shell selected, defaulting to bash');
      this.selectedShell = 'bash';
    }
    return true;
  }

  async isInstalled() {
    // Check if the selected shell is installed and configured
    if (this.selectedShell === 'zsh') {
      const zshInstalled = await checkCommandExists('zsh');
      const ohmyzshInstalled = await this.pathExists(path.join(os.homedir(), '.oh-my-zsh'));
      return zshInstalled && ohmyzshInstalled;
    }
    return true; // Bash is always available
  }

  async install() {
    // First, repair any existing locale issues
    await this.repairLocaleConfig();
    
    if (this.selectedShell === 'zsh') {
      await this.installZsh();
    } else {
      await this.enhanceBash();
    }

    // Configure WSL-specific PATH cleanup if needed
    if (isWSL()) {
      await this.configureWSLPath();
    }
  }

  async postInstall() {
    // Always update WSL PATH cleanup on postInstall, even if shell was already installed
    // This ensures users get the latest PATH cleanup logic
    if (isWSL()) {
      this.logger.info('Updating WSL PATH cleanup configuration...');
      await this.configureWSLPath();
    }
  }

  async repairLocaleConfig() {
    // DEPRECATED: This method previously did global search/replace which could
    // modify content inside SIGAO_MOD blocks managed by other modules.
    // Locale configuration is now properly handled by each shell setup method
    // using the correct locale from getAvailableLocale() at install time.
    // This method is kept for backward compatibility but does nothing.
    this.logger.debug('repairLocaleConfig is deprecated - locale handled by shell setup');
  }

  async installZsh() {
    // Install Zsh
    if (!await checkCommandExists('zsh')) {
      this.logger.info('Installing Zsh...');
      await runCommand('sudo', ['apt', 'update']);
      await runCommand('sudo', ['apt', 'install', '-y', 'zsh']);
    }

    // Get Zsh path
    const { stdout: zshPath } = await runCommand('which', ['zsh']);
    const cleanZshPath = zshPath.trim();

    // Add to /etc/shells if needed
    try {
      const shells = await fs.readFile('/etc/shells', 'utf8');
      if (!shells.includes(cleanZshPath)) {
        const { runShellScript } = await import('../../utils/shell.js');
        await runShellScript(`echo "${cleanZshPath}" | sudo tee -a /etc/shells`);
      }
    } catch (_error) {
      this.logger.warn('Could not update /etc/shells');
    }

    // Set as default shell
    const currentShell = process.env.SHELL;
    if (currentShell !== cleanZshPath) {
      this.logger.info('Setting Zsh as default shell...');
      try {
        await runCommand('sudo', ['chsh', '-s', cleanZshPath, process.env.USER]);
        this.logger.success('Default shell changed to Zsh (requires logout/login)');
      } catch (_error) {
        this.logger.warn('Could not change default shell automatically');
      }
    }

    // Install Oh My Zsh
    const ohmyzshPath = path.join(os.homedir(), '.oh-my-zsh');
    if (!await this.pathExists(ohmyzshPath)) {
      this.logger.info('Installing Oh My Zsh...');
      const { runShellScript } = await import('../../utils/shell.js');
      await runShellScript('curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh | sh -s -- --unattended');

      // Remove the default .zshrc that Oh My Zsh created
      const zshrcPath = path.join(os.homedir(), '.zshrc');
      const zshrcBackup = path.join(os.homedir(), '.zshrc.omz-default');
      try {
        await fs.rename(zshrcPath, zshrcBackup);
        this.logger.info('Backed up Oh My Zsh default config to .zshrc.omz-default');
      } catch (error) {
        this.logger.debug('Could not backup default .zshrc: ' + error.message);
      }

      // Install useful plugins
      this.logger.info('Installing Zsh plugins...');
      const customPlugins = path.join(ohmyzshPath, 'custom/plugins');
      const customThemes = path.join(ohmyzshPath, 'custom/themes');

      // Clone plugins if they don't exist
      const autoSuggestPath = `${customPlugins}/zsh-autosuggestions`;
      if (!await this.pathExists(autoSuggestPath)) {
        await runCommand('git', ['clone', 'https://github.com/zsh-users/zsh-autosuggestions', autoSuggestPath]);
      }

      const syntaxHighlightPath = `${customPlugins}/zsh-syntax-highlighting`;
      if (!await this.pathExists(syntaxHighlightPath)) {
        await runCommand('git', ['clone', 'https://github.com/zsh-users/zsh-syntax-highlighting.git', syntaxHighlightPath]);
      }

      const powerlevel10kPath = `${customThemes}/powerlevel10k`;
      if (!await this.pathExists(powerlevel10kPath)) {
        await runCommand('git', ['clone', '--depth=1', 'https://github.com/romkatv/powerlevel10k.git', powerlevel10kPath]);
      }
    }

    // Create our Sigao zsh configuration
    await this.createSigaoZshrc();

    this.shellConfig = path.join(os.homedir(), '.zshrc');
  }

  async createSigaoZshrc() {
    const sigaoZshrcPath = path.join(os.homedir(), '.sigao.zshrc');
    const zshrcPath = path.join(os.homedir(), '.zshrc');
    
    // Get available locale
    const availableLocale = await this.getAvailableLocale();
    const localeConfig = availableLocale ? `# ========================================
# LOCALE CONFIGURATION
# ========================================
export LANG=${availableLocale}
export LC_ALL=${availableLocale}

` : '';

    // Copy logo file if it doesn't exist
    await this.ensureLogoFile();

    // Build the complete .sigao.zshrc content
    const sigaoZshrcContent = `#!/usr/bin/env zsh
# ========================================
# SIGAO ZSH CONFIGURATION
# ========================================
# This file contains all Sigao-specific Zsh configurations
# It is sourced from ~/.zshrc

${localeConfig}# ========================================
# LOGO DISPLAY
# ========================================
# Display Sigao logo on terminal start (only in interactive shells)
if [[ $- == *i* ]] && [ -f ~/.sigao-logo.ans ]; then
    # Use backslash cat to bypass any aliases and display raw content
    \\cat ~/.sigao-logo.ans 2>/dev/null || /bin/cat ~/.sigao-logo.ans 2>/dev/null
    echo ""  # Add a blank line after the logo
fi

# ========================================
# OH MY ZSH CONFIGURATION
# ========================================
export ZSH="$HOME/.oh-my-zsh"

# Set theme to powerlevel10k
ZSH_THEME="powerlevel10k/powerlevel10k"

# Plugins
plugins=(git docker direnv zsh-autosuggestions zsh-syntax-highlighting)

# Load Oh My Zsh
source $ZSH/oh-my-zsh.sh

# ========================================
# ENVIRONMENT & PATH SETUP
# ========================================
# Add local bin to PATH
export PATH="$HOME/.local/bin:$PATH"

# Add cargo/rust to PATH if exists
[ -d "$HOME/.cargo/bin" ] && export PATH="$HOME/.cargo/bin:$PATH"

# ========================================
# TOOL INTEGRATIONS
# ========================================
# FZF integration
[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh

# Direnv integration
command -v direnv &>/dev/null && eval "$(direnv hook zsh)"

# NVM integration (if installed)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \\. "$NVM_DIR/bash_completion"

# Pyenv integration (if installed)
if [ -d "$HOME/.pyenv" ]; then
    export PYENV_ROOT="$HOME/.pyenv"
    export PATH="$PYENV_ROOT/bin:$PATH"
    command -v pyenv &>/dev/null && eval "$(pyenv init -)"
    command -v pyenv &>/dev/null && eval "$(pyenv virtualenv-init -)"
fi

# ========================================
# ALIASES & FUNCTIONS
# ========================================
# Note: Additional aliases and functions are added by shell-enhancements module
`;

    // Write the complete .sigao.zshrc file
    await fs.writeFile(sigaoZshrcPath, sigaoZshrcContent);
    this.logger.success('Created ~/.sigao.zshrc configuration file');

    // Now create/update the main .zshrc to source our config
    const zshrcContent = `#!/usr/bin/env zsh
# ========================================
# MAIN ZSH CONFIGURATION
# ========================================
# This file sources the Sigao configuration
# All customizations are in ~/.sigao.zshrc

# Source Sigao configuration
if [ -f ~/.sigao.zshrc ]; then
    source ~/.sigao.zshrc
fi

# You can add your own customizations below this line
`;

    await fs.writeFile(zshrcPath, zshrcContent);
    this.logger.success('Created minimal .zshrc that sources ~/.sigao.zshrc');
  }

  async enhanceBash() {
    this.logger.info('Enhancing Bash configuration...');

    // Install bash completion
    await runCommand('sudo', ['apt', 'update']);
    await runCommand('sudo', ['apt', 'install', '-y', 'bash-completion']);

    const bashrcPath = path.join(os.homedir(), '.bashrc');
    
    // Ensure file exists
    try {
      await fs.access(bashrcPath);
    } catch {
      await fs.writeFile(bashrcPath, '');
    }
    
    // Get available locale
    const availableLocale = await this.getAvailableLocale();
    const localeConfig = availableLocale ? `
# Set locale to avoid warnings
export LANG=${availableLocale}
export LC_ALL=${availableLocale}` : '';

    // Copy logo file if it doesn't exist
    await this.ensureLogoFile();
    
    const version = getCurrentVersion();

    // Add logo display
    const logoDisplay = `# Display Sigao logo on terminal start (only in interactive shells)
if [[ $- == *i* ]] && [ -f ~/.sigao-logo.ans ]; then
    # Use backslash cat to bypass any aliases and display raw content
    \\cat ~/.sigao-logo.ans 2>/dev/null || /bin/cat ~/.sigao-logo.ans 2>/dev/null
    echo ""  # Add a blank line after the logo
fi`;
    await updateModification(bashrcPath, 'logo-display', logoDisplay, version);

    // Add bash enhancements
    const bashEnhancements = `# Enhanced Bash Configuration
# Enable programmable completion
if [ -f /etc/bash_completion ] && ! shopt -oq posix; then
    . /etc/bash_completion
fi

# Better history
export HISTCONTROL=ignoredups:erasedups
export HISTSIZE=10000
export HISTFILESIZE=20000
shopt -s histappend
${localeConfig}

# Useful aliases
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'
alias ..='cd ..'
alias ...='cd ../...'

# Enable color support
if [ -x /usr/bin/dircolors ]; then
    test -r ~/.dircolors && eval "$(dircolors -b ~/.dircolors)" || eval "$(dircolors -b)"
    alias ls='ls --color=auto'
    alias grep='grep --color=auto'
    alias fgrep='fgrep --color=auto'
    alias egrep='egrep --color=auto'
fi`;
    await updateModification(bashrcPath, 'bash-enhancements', bashEnhancements, version);

    this.shellConfig = bashrcPath;
  }

  async configureWSLPath() {
    this.logger.info('Configuring WSL PATH cleanup...');

    if (!this.shellConfig) return;

    // Check if modification already exists
    const existing = await readModification(this.shellConfig, 'wsl-path-cleanup');
    if (existing && !existing.hasDrift) {
      this.logger.debug('WSL PATH cleanup already configured and unchanged');
      return;
    }
    
    if (existing && existing.hasDrift) {
      this.logger.warn('WSL PATH cleanup has been manually modified, updating...');
    }

    // The old manual regex removal is no longer needed because updateModification
    // will properly replace any existing wsl-path-cleanup SIGAO_MOD block.
    // This ensures we don't accidentally remove content outside of SIGAO_MOD blocks.

    // Define the WSL path cleanup content
    const wslPathCleanupContent = `# ========================================
# WSL PATH CLEANUP
# ========================================
# Remove Windows Node/npm paths that can conflict with WSL Node installations
if [[ -n "$WSL_DISTRO_NAME" ]]; then
    # Create new PATH by filtering out Node.js/npm related Windows paths
    NEW_PATH=""
    
    # Split PATH and filter (works for both bash and zsh)
    if [[ -n "$ZSH_VERSION" ]]; then
        # Zsh syntax
        PATH_ARRAY=("\${(@s/:/)PATH}")
    else
        # Bash syntax
        IFS=':' read -ra PATH_ARRAY <<< "$PATH"
    fi
    
    for path_entry in "\${PATH_ARRAY[@]}"; do
        # Check if path is from Windows (starts with /mnt/) and contains Node.js/npm
        if [[ "$path_entry" == /mnt/* ]]; then
            # Convert to lowercase for case-insensitive comparison
            if [[ -n "$ZSH_VERSION" ]]; then
                path_lower="\${path_entry:l}"
            else
                path_lower="\$(echo "$path_entry" | tr '[:upper:]' '[:lower:]')"
            fi
            
            # Skip Node.js/npm and VS Code related paths
            # Check for Node.js related paths
            node_patterns='/(nodejs|node\.js|npm|npm-cache|nvm|yarn|pnpm|bun|deno|fnm|volta)'
            node_patterns="\$node_patterns|n/versions|chocolatey/lib/nodejs"
            node_patterns="\$node_patterns|program files/nodejs|program files \\(x86\\)/nodejs"
            node_patterns="\$node_patterns|appdata/roaming/npm|appdata/local/yarn"
            node_patterns="\$node_patterns|appdata/local/pnpm|appdata/local/fnm|appdata/local/volta"
            
            # Check for VS Code related paths
            vscode_patterns='microsoft vs code|visual studio code|vscode'
            
            if echo "\$path_lower" | \\grep -qE "\$node_patterns|\$vscode_patterns" 2>/dev/null || echo "\$path_lower" | /bin/grep -qE "\$node_patterns|\$vscode_patterns"; then
                # Skip this path - it's Node.js or VS Code related
                continue
            fi
        fi
        
        # Keep all other paths (Windows and WSL)
        if [[ -n "$NEW_PATH" ]]; then
            NEW_PATH="$NEW_PATH:$path_entry"
        else
            NEW_PATH="$path_entry"
        fi
    done
    
    # Set the cleaned PATH
    export PATH="$NEW_PATH"
    
    # Add snap to PATH if it exists (for WSL)
    if [ -d "/snap/bin" ] && [[ ":$PATH:" != *":/snap/bin:"* ]]; then
        export PATH="$PATH:/snap/bin"
    fi
fi`;

      // Use updateModification to add or update the WSL path cleanup
      await updateModification(this.shellConfig, 'wsl-path-cleanup', wslPathCleanupContent, getCurrentVersion(), { position: 'start' });
  }

  async verify() {
    if (this.selectedShell === 'zsh') {
      const [zshExists, ohmyzshExists] = await Promise.all([
        checkCommandExists('zsh'),
        this.pathExists(path.join(os.homedir(), '.oh-my-zsh'))
      ]);
      return zshExists && ohmyzshExists;
    }
    return true;
  }

  async pathExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}
