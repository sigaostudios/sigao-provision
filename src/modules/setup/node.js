import path from 'path';
import os from 'os';
import fs from 'fs/promises';
import { runShellScript, checkCommandExists, runWithSpinner } from '../../utils/shell.js';
import { BaseInstaller } from './base.js';
import { readModification, updateModification, getCurrentVersion } from './change-index.js';

export class NodeInstaller extends BaseInstaller {
  constructor(module, options) {
    super(module, options);
    this.nvmVersion = 'v0.40.3';
    this.nodeVersion = options.nodeVersion || 'lts';
  }

  async isInstalled() {
    // Check if nvm is installed
    const nvmDir = path.join(os.homedir(), '.nvm');
    try {
      const nvmScript = path.join(nvmDir, 'nvm.sh');
      await fs.access(nvmScript);

      // Check if node is available
      return await checkCommandExists('node');
    } catch {
      return false;
    }
  }

  async install() {
    // Install NVM
    await runWithSpinner('Installing NVM...', async () => {
      try {
        const installScript = `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/${this.nvmVersion}/install.sh | bash`;
        const result = await runShellScript(installScript);
        this.logger.debug('NVM installation output:', result.stdout);
      } catch (_error) {
        this.logger.error('Failed to download/install NVM:', _error.message);
        throw new Error(`NVM installation failed: ${_error.message}`);
      }
    });

    // Verify NVM was installed
    const nvmDir = path.join(os.homedir(), '.nvm');
    const nvmScript = path.join(nvmDir, 'nvm.sh');
    try {
      await fs.access(nvmScript);
      this.logger.debug('NVM installation verified at:', nvmScript);
    } catch {
      throw new Error('NVM installation verification failed. The .nvm directory or nvm.sh script was not created.');
    }

    // Source NVM and install Node
    await runWithSpinner(`Installing Node.js ${this.nodeVersion}...`, async () => {
      try {
        const nvmCommands = `
          export NVM_DIR="$HOME/.nvm"
          [ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh"
          nvm install ${this.nodeVersion}
          nvm use ${this.nodeVersion}
          nvm alias default ${this.nodeVersion}
        `;
        const result = await runShellScript(nvmCommands);
        this.logger.debug('Node installation output:', result.stdout);
      } catch (_error) {
        this.logger.error('Failed to install Node.js:', _error.message);
        throw new Error(`Node.js installation failed: ${_error.message}`);
      }
    });

    // Skip npm upgrade - Node.js comes with a recent npm version
    // Upgrading npm can cause permission issues and is not necessary

    // Install global packages if specified
    if (this.module.options?.globalPackages?.length > 0) {
      await this.installGlobalPackages();
    }
  }

  async installGlobalPackages() {
    const packages = this.module.options.globalPackages;
    await runWithSpinner(`Installing global packages: ${packages.join(', ')}...`, async () => {
      try {
        const commands = `
          export NVM_DIR="$HOME/.nvm"
          [ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh"
          
          # Ensure we're using NVM's Node, not system Node
          nvm use default || nvm use ${this.nodeVersion}
          
          # Verify we're using the right npm
          which npm
          npm --version
          
          # Install packages globally
          npm install -g ${packages.join(' ')}
        `;
        const result = await runShellScript(commands);
        this.logger.debug('Global packages installation output:', result.stdout);
      } catch (_error) {
        // Check if it's a permission error with system npm
        if (_error.message.includes('EACCES') || _error.message.includes('permission denied')) {
          this.logger.warn('Permission error detected. This usually means system npm is being used instead of NVM.');
          this.logger.info('Skipping global package installation. You can install manually with:');
          this.logger.info(`  nvm use default && npm install -g ${packages.join(' ')}`);
          // Don't fail the entire installation
          return;
        }
        throw _error;
      }
    });
  }

  async postInstall() {
    // NVM configuration is now handled by the shell module's tool-integrations section
    // This prevents duplicate NVM configurations in shell files
    
    const shellName = this.globalConfig?.shellConfig || 'shell configuration';
    this.logger.info(`NVM has been installed successfully.`);
    this.logger.info(`Please restart your terminal or run: source ~/${shellName}`);

    return true;
  }

  async verify() {
    try {
      // Check NVM installation
      const nvmCheck = `
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh"
        nvm --version
      `;
      const nvmResult = await runShellScript(nvmCheck);
      this.logger.debug(`NVM version: ${nvmResult.stdout.trim()}`);

      // Check Node installation
      const nodeCheck = `
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh"
        node --version && npm --version
      `;
      const nodeResult = await runShellScript(nodeCheck);
      const [nodeVersion, npmVersion] = nodeResult.stdout.trim().split('\n');
      this.logger.debug(`Node ${nodeVersion}, npm ${npmVersion}`);

      return true;
    } catch (_error) {
      this.logger.error('Verification failed:', _error.message);
      return false;
    }
  }
}
