import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { runCommand, checkCommandExists } from '../utils/shell.js';
import { BaseInstaller } from './base.js';
import { readModification, updateModification, getCurrentVersion } from './change-index.js';

export class DirenvInstaller extends BaseInstaller {
  isInstalled() {
    return checkCommandExists('direnv');
  }

  async install() {
    this.logger.info('Installing direnv...');

    // Try Homebrew first if available
    if (await checkCommandExists('brew')) {
      try {
        await runCommand('brew', ['install', 'direnv']);
        this.logger.success('Direnv installed via Homebrew');
        await this.configureShellHooks();
        return;
      } catch (_error) {
        this.logger.debug('Failed to install via Homebrew, trying apt');
      }
    }

    // Skip on Windows
    if (process.platform === 'win32') {
      this.logger.warn('Direnv installation is not supported on Windows.');
      this.logger.info('Please use WSL for direnv functionality.');
      return;
    }

    // Install via apt
    try {
      await runCommand('sudo', ['apt', 'update']);
      await runCommand('sudo', ['apt', 'install', '-y', 'direnv']);
      this.logger.success('Direnv installed via apt');
    } catch (_error) {
      this.logger.error('Failed to install direnv');
      throw _error;
    }

    await this.configureShellHooks();
  }

  async configureShellHooks() {
    this.logger.info('Configuring direnv shell hooks...');

    // Get shell config files based on user selection
    const shellConfigs = this.getShellConfigFiles();
    const configFiles = shellConfigs.map(config => path.join(os.homedir(), config));
    const version = getCurrentVersion();

    for (const configFile of configFiles) {
      try {
        // Determine shell type based on config file name
        const shellType = configFile.endsWith('.zshrc') ? 'zsh' : 'bash';

        // Add direnv hook
        const direnvHookContent = `# Direnv configuration
command -v direnv &>/dev/null && eval "$(direnv hook ${shellType})"`;
        
        await updateModification(configFile, 'direnv-hook', direnvHookContent, version);
        this.logger.success(`Added direnv hook to ${path.basename(configFile)}`);

        // For Zsh with Oh My Zsh, also update the plugins
        if (shellType === 'zsh') {
          try {
            let content = await fs.readFile(configFile, 'utf8');
            
            // Check if we need to add direnv to plugins
            if (content.includes('plugins=(') && !content.match(/plugins=.*direnv/)) {
              // Find the existing oh-my-zsh-config SIGAO_MOD section
              const modPattern = /#<SIGAO_MOD\s+name=['"]oh-my-zsh-config['"][^>]*>([\s\S]*?)#<\/SIGAO_MOD>/;
              const modMatch = content.match(modPattern);
              
              if (modMatch) {
                let modContent = modMatch[1];
                
                // Update the plugins line within the SIGAO_MOD content
                modContent = modContent.replace(/plugins=\((.*?)\)/, (match, plugins) => {
                  const pluginList = plugins.trim().split(/\s+/);
                  if (!pluginList.includes('direnv')) {
                    pluginList.push('direnv');
                  }
                  return `plugins=(${pluginList.join(' ')})`;
                });
                
                // Update the modification
                await updateModification(configFile, 'oh-my-zsh-config', modContent.trim(), version);
                this.logger.success('Added direnv to Oh My Zsh plugins');
              }
            }
          } catch (_error) {
            this.logger.debug('Failed to add direnv to Oh My Zsh plugins');
          }
        }
      } catch (_error) {
        this.logger.warn(`Failed to configure direnv for ${configFile}`);
      }
    }

    // Create global direnv config
    const direnvConfigDir = path.join(os.homedir(), '.config', 'direnv');
    await fs.mkdir(direnvConfigDir, { recursive: true });

    // Create direnvrc with useful functions
    const direnvrcPath = path.join(direnvConfigDir, 'direnvrc');
    const direnvrcContent = `# Global direnv configuration

# Layout for Python projects
layout_python() {
  local python=$\{1:-python3}
  [[ $# -gt 0 ]] && shift
  unset PYTHONHOME
  if [[ -n $VIRTUAL_ENV ]]; then
    VIRTUAL_ENV=$(realpath "$\{VIRTUAL_ENV}")
  else
    local python_version
    python_version=$($python -c "import sys; print('.'.join(str(v) for v in sys.version_info[:2]))")
    if [[ -z $python_version ]]; then
      log_error "Could not detect Python version"
      return 1
    fi
    VIRTUAL_ENV=$PWD/.direnv/python-$python_version
  fi
  export VIRTUAL_ENV
  if [[ ! -d $VIRTUAL_ENV ]]; then
    log_status "no venv found; creating $VIRTUAL_ENV"
    $python -m venv "$VIRTUAL_ENV"
  fi
  
  PATH="$\{VIRTUAL_ENV}/bin:$\{PATH}"
  export PATH
}

# Layout for Node.js projects
layout_node() {
  PATH_add node_modules/.bin
  if [[ -f .nvmrc ]]; then
    use nvm
  fi
}

# Use nvm
use_nvm() {
  local node_version=$1

  if [[ -e .nvmrc && -z $node_version ]]; then
    node_version=$(cat .nvmrc)
  fi

  nvm_sh=~/.nvm/nvm.sh
  if [[ -e $nvm_sh ]]; then
    source $nvm_sh
    nvm use $node_version
  fi
}
`;

    await fs.writeFile(direnvrcPath, direnvrcContent);
    this.logger.success('Created global direnv configuration');

    // Create example .envrc template
    const templatePath = path.join(os.homedir(), '.config', 'direnv', 'envrc.example');
    const templateContent = `# Example .envrc file
# Copy this to your project root and customize

# Python project
# layout python3

# Node.js project  
# layout node
# use nvm

# Environment variables
# export API_KEY="your-key-here"
# export DATABASE_URL="postgresql://localhost/mydb"

# Path modifications
# PATH_add bin
# PATH_add scripts

# Load secrets from file (git-ignored)
# [[ -f .env.local ]] && source .env.local
`;

    await fs.writeFile(templatePath, templateContent);
    this.logger.info('Created example .envrc template at ~/.config/direnv/envrc.example');
  }

  verify() {
    return checkCommandExists('direnv');
  }

  postInstall() {
    this.logger.info('Direnv installed and configured!');
    this.logger.info('To use direnv in a project:');
    this.logger.info('  1. Create an .envrc file in your project root');
    this.logger.info('  2. Run: direnv allow');
    this.logger.info('');
    this.logger.info('Example .envrc saved at: ~/.config/direnv/envrc.example');
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
