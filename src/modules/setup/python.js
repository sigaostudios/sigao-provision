import path from 'path';
import fs from 'fs/promises';
import { getPlatform } from '../../utils/platform.js';
import { runCommand } from '../../utils/shell.js';
import { BaseInstaller } from './base.js';
import { readModification, updateModification, getCurrentVersion } from './change-index.js';

export class PythonInstaller extends BaseInstaller {
  constructor(config, options = {}) {
    super(config, options);
    this.pyenvRepo = 'https://github.com/pyenv/pyenv.git';
    this.pythonVersion = options.version || '3.11.7'; // Stable version that builds reliably
  }

  async checkPrerequisites() {
    const platform = getPlatform();
    if (!platform.isLinux && !platform.isMac) {
      throw new Error('pyenv installer only supports Linux and macOS');
    }

    // Check for build dependencies
    this.logger.info('Installing Python build dependencies...');

    if (platform.isLinux) {
      await runCommand('sudo', ['apt-get', 'update']);

      // Install build dependencies
      await runCommand('sudo', ['apt-get', 'install', '-y',
        'make', 'build-essential', 'libssl-dev', 'zlib1g-dev',
        'libbz2-dev', 'libreadline-dev', 'libsqlite3-dev', 'wget',
        'curl', 'llvm', 'libncursesw5-dev', 'xz-utils', 'tk-dev',
        'libxml2-dev', 'libxmlsec1-dev', 'libffi-dev', 'liblzma-dev',
        'python3-dev', 'libgdbm-dev', 'libnss3-dev', 'libgdbm-compat-dev',
        'uuid-dev', 'libdb-dev'
      ]);

      // On Ubuntu 24.04, we MUST use an older GCC for Python builds
      // Check if we're on Ubuntu 24.04
      try {
        const { stdout: osRelease } = await runCommand('cat', ['/etc/os-release'], { silent: true });
        if (osRelease.includes('24.04')) {
          this.logger.info('Ubuntu 24.04 detected - installing GCC 12 for Python builds...');
          await runCommand('sudo', ['apt-get', 'install', '-y', 'gcc-12', 'g++-12']);
          this.logger.success('GCC 12 installed for compatibility');
        }
      } catch (_error) {
        this.logger.warn('Could not detect OS version or install GCC 12');
      }
    }

    return true;
  }

  preInstall() {
    // Call checkPrerequisites to install build dependencies
    return this.checkPrerequisites();
  }

  async isInstalled() {
    try {
      const platform = getPlatform();
      const pyenvPath = path.join(platform.homeDir, '.pyenv', 'bin', 'pyenv');
      await fs.access(pyenvPath);

      // Check if pyenv is in PATH
      try {
        await runCommand('pyenv', ['--version'], { silent: true });
        return true;
      } catch {
        // pyenv installed but not in PATH
        return true;
      }
    } catch {
      return false;
    }
  }

  async getVersion() {
    try {
      const result = await runCommand('pyenv', ['--version'], { silent: true });
      return result.stdout.trim();
    } catch {
      return null;
    }
  }

  async install() {
    const platform = getPlatform();
    const pyenvRoot = path.join(platform.homeDir, '.pyenv');

    // Clone pyenv repository
    this.logger.info('Installing pyenv...');
    await runCommand('git', ['clone', this.pyenvRepo, pyenvRoot]);

    // Clone pyenv-virtualenv plugin
    this.logger.info('Installing pyenv-virtualenv plugin...');
    const virtualenvPath = path.join(pyenvRoot, 'plugins', 'pyenv-virtualenv');
    await runCommand('git', ['clone',
      'https://github.com/pyenv/pyenv-virtualenv.git',
      virtualenvPath
    ]);

    // Install Python version
    this.logger.info(`Installing Python ${this.pythonVersion}...`);
    const env = {
      ...process.env,
      PYENV_ROOT: pyenvRoot,
      PATH: `${pyenvRoot}/bin:${process.env.PATH}`
    };

    // On Ubuntu 24.04, we have serious compiler compatibility issues
    // Let's check if we're on Ubuntu 24.04 and use a different approach
    let isUbuntu2404 = false;
    try {
      const { stdout: osRelease } = await runCommand('cat', ['/etc/os-release'], { silent: true });
      isUbuntu2404 = osRelease.includes('24.04');
    } catch {
      // Ignore errors
    }

    if (isUbuntu2404) {
      this.logger.warn('Ubuntu 24.04 detected - pyenv has compilation issues on this version');
      this.logger.info('Installing system Python instead...');

      // Install system Python packages
      try {
        await runCommand('sudo', ['apt-get', 'update'], { silent: true });
        await runCommand('sudo', ['apt-get', 'install', '-y',
          'python3', 'python3-pip', 'python3-venv', 'python3-dev', 'pipx'
        ]);

        this.logger.success('System Python installed successfully');
        this.logger.info('');
        this.logger.info('To use Python:');
        this.logger.info('  - Create virtual environments: python3 -m venv myproject');
        this.logger.info('  - Install tools globally: pipx install <tool>');
        this.logger.info('');

        // Return success with system Python
        return { pyenvRoot, pythonVersion: 'system', skipped: true, systemPython: true };
      } catch (_error) {
        this.logger.error('Failed to install system Python packages');
        throw _error;
      }
    }

    try {
      await runCommand(`${pyenvRoot}/bin/pyenv`, ['install', this.pythonVersion], { env });
      await runCommand(`${pyenvRoot}/bin/pyenv`, ['global', this.pythonVersion], { env });
    } catch (_error) {
      this.logger.warn(`Failed to install Python ${this.pythonVersion}: ${_error.message}`);

      // Try a more stable version if the latest fails
      const fallbackVersion = '3.10.13'; // Even more stable version
      if (this.pythonVersion !== fallbackVersion && !isUbuntu2404) {
        this.logger.info(`Trying fallback Python version ${fallbackVersion}...`);
        try {
          await runCommand(`${pyenvRoot}/bin/pyenv`, ['install', fallbackVersion], { env });
          await runCommand(`${pyenvRoot}/bin/pyenv`, ['global', fallbackVersion], { env });
          this.pythonVersion = fallbackVersion;
          this.logger.success(`Successfully installed Python ${fallbackVersion}`);
        } catch (_fallbackError) {
          throw new Error('Python build failed - check system dependencies');
        }
      } else {
        throw _error;
      }
    }

    // Configure shell integration
    const result = { pyenvRoot, pythonVersion: this.pythonVersion };
    await this.configure(result);

    return result;
  }

