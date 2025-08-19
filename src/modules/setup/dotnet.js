import path from 'path';
import fs from 'fs/promises';
import { getPlatform } from '../../utils/platform.js';
import { runCommand } from '../../utils/shell.js';
import { BaseInstaller } from './base.js';
import { readModification, updateModification, getCurrentVersion } from './change-index.js';

export class DotNetInstaller extends BaseInstaller {
  constructor(config, options = {}) {
    super(config, options);
    this.installScript = 'https://dot.net/v1/dotnet-install.sh';
  }

  checkPrerequisites() {
    const platform = getPlatform();
    if (!platform.isLinux && !platform.isMac) {
      throw new Error('.NET SDK installer only supports Linux and macOS');
    }
    return true;
  }

  async isInstalled() {
    try {
      const result = await runCommand('dotnet', ['--version'], { silent: true });
      this.logger.info(`Found .NET SDK version: ${result.stdout.trim()}`);
      return true;
    } catch {
      return false;
    }
  }

  async getVersion() {
    try {
      const result = await runCommand('dotnet', ['--version'], { silent: true });
      return result.stdout.trim();
    } catch {
      return null;
    }
  }

  async install() {
    const platform = getPlatform();

    // Download the install script
    this.logger.info('Downloading .NET install script...');
    await runCommand('curl', ['-fsSL', this.installScript, '-o', '/tmp/dotnet-install.sh']);
    await runCommand('chmod', ['+x', '/tmp/dotnet-install.sh']);

    // Install .NET SDK
    this.logger.info('Installing .NET SDK (latest LTS)...');
    const installDir = path.join(platform.homeDir, '.dotnet');

    await runCommand('/tmp/dotnet-install.sh', [
      '--channel', 'LTS',
      '--install-dir', installDir,
      '--no-path' // We'll manage PATH ourselves
    ]);

    // Clean up
    await fs.unlink('/tmp/dotnet-install.sh').catch(() => {});

    return { installDir };
  }

  async configure(installResult) {
    const platform = getPlatform();
    const { installDir } = installResult;

    this.logger.info('Configuring .NET environment...');

    // .NET SDK path configuration
    const dotnetPathConfig = `# .NET SDK
export DOTNET_ROOT="${installDir}"
export PATH="$DOTNET_ROOT:$DOTNET_ROOT/tools:$PATH"`;

    // Telemetry opt-out configuration
    const telemetryConfig = `# Disable .NET telemetry
export DOTNET_CLI_TELEMETRY_OPTOUT=1`;

    // Get shell config files based on user selection
    const shellConfigs = this.getShellConfigFiles();
    const version = getCurrentVersion();

    for (const shellConfig of shellConfigs) {
      const configPath = path.join(platform.homeDir, shellConfig);

      try {
        // Add .NET path configuration
        await updateModification(configPath, 'dotnet-path', dotnetPathConfig, version);
        
        // Add telemetry opt-out
        await updateModification(configPath, 'dotnet-telemetry', telemetryConfig, version);
        
        this.logger.info(`Added .NET configuration to ${shellConfig}`);
      } catch (_error) {
        // File doesn't exist, skip
        if (_error.code !== 'ENOENT') {
          this.logger.debug(`Could not update ${shellConfig}: ${_error.message}`);
        }
      }
    }
  }

  async verify() {
    // Set environment for verification
    const platform = getPlatform();
    const installDir = path.join(platform.homeDir, '.dotnet');
    const env = {
      ...process.env,
      DOTNET_ROOT: installDir,
      PATH: `${installDir}:${installDir}/tools:${process.env.PATH}`
    };

    const result = await runCommand('dotnet', ['--version'], {
      silent: true,
      env
    });

    this.logger.info(`Verified .NET SDK installation: ${result.stdout.trim()}`);
    return true;
  }

  getInstructions() {
    return [
      'To use .NET SDK, restart your shell or run:',
      '  source ~/.bashrc',
      '',
      'Verify installation:',
      '  dotnet --version',
      '',
      'Create a new project:',
      '  dotnet new console -n MyApp',
      '  cd MyApp',
      '  dotnet run'
    ];
  }
}
