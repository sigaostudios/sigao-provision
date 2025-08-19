#!/usr/bin/env node

// Set default locale to prevent warnings
if (!process.env.LC_ALL && !process.env.LANG) {
  process.env.LC_ALL = 'C.UTF-8';
  process.env.LANG = 'C.UTF-8';
}

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { program } from 'commander';
import chalk from 'chalk';
import { createInstaller } from '../src/index.js';
import { displayHelp, checkIfInstalled } from '../src/utils/help-display.js';
import { createHelpCommand } from '../src/commands/help.js';
import { createCheatCommand } from '../src/commands/cheat.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'));
const version = packageJson.version;

// Set version for help display
process.env.SIGAO_VERSION = version;

// Handle graceful shutdown
let isShuttingDown = false;

function setupSignalHandlers() {
  const signals = ['SIGINT', 'SIGTERM'];

  signals.forEach(signal => {
    process.on(signal, () => {
      if (isShuttingDown) {
        console.log(chalk.red('\nForce exiting...'));
        process.exit(1);
      }

      isShuttingDown = true;
      console.log(chalk.yellow('\n\n⚠️  Installation interrupted by user'));
      console.log(chalk.yellow('Cleaning up... Press Ctrl+C again to force exit'));

      // Give processes a chance to clean up
      setTimeout(() => {
        console.log(chalk.red('Installation cancelled'));
        process.exit(130); // Standard exit code for SIGINT
      }, 2000);
    });
  });
}

setupSignalHandlers();

program
  .name('sigao-provision')
  .description('Environment provisioning tool for setting up development environments')
  .version(version)
  .option('-y, --yes', 'Skip interactive prompts and install all components')
  .option('-c, --components <items>', 'Comma-separated list of components to install', val => val.split(','))
  .option('--list', 'List available components')
  .option('--dry-run', 'Show what would be installed without making changes')
  .option('--no-color', 'Disable colored output')
  .action(async options => {
    try {
      // Check if sigao is already installed and no specific options are provided
      const hasOptions = options.yes || options.components || options.list || options.dryRun;
      if (!hasOptions && await checkIfInstalled()) {
        // Display help instead of running setup
        await displayHelp();
        return;
      }

      const installer = createInstaller(options);
      await installer.run();
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// Help command with topic support
program.addCommand(createHelpCommand());

// Cheat command for quick reference
program.addCommand(createCheatCommand());

// Setup command (explicit)
program
  .command('setup')
  .description('Run the interactive setup installer')
  .option('-y, --yes', 'Skip interactive prompts and install all components')
  .option('-c, --components <items>', 'Comma-separated list of components to install', val => val.split(','))
  .option('--list', 'List available components')
  .option('--dry-run', 'Show what would be installed without making changes')
  .action(async options => {
    try {
      const installer = createInstaller(options);
      await installer.run();
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program.parse();