  async configure(installResult) {
    const platform = getPlatform();
    const { pyenvRoot } = installResult;

    // Skip configuration if using system Python
    if (installResult.pythonVersion === 'system' || installResult.skipped) {
      return;
    }

    this.logger.info('Configuring pyenv environment...');

    // Pyenv configuration content
    const pyenvConfig = `# pyenv configuration
export PYENV_ROOT="${pyenvRoot}"
export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init -)"
eval "$(pyenv virtualenv-init -)"`;

    // Get shell config files based on user selection
    const shellConfigs = this.getShellConfigFiles();
    const version = getCurrentVersion();

    for (const shellConfig of shellConfigs) {
      const configPath = path.join(platform.homeDir, shellConfig);

      try {
        await updateModification(configPath, 'pyenv-config', pyenvConfig, version);
        this.logger.info(`Added pyenv configuration to ${shellConfig}`);
      } catch (_error) {
        this.logger.debug(`Could not update ${shellConfig}: ${_error.message}`);
      }
    }

    // Create pip configuration directory
    const pipDir = path.join(platform.homeDir, '.config', 'pip');
    await fs.mkdir(pipDir, { recursive: true }).catch(() => {});

    // Configure pip to use user directory by default
    const pipConfig = path.join(pipDir, 'pip.conf');
    const pipContent = [
      '[global]',
      'user = false',
      'disable-pip-version-check = true',
      ''
    ].join('\n');

    await fs.writeFile(pipConfig, pipContent).catch(() => {});
  }

  async verify() {
    const platform = getPlatform();
    const pyenvRoot = path.join(platform.homeDir, '.pyenv');

    // Check if we're on Ubuntu 24.04 (system Python installation)
    const { stdout: lsbRelease } = await runCommand('lsb_release', ['-r', '-s'], { silent: true }).catch(() => ({ stdout: '' }));
    const { stdout: distroId } = await runCommand('lsb_release', ['-i', '-s'], { silent: true }).catch(() => ({ stdout: '' }));
    const isUbuntu2404 = distroId.trim().toLowerCase() === 'ubuntu' && lsbRelease.trim() === '24.04';

    if (isUbuntu2404) {
      // Verify system Python installation
      try {
        await runCommand('which', ['python3'], { silent: true });
        await runCommand('which', ['pip3'], { silent: true });
        await runCommand('which', ['pipx'], { silent: true });
        this.logger.success('System Python installation verified');
        return true;
      } catch (_error) {
        this.logger.error('System Python not properly installed');
        return false;
      }
    }

    try {
      // Check pyenv installation
      const pyenvBin = path.join(pyenvRoot, 'bin', 'pyenv');
      await fs.access(pyenvBin);

      // Check pyenv version using full path
      const pyenvResult = await runCommand(pyenvBin, ['--version'], { silent: true });
      this.logger.info(`pyenv version: ${pyenvResult.stdout.trim()}`);

      // Check if Python was installed by listing versions
      const versionsResult = await runCommand(pyenvBin, ['versions', '--bare'], { silent: true });
      const versions = versionsResult.stdout.trim().split('\n').filter(v => v);

      if (versions.length === 0) {
        this.logger.error('No Python versions installed via pyenv');
        return false;
      }

      this.logger.info(`Installed Python versions: ${versions.join(', ')}`);

      // Check which version is set as global
      const globalResult = await runCommand(pyenvBin, ['global'], { silent: true });
      this.logger.info(`Global Python version: ${globalResult.stdout.trim()}`);

      // Note: We can't check python/pip commands directly here because they require
      // shell initialization (eval "$(pyenv init -)") which needs a new shell session
      this.logger.info('Python installation verified. Restart your shell to use Python.');

      return true;
    } catch (_error) {
      this.logger.error(`Verification failed: ${_error.message}`);
      return false;
    }
  }

  getInstructions() {
    return [
      'To use pyenv and Python, restart your shell or run:',
      '  source ~/.bashrc',
      '',
      'Verify installation:',
      '  pyenv --version',
      '  python --version',
      '  pip --version',
      '',
      'Common pyenv commands:',
      '  pyenv install --list       # List available Python versions',
      '  pyenv install 3.11.0       # Install a specific version',
      '  pyenv global 3.11.0        # Set global Python version',
      '  pyenv local 3.11.0         # Set project-specific version',
      '',
      'Virtual environments:',
      '  pyenv virtualenv 3.12.0 myproject',
      '  pyenv activate myproject',
      '  pyenv deactivate',
      '',
      'Package management:',
      '  pip install package-name',
      '  pip install -r requirements.txt'
    ];
  }
}
