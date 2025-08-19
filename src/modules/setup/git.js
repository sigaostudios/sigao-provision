import fs from 'fs/promises';
import { runCommand, checkCommandExists } from '../../utils/shell.js';
import { getPlatform, isWSL } from '../../utils/platform.js';
import { BaseInstaller } from './base.js';

export class GitInstaller extends BaseInstaller {
  constructor(module, options) {
    super(module, options);
    this.platform = getPlatform();
  }

  async isInstalled() {
    // Check if git config for credential helper is set
    try {
      const result = await runCommand('git', ['config', '--global', 'credential.helper'], { silent: true });
      return result.stdout.trim().length > 0;
    } catch {
      return false;
    }
  }

  async detectCredentialHelper() {
    if (isWSL()) {
      // Check for Windows Git Credential Manager
      const possiblePaths = [
        '/mnt/c/Program Files/Git/mingw64/bin/git-credential-manager.exe',
        '/mnt/c/Program Files/Git/mingw64/libexec/git-core/git-credential-manager.exe',
        '/mnt/c/Program Files (x86)/Git/mingw64/bin/git-credential-manager.exe'
      ];

      for (const gcmPath of possiblePaths) {
        try {
          await fs.access(gcmPath);
          this.logger.info(`Found Git Credential Manager at: ${gcmPath}`);
          return gcmPath.replace(/ /g, '\\ ');
        } catch {
          // Continue checking
        }
      }
    }

    // Check for system credential helpers
    const helpers = ['manager', 'manager-core', 'osxkeychain', 'libsecret', 'gnome-keyring'];
    for (const helper of helpers) {
      if (await checkCommandExists(`git-credential-${helper}`)) {
        return helper;
      }
    }

    return null;
  }

  async install() {
    const credentialHelper = this.options.credentialHelper === 'auto'
      ? await this.detectCredentialHelper()
      : this.options.credentialHelper;

    if (!credentialHelper) {
      this.logger.warn('No credential helper detected. Git will prompt for credentials.');
      return;
    }

    // Set credential helper
    await runCommand('git', ['config', '--global', 'credential.helper', credentialHelper]);
    this.logger.success(`Set credential helper to: ${credentialHelper}`);

    // Additional config for Azure DevOps if using Windows credential manager
    if (credentialHelper.includes('git-credential-manager')) {
      await runCommand('git', [
        'config', '--global',
        'credential.https://dev.azure.com.useHttpPath',
        'true'
      ]);
      this.logger.info('Configured Git for Azure DevOps compatibility');
    }

    // Set some sensible defaults
    const configs = [
      ['init.defaultBranch', 'main'],
      ['pull.rebase', 'false'],
      ['fetch.prune', 'true']
    ];

    for (const [key, value] of configs) {
      try {
        await runCommand('git', ['config', '--global', key, value]);
        this.logger.debug(`Set git config ${key}=${value}`);
      } catch {
        // Ignore errors for optional configs
      }
    }
  }

  async postInstall() {
    // Check if user has set their name and email
    try {
      await runCommand('git', ['config', '--global', 'user.name']);
      await runCommand('git', ['config', '--global', 'user.email']);
    } catch {
      this.logger.warn('Git user name and email not configured.');
      this.logger.info('Run the following commands to set them:');
      this.logger.info('  git config --global user.name "Your Name"');
      this.logger.info('  git config --global user.email "your.email@example.com"');
    }
    return true;
  }

  async verify() {
    try {
      const helper = await runCommand('git', ['config', '--global', 'credential.helper']);
      this.logger.debug(`Credential helper configured: ${helper.stdout.trim()}`);
      return true;
    } catch {
      return false;
    }
  }
}
