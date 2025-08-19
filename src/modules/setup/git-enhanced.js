import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { isWSL } from '../../utils/platform.js';
import { runCommand, checkCommandExists } from '../../utils/shell.js';
import { BaseInstaller } from './base.js';

export class GitEnhancedInstaller extends BaseInstaller {
  constructor(module, options = {}) {
    super(module, options);
    this.gitName = null;
    this.gitEmail = null;
    this.applyRecommended = false;
    this.configureWSLCredentials = false;
  }

  async collectConfig() {
    // Get current Git config
    let currentName = '';
    let currentEmail = '';

    try {
      const { stdout: name } = await runCommand('git', ['config', '--global', 'user.name'], { silent: true });
      currentName = name.trim();
    } catch {
      // Ignore error if git config is not set
    }

    try {
      const { stdout: email } = await runCommand('git', ['config', '--global', 'user.email'], { silent: true });
      currentEmail = email.trim();
    } catch {
      // Ignore error if git config is not set
    }

    // Show current values if they exist
    if (currentName) {
      console.log(chalk.gray(`  Current Git name: ${currentName}`));
    }
    if (currentEmail) {
      console.log(chalk.gray(`  Current Git email: ${currentEmail}`));
    }

    const config = {
      gitName: null,
      gitEmail: null,
      applyRecommended: false,
      configureWSLCredentials: false
    };

    // Prompt for Git configuration
    const { configureGit } = await inquirer.prompt([{
      type: 'confirm',
      name: 'configureGit',
      message: 'Configure Git user name and email?',
      default: !currentName || !currentEmail
    }]);

    if (configureGit) {
      const gitAnswers = await inquirer.prompt([
        {
          type: 'input',
          name: 'gitName',
          message: 'Enter your Git user name:',
          default: currentName,
          validate: input => input.trim().length > 0 || 'Name cannot be empty'
        },
        {
          type: 'input',
          name: 'gitEmail',
          message: 'Enter your Git email:',
          default: currentEmail,
          validate: input => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(input) || 'Please enter a valid email';
          }
        },
        {
          type: 'confirm',
          name: 'applyRecommended',
          message: 'Configure recommended Git settings?',
          default: true
        }
      ]);

      config.gitName = gitAnswers.gitName;
      config.gitEmail = gitAnswers.gitEmail;
      config.applyRecommended = gitAnswers.applyRecommended;
    }

    // WSL Git Credential Manager
    if (isWSL()) {
      const { useWSLCredentials } = await inquirer.prompt([{
        type: 'confirm',
        name: 'useWSLCredentials',
        message: 'Use Windows Git Credential Manager in WSL?',
        default: true
      }]);
      config.configureWSLCredentials = useWSLCredentials;
    }

