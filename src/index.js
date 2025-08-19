#!/usr/bin/env node

import { program } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createLogger } from './utils/logger.js';
import { getInstaller } from './modules/registry.js';
import { modules, categories } from './config/modules.js';
import { getPlatform } from './utils/platform.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = createLogger({ prefix: 'sigao-provision' });

async function displayBanner() {
  try {
    const bannerPath = path.join(__dirname, '..', 'assets', 'banner.ans');
    const banner = await fs.readFile(bannerPath, 'utf8');
    console.log(banner);
  } catch (error) {
    console.log(chalk.cyan('╔══════════════════════════════════════╗'));
    console.log(chalk.cyan('║     SIGAO PROVISION - Setup Tool     ║'));
    console.log(chalk.cyan('╚══════════════════════════════════════╝'));
  }
}

async function selectModules() {
  const choices = [];
  
  for (const category of categories) {
    choices.push(new inquirer.Separator(chalk.bold.yellow(`\n${category.name}`)));
    
    for (const moduleId of category.modules) {
      const module = modules.find(m => m.id === moduleId);
      if (module) {
        choices.push({
          name: `${module.name} - ${module.description}`,
          value: module.id,
          checked: module.default !== false
        });
      }
    }
  }

  const { selectedModules } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedModules',
      message: 'Select modules to install:',
      choices,
      pageSize: 20
    }
  ]);

  return selectedModules;
}

async function runProvisioning(selectedModuleIds, options = {}) {
  const selectedModules = selectedModuleIds.map(id => modules.find(m => m.id === id)).filter(Boolean);
  
  // Resolve dependencies
  const modulesToInstall = new Set();
  const addWithDependencies = (module) => {
    if (modulesToInstall.has(module.id)) return;
    
    // Add dependencies first
    if (module.dependencies) {
      for (const depId of module.dependencies) {
        const dep = modules.find(m => m.id === depId);
        if (dep) addWithDependencies(dep);
      }
    }
    
    modulesToInstall.add(module.id);
  };
  
  for (const module of selectedModules) {
    addWithDependencies(module);
  }
  
  // Convert back to ordered list
  const orderedModules = Array.from(modulesToInstall).map(id => modules.find(m => m.id === id));
  
  logger.info(`Installing ${orderedModules.length} modules...`);
  
  // Collect configurations first
  const globalConfig = {
    installedModules: new Set(),
    shellConfig: null
  };
  
  for (const module of orderedModules) {
    try {
      const installer = getInstaller(module, options);
      installer.globalConfig = globalConfig;
      
      const config = await installer.collectConfig();
      Object.assign(globalConfig, config);
    } catch (error) {
      logger.debug(`No config collection for ${module.id}: ${error.message}`);
    }
  }
  
  // Install modules
  const results = [];
  for (const module of orderedModules) {
    const spinner = ora(`Installing ${module.name}...`).start();
    
    try {
      const installer = getInstaller(module, options);
      installer.globalConfig = globalConfig;
      
      const result = await installer.run();
      
      if (result.success) {
        globalConfig.installedModules.add(module.id);
        
        if (result.skipped) {
          spinner.info(`${module.name} already installed`);
        } else {
          spinner.succeed(`${module.name} installed successfully`);
        }
      } else {
        spinner.fail(`${module.name} installation failed: ${result.error}`);
      }
      
      results.push({ module, ...result });
    } catch (error) {
      spinner.fail(`${module.name} installation failed: ${error.message}`);
      results.push({ module, success: false, error: error.message });
    }
  }
  
  // Summary
  console.log('\n' + chalk.bold('Installation Summary:'));
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  const skipped = results.filter(r => r.skipped);
  
  if (successful.length > 0) {
    console.log(chalk.green(`✓ ${successful.length} modules installed successfully`));
  }
  if (skipped.length > 0) {
    console.log(chalk.yellow(`⊙ ${skipped.length} modules already installed`));
  }
  if (failed.length > 0) {
    console.log(chalk.red(`✗ ${failed.length} modules failed to install`));
    failed.forEach(r => {
      console.log(chalk.red(`  - ${r.module.name}: ${r.error}`));
    });
  }
  
  return results;
}

async function main() {
  program
    .name('sigao-provision')
    .description('Environment provisioning tool extracted from sigao-cli')
    .version('1.0.0');

  program
    .command('install [modules...]')
    .description('Install specified modules (or select interactively)')
    .option('-d, --dry-run', 'Show what would be installed without making changes')
    .option('-l, --list', 'List available modules')
    .option('-a, --all', 'Install all available modules')
    .action(async (moduleIds, options) => {
      await displayBanner();
      
      if (options.list) {
        console.log(chalk.bold('\nAvailable Modules:'));
        for (const category of categories) {
          console.log(chalk.yellow(`\n${category.name}:`));
          for (const moduleId of category.modules) {
            const module = modules.find(m => m.id === moduleId);
            if (module) {
              console.log(`  ${chalk.cyan(module.id.padEnd(20))} - ${module.description}`);
            }
          }
        }
        return;
      }
      
      let selectedModuleIds;
      
      if (options.all) {
        selectedModuleIds = modules.map(m => m.id);
      } else if (moduleIds && moduleIds.length > 0) {
        selectedModuleIds = moduleIds;
      } else {
        selectedModuleIds = await selectModules();
      }
      
      if (selectedModuleIds.length === 0) {
        logger.warn('No modules selected');
        return;
      }
      
      await runProvisioning(selectedModuleIds, { dryRun: options.dryRun });
    });

  program
    .command('check')
    .description('Check which modules are already installed')
    .action(async () => {
      await displayBanner();
      
      console.log(chalk.bold('\nChecking installed modules...\n'));
      
      for (const module of modules) {
        const spinner = ora(`Checking ${module.name}...`).start();
        
        try {
          const installer = getInstaller(module, {});
          const isInstalled = await installer.isInstalled();
          
          if (isInstalled) {
            spinner.succeed(`${module.name} is installed`);
          } else {
            spinner.info(`${module.name} is not installed`);
          }
        } catch (error) {
          spinner.fail(`${module.name} check failed: ${error.message}`);
        }
      }
    });

  program.parse();
}

main().catch(error => {
  logger.error('Fatal error:', error);
  process.exit(1);
});