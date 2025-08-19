import path from 'path';
import { runCommand, checkCommandExists, runWithSpinner } from '../utils/shell.js';
import { getPlatform } from '../utils/platform.js';
import { BaseInstaller } from './base.js';

export class PythonToolsInstaller extends BaseInstaller {
  constructor(module, options = {}) {
    super(module, options);
    this.tools = [
      'black', // Code formatter
      'ruff', // Fast linter
      'mypy', // Type checker
      'pytest', // Testing framework
      'ipython', // Enhanced Python shell
      'httpie', // HTTP client
      'poetry' // Dependency management
    ];
  }

  async isInstalled() {
    // Check if pipx is installed and most tools are available
    if (!await checkCommandExists('pipx')) {
      return false;
    }

    let installedCount = 0;
    for (const tool of this.tools) {
      if (await checkCommandExists(tool)) {
        installedCount++;
      }
    }

    return installedCount >= this.tools.length * 0.5;
  }

  async install() {
    this.logger.info('Installing Python development tools...');

    // First ensure Python3 is available
    if (!await checkCommandExists('python3')) {
      this.logger.error('Python3 is not installed. Please install Python first.');
      throw new Error('Python3 not found');
    }

    // Install pipx for tool management
    await this.installPipx();

    // Install tools via pipx
    await this.installTools();

    // Configure Poetry if installed
    await this.configurePoetry();

    this.logger.success('Python development tools installed');
  }

  async installPipx() {
    if (await checkCommandExists('pipx')) {
      this.logger.info('pipx already installed');
      return;
    }

    this.logger.info('Installing pipx for Python tool management...');

    try {
      // Try installing via apt first
      await runCommand('sudo', ['apt', 'update']);
      await runCommand('sudo', ['apt', 'install', '-y', 'pipx']);

      // Ensure pipx is in PATH
      await runCommand('pipx', ['ensurepath']);

      // Add to current session PATH
      const platform = getPlatform();
      const pipxBin = path.join(platform.homeDir, '.local', 'bin');
      process.env.PATH = `${pipxBin}:${process.env.PATH}`;

      this.logger.success('pipx installed');
    } catch (_error) {
      // Fallback to pip installation
      this.logger.info('Installing pipx via pip...');

      // Ensure pip is installed
      if (!await checkCommandExists('pip3')) {
        await runCommand('sudo', ['apt', 'install', '-y', 'python3-pip']);
      }

      await runCommand('python3', ['-m', 'pip', 'install', '--user', 'pipx']);
      await runCommand('python3', ['-m', 'pipx', 'ensurepath']);

      // Add to current session PATH
      const platform = getPlatform();
      const pipxBin = path.join(platform.homeDir, '.local', 'bin');
      process.env.PATH = `${pipxBin}:${process.env.PATH}`;
    }
  }

  async installTools() {
    this.logger.info('Installing Python tools via pipx...');

    for (const tool of this.tools) {
      if (await checkCommandExists(tool)) {
        this.logger.info(`${tool} already installed`);
        continue;
      }

      try {
        await runWithSpinner(
          `Installing ${tool}...`,
          () => runCommand('pipx', ['install', tool])
        );
        this.logger.success(`${tool} installed`);
      } catch (_error) {
        this.logger.warn(`Failed to install ${tool}: ${_error.message}`);
      }
    }
  }

  async configurePoetry() {
    if (!await checkCommandExists('poetry')) {
      return;
    }

    this.logger.info('Configuring Poetry...');

    try {
      // Configure Poetry to create virtual environments in project
      await runCommand('poetry', ['config', 'virtualenvs.in-project', 'true']);

      // Ensure Poetry respects Python version
      await runCommand('poetry', ['config', 'virtualenvs.path', '{project-dir}/.venv']);

      this.logger.success('Poetry configured');
    } catch (_error) {
      this.logger.debug(`Failed to configure Poetry: ${_error.message}`);
    }
  }

  async verify() {
    const results = [];

    // Check pipx
    results.push({
      name: 'pipx',
      installed: await checkCommandExists('pipx')
    });

    // Check each tool
    for (const tool of this.tools) {
      results.push({
        name: tool,
        installed: await checkCommandExists(tool)
      });
    }

    // Log results
    this.logger.info('Python Tools Status:');
    for (const result of results) {
      if (result.installed) {
        this.logger.success(`  ✓ ${result.name}`);
      } else {
        this.logger.warn(`  ✗ ${result.name}`);
      }
    }

    // Return true if pipx and most tools are installed
    const installedCount = results.filter(r => r.installed).length;
    return installedCount >= results.length * 0.6;
  }

  postInstall() {
    this.logger.info('Python development tools installed!');
    this.logger.info('');
    this.logger.info('Installed tools:');
    this.logger.info('  - black: Code formatter');
    this.logger.info('  - ruff: Fast Python linter');
    this.logger.info('  - mypy: Static type checker');
    this.logger.info('  - pytest: Testing framework');
    this.logger.info('  - ipython: Enhanced Python shell');
    this.logger.info('  - httpie: Modern HTTP client');
    this.logger.info('  - poetry: Dependency management');
    this.logger.info('');
    this.logger.info('To use Poetry for a new project:');
    this.logger.info('  poetry new myproject');
    this.logger.info('  cd myproject');
    this.logger.info('  poetry add requests');
    this.logger.info('  poetry shell');

    return true;
  }
}