    return config;
  }

  preInstall() {
    // Configuration is now collected upfront
    return true;
  }

  async isInstalled() {
    // Check if git is configured with user name and email
    try {
      const { stdout: name } = await runCommand('git', ['config', '--global', 'user.name'], { silent: true });
      const { stdout: email } = await runCommand('git', ['config', '--global', 'user.email'], { silent: true });
      return !!(name.trim() && email.trim());
    } catch {
      return false;
    }
  }

  async detectWindowsGitCredentialManager() {
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
    return null;
  }

  async install() {
    this.logger.info('Setting up Git configuration...');

    // Set user name and email if provided
    if (this.gitName) {
      await runCommand('git', ['config', '--global', 'user.name', this.gitName]);
      this.logger.success(`Git user name set to: ${this.gitName}`);
    }

    if (this.gitEmail) {
      await runCommand('git', ['config', '--global', 'user.email', this.gitEmail]);
      this.logger.success(`Git email set to: ${this.gitEmail}`);
    }

    // Apply recommended settings
    if (this.applyRecommended) {
      this.logger.info('Applying recommended Git settings...');

      const configs = [
        ['init.defaultBranch', 'main'],
        ['pull.rebase', 'false'],
        ['fetch.prune', 'true'],
        ['rerere.enabled', 'true'],
        ['diff.colorMoved', 'zebra'],
        ['color.ui', 'auto']
      ];

      for (const [key, value] of configs) {
        try {
          await runCommand('git', ['config', '--global', key, value]);
          this.logger.debug(`Set git config ${key}=${value}`);
        } catch (_error) {
          this.logger.debug(`Failed to set ${key}: ${_error.message}`);
        }
      }

      this.logger.success('Recommended Git settings applied');
    }

    // Configure WSL Git Credential Manager
    if (this.configureWSLCredentials && isWSL()) {
      this.logger.info('Configuring Git Credential Manager for WSL...');

      const gcmPath = await this.detectWindowsGitCredentialManager();
      if (gcmPath) {
        await runCommand('git', ['config', '--global', 'credential.helper', gcmPath]);
        // Also configure for Azure DevOps
        await runCommand('git', ['config', '--global', 'credential.https://dev.azure.com.useHttpPath', 'true']);
        this.logger.success('Git Credential Manager configured for WSL');
        this.logger.info('You can now use your Windows Git credentials in WSL');
      } else {
        this.logger.warn('Windows Git Credential Manager not found');
        this.logger.info('Using default credential storage');
        await runCommand('git', ['config', '--global', 'credential.helper', 'store']);
      }
    } else if (!isWSL()) {
      // Configure standard credential helper
      await runCommand('git', ['config', '--global', 'credential.helper', 'store']);
    }

    this.logger.success('Git configuration complete');

    // GitHub CLI authentication
    if (await checkCommandExists('gh')) {
      this.logger.info('Setting up GitHub authentication...');

      try {
        // Check if already authenticated
        let isAuthenticated = false;
        try {
          await runCommand('gh', ['auth', 'status'], { silent: true });
          isAuthenticated = true;
        } catch {
          // Not authenticated
        }

        if (!isAuthenticated) {
          this.logger.info('GitHub CLI is not authenticated.');
          this.logger.info('We need to authenticate to set up SSH keys for GitHub.');
          this.logger.info('');

          // Use regular gh auth login which handles WSL/device code automatically
          try {
            this.logger.info('Starting GitHub authentication...');
            this.logger.info('Follow the prompts to authenticate.');
            this.logger.info('');

            // Import spawn for better interactive command handling
            const { spawn } = await import('child_process');
            // promisify not needed - removed

            // Run gh auth login with proper interactive handling
            await new Promise((resolve, reject) => {
              const timeoutId = setTimeout(() => {
                authProcess.kill('SIGTERM');
                reject(new Error('GitHub authentication timed out after 2 minutes'));
              }, 120000); // 2 minutes timeout

              const authProcess = spawn('gh', ['auth', 'login', '--git-protocol', 'ssh'], {
                stdio: 'inherit',
                shell: false
              });

              authProcess.on('exit', (code, signal) => {
                // Clear timeout when process exits
                if (timeoutId) {
                  clearTimeout(timeoutId);
                }

                if (code === 0) {
                  resolve();
                } else if (signal) {
                  reject(new Error(`GitHub authentication was terminated by signal ${signal}`));
                } else {
                  reject(new Error(`GitHub authentication failed with code ${code}`));
                }
              });

              authProcess.on('error', error => {
                if (timeoutId) {
                  clearTimeout(timeoutId);
                }
                reject(error);
              });

              // Timeout already set above
            });

            // Small delay to ensure output is flushed
            await new Promise(resolve => setTimeout(resolve, 500));

            this.logger.success('GitHub authentication complete!');
            isAuthenticated = true;
          } catch (authError) {
            if (authError.message.includes('timed out')) {
              this.logger.warn('GitHub authentication timed out after 2 minutes');
            } else {
              this.logger.warn(`GitHub authentication failed: ${authError.message}`);
            }

            this.logger.info('');
            this.logger.info('To complete authentication manually, run after installation:');
            this.logger.info('  gh auth login');
            this.logger.info('');
          }
        } else {
          this.logger.info('Already authenticated with GitHub');
        }

        // Always attempt to set up SSH key (will create key even if not authenticated)
        await this.setupSSHKey(isAuthenticated);

      } catch (_error) {
        this.logger.warn('GitHub authentication setup failed - you can run "gh auth login" manually later');
      }
    }
  }

  async setupSSHKey(isAuthenticated = false) {
    const homeDir = os.homedir();
    const sshDir = path.join(homeDir, '.ssh');
    const sshKeyPath = path.join(sshDir, 'id_ed25519');

    try {
      // Check if SSH key already exists
      await fs.access(sshKeyPath);
      this.logger.info('SSH key already exists');

      // Add key to GitHub if authenticated
      if (isAuthenticated) {
        await this.addSSHKeyToGitHub(sshKeyPath);
      } else {
        this.logger.info('SSH key exists but GitHub authentication required to add it');
        this.displaySSHKeyInstructions(sshKeyPath);
      }

    } catch {
      // SSH key doesn't exist, create one
      this.logger.info('Generating SSH key for GitHub...');

      // Ensure .ssh directory exists
      await fs.mkdir(sshDir, { recursive: true, mode: 0o700 });

      // Generate SSH key
      const email = this.gitEmail || 'your-email@example.com';
      await runCommand('ssh-keygen', [
        '-t', 'ed25519',
        '-C', email,
        '-f', sshKeyPath,
        '-N', '' // No passphrase for automation
      ]);

      // Set proper permissions
      await fs.chmod(sshKeyPath, 0o600);
      await fs.chmod(`${sshKeyPath}.pub`, 0o644);

      this.logger.success('SSH key generated');

      // Add key to GitHub if authenticated
      if (isAuthenticated) {
        await this.addSSHKeyToGitHub(sshKeyPath);
      } else {
        this.logger.info('SSH key created but GitHub authentication required to add it');
        this.displaySSHKeyInstructions(sshKeyPath);
      }
    }
  }

  async addSSHKeyToGitHub(sshKeyPath) {
    try {
      // Read the public key
      const publicKey = await fs.readFile(`${sshKeyPath}.pub`, 'utf8');

      // Check if this key is already added to GitHub
      const { stdout: existingKeys } = await runCommand('gh', ['ssh-key', 'list'], { silent: true });

      if (existingKeys.includes(publicKey.split(' ')[1])) {
        this.logger.info('SSH key is already added to GitHub');
        return;
      }

      // Add SSH key to GitHub
      const hostname = os.hostname();
      const title = `${hostname} - Sigao DevKit`;

      await runCommand('gh', ['ssh-key', 'add', `${sshKeyPath}.pub`, '--title', title]);

      this.logger.success('SSH key added to GitHub');
      this.logger.info('');
      this.logger.info('🔑 SSH Authentication Setup Complete!');
      this.logger.info('');
      this.logger.info('Your SSH key has been generated and added to your GitHub account.');
      this.logger.info('');
      this.logger.info('To use SSH with GitHub:');
      this.logger.info('1. Clone repositories using SSH URLs:');
      this.logger.info('   git clone git@github.com:username/repository.git');
      this.logger.info('');
      this.logger.info('2. For existing repositories, switch to SSH:');
      this.logger.info('   git remote set-url origin git@github.com:username/repository.git');
      this.logger.info('');
      this.logger.info('3. Test your SSH connection:');
      this.logger.info('   ssh -T git@github.com');
      this.logger.info('');
      this.logger.info('Your SSH public key is located at: ~/.ssh/id_ed25519.pub');

    } catch (_error) {
      this.logger.warn('Could not automatically add SSH key to GitHub');
      this.logger.info('You can manually add your SSH key by running:');
      this.logger.info(`  gh ssh-key add ${sshKeyPath}.pub`);
    }
  }

  displaySSHKeyInstructions(sshKeyPath) {
    this.logger.info('');
    this.logger.info('🔑 SSH Key Setup Instructions:');
    this.logger.info('');
    this.logger.info('1. First authenticate with GitHub:');
    this.logger.info('   gh auth login');
    this.logger.info('');
    this.logger.info('2. Then add your SSH key to GitHub:');
    this.logger.info(`   gh ssh-key add ${sshKeyPath}.pub --title "$(hostname) - Sigao DevKit"`);
    this.logger.info('');
    this.logger.info('3. Test your connection:');
    this.logger.info('   ssh -T git@github.com');
    this.logger.info('');
  }

  async verify() {
    // Verify git is available and configured
    if (!await checkCommandExists('git')) {
      return false;
    }

    try {
      const { stdout: name } = await runCommand('git', ['config', '--global', 'user.name'], { silent: true });
      const { stdout: email } = await runCommand('git', ['config', '--global', 'user.email'], { silent: true });
      return !!(name.trim() && email.trim());
    } catch {
      return false;
    }
  }
}
