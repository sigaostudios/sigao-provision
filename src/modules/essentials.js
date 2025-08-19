import { runCommand, runWithSpinner, runWithProgressiveSpinner, checkCommandExists } from '../utils/shell.js';
import { getPackageManager, getPlatform } from '../utils/platform.js';
import { BaseInstaller } from './base.js';

export class EssentialsInstaller extends BaseInstaller {
  constructor(module, options) {
    super(module, options);
    this.packages = ['git', 'gh', 'ripgrep', 'curl', 'wget', 'unzip'];
    this.platform = getPlatform();
  }

  async isInstalled() {
    const commands = {
      'git': 'git',
      'gh': 'gh',
      'ripgrep': 'rg',
      'curl': 'curl',
      'wget': 'wget',
      'unzip': 'unzip'
    };

    for (const [pkg, cmd] of Object.entries(commands)) {
      if (!await checkCommandExists(cmd)) {
        this.logger.debug(`${pkg} (${cmd}) not found`);
        return false;
      }
    }
    return true;
  }

  async getPackageNames() {
    const pm = await getPackageManager();

    // Map package names for different package managers
    const packageMap = {
      'apt': {
        'git': 'git',
        'gh': 'gh',
        'ripgrep': 'ripgrep',
        'curl': 'curl',
        'wget': 'wget',
        'unzip': 'unzip'
      },
      'brew': {
        'git': 'git',
        'gh': 'gh',
        'ripgrep': 'ripgrep',
        'curl': 'curl',
        'wget': 'wget',
        'unzip': 'unzip'
      },
      'dnf': {
        'git': 'git',
        'gh': 'gh',
        'ripgrep': 'ripgrep',
        'curl': 'curl',
        'wget': 'wget',
        'unzip': 'unzip'
      },
      'pacman': {
        'git': 'git',
        'gh': 'github-cli',
        'ripgrep': 'ripgrep',
        'curl': 'curl',
        'wget': 'wget',
        'unzip': 'unzip'
      }
    };

    const mapping = packageMap[pm?.cmd] || packageMap['apt'];
    return this.packages.map(pkg => mapping[pkg] || pkg);
  }

  async install() {
    const pm = await getPackageManager();

    if (!pm) {
      throw new Error('No supported package manager found');
    }

    const packages = await this.getPackageNames();

    // Update package lists first
    if (pm.update) {
      await runWithProgressiveSpinner('Updating package lists...', async (spinner, updateProgress) => {
        const [updateCmd, ...updateArgs] = pm.update.split(' ');
        try {
          updateProgress('Downloading package information...');
          await runCommand(updateCmd, updateArgs, {
            sudo: pm.needsSudo,
            timeout: 120000 // 2 minutes timeout for apt update
          });
          updateProgress('Package lists updated successfully');
        } catch (_error) {
          updateProgress('Package list update failed, continuing...');
          this.logger.warn(`Package list update failed: ${_error.message}`);
          this.logger.info('Continuing with installation...');
        }
      });
    }

    // Install packages
    await runWithSpinner(`Installing ${packages.join(', ')}...`, async () => {
      const [installCmd, ...installArgs] = pm.install.split(' ');
      await runCommand(installCmd, [...installArgs, ...packages], { sudo: pm.needsSudo });
    });
  }

  async verify() {
    const verifications = [
      { name: 'Git', cmd: ['git', '--version'] },
      { name: 'GitHub CLI', cmd: ['gh', '--version'] },
      { name: 'ripgrep', cmd: ['rg', '--version'] }
    ];

    for (const { name, cmd } of verifications) {
      try {
        const result = await runCommand(cmd[0], cmd.slice(1));
        this.logger.debug(`${name}: ${result.stdout.split('\n')[0]}`);
      } catch (_error) {
        this.logger.error(`${name} verification failed`);
        return false;
      }
    }

    return true;
  }
}
