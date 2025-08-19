import fs from 'fs/promises';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { modules, sortModulesByPriority } from './config/modules.js';
import { getInstaller } from './modules/registry.js';
import { createLogger } from './utils/logger.js';
import { getOSInfo } from './utils/platform.js';
import { runCommand, runWithSpinner } from './utils/shell.js';

export class Installer {
  constructor(options = {}) {
    this.options = options;
    this.logger = createLogger({
      level: options.debug ? 'debug' : 'info',
      color: options.color !== false
    });
    this.results = [];
  }

  async selectModules() {
    // If components specified via CLI, use those
    if (this.options.components) {
      return modules.filter(m => this.options.components.includes(m.id));
    }

    // If --yes flag, install all enabled modules
    if (this.options.yes) {
      return modules.filter(m => m.enabled);
    }

    // Interactive selection
    const choices = modules.map(m => ({
      name: `${m.name} - ${m.description}`,
      value: m.id,
      checked: m.enabled
    }));

    const answers = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selectedModules',
        message: 'Select components to install:',
        choices,
        pageSize: 10
      }
    ]);

    return modules.filter(m => answers.selectedModules.includes(m.id));
  }

  async collectConfiguration(selectedModules) {
    console.log(`\n${chalk.cyan.bold('Setup Configuration')}`);
    console.log(chalk.gray('Let\'s configure your installation preferences...\n'));

    const config = {};

    // Collect configuration for each module upfront
    for (const module of selectedModules) {
      const installer = getInstaller(module, this.options);

      // Check if installer has a collectConfig method
      if (typeof installer.collectConfig === 'function') {
        this.logger.info(`Configuring ${module.name}...`);
        config[module.id] = await installer.collectConfig();
      }
    }

    return config;
  }

  async confirmInstallation(selectedModules, config) {
    console.log(`\n${chalk.cyan.bold('Configuration Summary:')}`);
    console.log(chalk.cyan('─'.repeat(50)));

    // Show configuration summary
    if (config['shell'] && config['shell'].selectedShell) {
      console.log(chalk.gray('  Shell: ') + chalk.white(config['shell'].selectedShell === 'zsh' ? 'Zsh with Oh My Zsh' : 'Bash'));
    }

    if (config['git-enhanced']) {
      const gitConfig = config['git-enhanced'];
      if (gitConfig.gitName) {
        console.log(chalk.gray('  Git Name: ') + chalk.white(gitConfig.gitName));
      }
      if (gitConfig.gitEmail) {
        console.log(chalk.gray('  Git Email: ') + chalk.white(gitConfig.gitEmail));
      }
      if (gitConfig.applyRecommended) {
        console.log(chalk.gray('  Git Settings: ') + chalk.white('Recommended settings will be applied'));
      }
      if (gitConfig.configureWSLCredentials) {
        console.log(chalk.gray('  WSL Git: ') + chalk.white('Windows credential manager will be configured'));
      }
    }

    if (config['docker'] && config['docker'].installMethod === 'skip') {
      console.log(chalk.gray('  Docker: ') + chalk.yellow('Will be skipped (install Docker Desktop later)'));
    }

    console.log(`\n${chalk.cyan('Components to install:')}`);
    selectedModules.forEach(m => {
      console.log(chalk.gray('  • ') + chalk.white(m.name));
    });

    if (this.options.dryRun) {
      console.log(`\n${chalk.yellow('DRY RUN MODE - No changes will be made')}`);
    }

    if (!this.options.yes) {
      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: 'Proceed with installation?',
          default: true
        }
      ]);
      return confirm;
    }

    return true;
  }

  async updateSystemPackages() {
    // Only run on apt-based systems
    const osInfo = await getOSInfo();
    if (!osInfo.isApt) {
      this.logger.info('Skipping system update (not an apt-based system)');
      return true;
    }

    if (this.options.dryRun) {
      this.logger.info('Would update system packages (apt update && apt upgrade)');
      this.logger.info('Would fix locale settings if needed');
      return true;
    }

    try {
      // Fix locale settings first
      await this.fixLocaleSettings();
      
      this.logger.info('Updating system packages...');
      
      // Run apt update
      await runWithSpinner('Running apt update...', async () => {
        await runCommand('apt', ['update'], { 
          sudo: true,
          env: {
            ...process.env,
            DEBIAN_FRONTEND: 'noninteractive'
          }
        });
      });
      
      // Run apt upgrade with -y flag to auto-accept
      await runWithSpinner('Running apt upgrade...', async () => {
        await runCommand('apt', ['upgrade', '-y'], { 
          sudo: true,
          env: {
            ...process.env,
            DEBIAN_FRONTEND: 'noninteractive'
          }
        });
      });
      
      this.logger.success('System packages updated successfully');
      return true;
    } catch (error) {
      this.logger.error(`Failed to update system packages: ${error.message}`);
      // Continue with installation even if update fails
      this.logger.warn('Continuing with installation despite update failure...');
      return false;
    }
  }

  async fixLocaleSettings() {
    try {
      // Check if locale is properly set
      const { stdout: currentLocale } = await runCommand('locale', [], { silent: true }).catch(() => ({ stdout: '' }));
      
      if (currentLocale.includes('Cannot set LC_') || currentLocale.includes("can't set the locale")) {
        this.logger.info('Fixing locale settings...');
        
        // Set default locale environment variables
        process.env.LC_ALL = process.env.LC_ALL || 'C.UTF-8';
        process.env.LANG = process.env.LANG || 'C.UTF-8';
        
        // Try to generate and set locale if on Ubuntu/Debian
        try {
          await runCommand('locale-gen', ['en_US.UTF-8'], { sudo: true, silent: true });
          await runCommand('update-locale', ['LANG=en_US.UTF-8'], { sudo: true, silent: true });
        } catch {
          // If locale-gen fails, just use C.UTF-8 which is always available
        }
      }
    } catch {
      // If locale check fails, set safe defaults
      process.env.LC_ALL = 'C.UTF-8';
      process.env.LANG = 'C.UTF-8';
    }
  }

  async installModule(module, config, globalConfig) {
    try {
      const installer = getInstaller(module, this.options);

      // Apply collected configuration if available
      if (config && config[module.id]) {
        Object.assign(installer, config[module.id]);
      }

      // Share global configuration (like selected shell)
      if (globalConfig) {
        installer.globalConfig = globalConfig;
      }

      const result = await installer.run();
      this.results.push({ module: module.id, ...result });
      return result;
    } catch (error) {
      this.logger.error(`Failed to install ${module.name}: ${error.message}`);
      this.results.push({
        module: module.id,
        success: false,
        error: error.message
      });
      return { success: false, error: error.message };
    }
  }

  async run() {
    // Show banner (skip in test mode or if NO_BANNER is set)
    if (!process.env.NO_BANNER && !process.env.NODE_ENV?.includes('test')) {
      try {
        // Use the ink banner component for interactive display
        const { displayBanner } = await import('./utils/display-banner.js');
        await displayBanner();
      } catch (err) {
        // If ink fails, fall back to static banner
        try {
          const banner = await fs.readFile(new URL('./logo.ans', import.meta.url), 'utf-8');
          console.log(banner);
        } catch {
          // Banner is optional
        }
      }
    }

    console.log(chalk.cyan.bold('\n🚀 Sigao AI DevKit Installer\n'));

    // Show system info
    const osInfo = await getOSInfo();
    this.logger.info(`Platform: ${osInfo.distroName || osInfo.os} ${osInfo.version || ''}`);
    if (osInfo.isWSL) {
      this.logger.info('Running in WSL environment');
    }

    // List components if requested
    if (this.options.list) {
      console.log('\nAvailable components:');
      modules.forEach(m => {
        const status = m.enabled ? chalk.green('✓') : chalk.gray('○');
        console.log(`  ${status} ${chalk.bold(m.id.padEnd(15))} ${m.description}`);
      });
      return;
    }

    // Select modules
    const selectedModules = await this.selectModules();

    if (selectedModules.length === 0) {
      this.logger.warn('No components selected for installation');
      return;
    }

    // Collect all configuration upfront
    let config = {};
    if (!this.options.yes && !this.options.dryRun) {
      config = await this.collectConfiguration(selectedModules);
      console.log(`\n${chalk.green('✓')} Configuration complete!`);
      console.log(chalk.gray('All settings have been collected. Ready to begin installation.'));
    }

    // Confirm installation
    if (!await this.confirmInstallation(selectedModules, config)) {
      this.logger.info('Installation cancelled');
      return;
    }

    // Filter out modules that should be skipped based on config
    const modulesToInstall = selectedModules.filter(module => {
      if (module.id === 'docker' && config['docker']?.installMethod === 'skip') {
        return false;
      }
      return true;
    });

    // Sort by priority and install
    const sortedModules = sortModulesByPriority(modulesToInstall);

    // Create global configuration object
    const globalConfig = {
      selectedShell: config['shell']?.selectedShell || null,
      shellConfig: null, // Will be populated after shell module runs
      installedModules: new Set() // Track successfully installed modules
    };

    console.log(`\n${chalk.cyan('Starting installation...\n')}`);

    // Update system packages first
    this.logger.section('System Package Update');
    await this.updateSystemPackages();

    for (const module of sortedModules) {
      this.logger.section(module.name);
      const result = await this.installModule(module, config, globalConfig);

      // Track successful installations
      if (result.success) {
        globalConfig.installedModules.add(module.id);

        // If shell module completes successfully, update global config
        if (module.id === 'shell') {
          const shellName = globalConfig.selectedShell || 'bash';
          globalConfig.shellConfig = shellName === 'zsh' ? '.zshrc' : '.bashrc';
        }
      }
    }

    // Show summary
    this.showSummary();

    // Ensure the process exits cleanly
    // Some tools may leave hanging processes or timers
    setTimeout(() => {
      process.exit(0);
    }, 100);
  }

  showSummary() {
    console.log(`\n${chalk.cyan.bold('Installation Summary:')}`);
    console.log(chalk.cyan('─'.repeat(50)));

    let successCount = 0;
    let skipCount = 0;
    let failCount = 0;

    this.results.forEach(result => {
      const module = modules.find(m => m.id === result.module);
      let status;

      if (result.success && result.skipped) {
        status = chalk.blue('[SKIPPED]');
        skipCount++;
      } else if (result.success) {
        status = chalk.green('[SUCCESS]');
        successCount++;
      } else {
        status = chalk.red('[FAILED]');
        failCount++;
      }

      console.log(`  ${status} ${module.name.padEnd(30)} ${result.error || ''}`);
    });

    console.log(chalk.cyan('─'.repeat(50)));
    console.log(`  Total: ${this.results.length} | ${
      chalk.green(`Success: ${successCount}`)} | ${
      chalk.blue(`Skipped: ${skipCount}`)} | ${
      chalk.red(`Failed: ${failCount}`)}`);

    if (failCount === 0) {
      console.log(`\n${chalk.green.bold('✨ Installation completed successfully!')}`);
      console.log(`\n${chalk.yellow('Next steps:')}`);
      console.log(chalk.gray('  1. Restart your terminal or run: source ~/.bashrc (or ~/.zshrc)'));
      console.log(chalk.gray('  2. Run "sigao" to use the CLI (alias for npx @sigaostudios/sigao-cli)'));
      console.log(chalk.gray('  3. Type "cheat" to see all available commands and aliases'));
    } else {
      console.log(`\n${chalk.red.bold('⚠️  Some components failed to install.')}`);
      console.log('Please check the error messages above and try again.');
    }
  }
}

export function createInstaller(options) {
  return new Installer(options);
}
