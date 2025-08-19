import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function displayHelp() {
  // Try to read and display the logo
  try {
    const logoPath = path.join(__dirname, '..', 'logo.ans');
    const logo = await fs.readFile(logoPath, 'utf8');
    console.log(logo);
  } catch (_error) {
    // If logo not found, show text version
    console.log(chalk.cyan.bold('\n  SIGAO AI DEVKIT'));
  }

  console.log(chalk.gray('  ─────────────────────────────────────────────────\n'));

  console.log(chalk.white.bold('  NAME'));
  console.log('      sigao - Modular development environment installer\n');

  console.log(chalk.white.bold('  SYNOPSIS'));
  console.log('      sigao [command] [options]\n');

  console.log(chalk.white.bold('  DESCRIPTION'));
  console.log('      The Sigao CLI provides tools for setting up AI-first development');
  console.log('      environments and executing AI-powered workpackages.\n');

  console.log(chalk.white.bold('  COMMANDS'));
  console.log(`${chalk.cyan('      setup')} (default)`);
  console.log('          Run the interactive setup installer\n');

  console.log(`${chalk.cyan('      work')} <package.json>`);
  console.log('          Execute an AI workpackage using Claude\n');

  console.log(`${chalk.cyan('      generate')} <prd.md> <output.json>`);
  console.log('          Generate a workpackage from a PRD markdown file\n');

  console.log(chalk.cyan('      help'));
  console.log('          Display this help message\n');

  console.log(chalk.white.bold('  OPTIONS'));
  console.log('      -y, --yes');
  console.log('          Skip prompts and install all components\n');

  console.log('      -c, --components <items>');
  console.log('          Install specific components (comma-separated)\n');

  console.log('      --list');
  console.log('          List all available components\n');

  console.log('      --dry-run');
  console.log('          Preview actions without making changes\n');

  console.log('      --no-color');
  console.log('          Disable colored output\n');

  console.log('      -V, --version');
  console.log('          Display version information\n');

  console.log('      -h, --help');
  console.log('          Display help for command\n');

  console.log(chalk.white.bold('  EXAMPLES'));
  console.log('      Install all components:');
  console.log(chalk.gray('          $ sigao --yes\n'));

  console.log('      Install specific components:');
  console.log(chalk.gray('          $ sigao -c node,docker,python\n'));

  console.log('      Execute a workpackage:');
  console.log(chalk.gray('          $ sigao work ./my-workpackage.json\n'));

  console.log('      Generate workpackage from PRD:');
  console.log(chalk.gray('          $ sigao generate ./requirements.md ./workpackage.json\n'));

  console.log('      Run setup again:');
  console.log(chalk.gray('          $ sigao setup\n'));

  console.log(chalk.white.bold('  INSTALLED COMPONENTS'));
  await displayInstalledComponents();

  console.log(chalk.white.bold('  MORE INFORMATION'));
  console.log('      Documentation: https://github.com/sigaostudios/sigao-ai-devkit');
  console.log('      Issues: https://github.com/sigaostudios/sigao-ai-devkit/issues\n');

  console.log(chalk.gray('  ─────────────────────────────────────────────────'));
  console.log(chalk.gray(`  Sigao CLI v${process.env.SIGAO_VERSION || '1.4.2'}`));
  console.log(chalk.gray('  ─────────────────────────────────────────────────\n'));
}

async function displayInstalledComponents() {
  try {
    // Import shell utilities
    const { checkCommandExists } = await import('./shell.js');

    const componentChecks = [
      { name: 'Shell Enhancements', check: () => checkCommandExists('starship') },
      { name: 'Git & GitHub CLI', check: async () => {
        const [gitExists, ghExists] = await Promise.all([
          checkCommandExists('git'),
          checkCommandExists('gh')
        ]);
        return gitExists && ghExists;
      } },
      { name: 'Node.js (NVM)', check: async () => {
        const homeDir = process.env.HOME || process.env.USERPROFILE;
        try {
          await fs.access(path.join(homeDir, '.nvm', 'nvm.sh'));
          return true;
        } catch {
          return false;
        }
      } },
      { name: 'Claude Code CLI', check: () => checkCommandExists('claude') },
      { name: 'Docker', check: () => checkCommandExists('docker') },
      { name: 'Python (pyenv)', check: async () => {
        const homeDir = process.env.HOME || process.env.USERPROFILE;
        try {
          await fs.access(path.join(homeDir, '.pyenv', 'bin', 'pyenv'));
          return true;
        } catch {
          return false;
        }
      } },
      { name: '.NET SDK', check: () => checkCommandExists('dotnet') },
      { name: 'Azure CLI', check: () => checkCommandExists('az') },
      { name: 'Modern CLI Tools', check: async () => {
        const [fzfExists, batExists] = await Promise.all([
          checkCommandExists('fzf'),
          checkCommandExists('bat')
        ]);
        return fzfExists && batExists;
      } }
    ];

    let hasAny = false;
    for (const component of componentChecks) {
      if (await component.check()) {
        console.log(chalk.green('      ✓ ') + component.name);
        hasAny = true;
      }
    }

    if (!hasAny) {
      console.log(chalk.gray('      No components installed yet'));
    }
    console.log('');

  } catch (_error) {
    console.log(chalk.gray('      Unable to check installed components\n'));
  }
}

export async function checkIfInstalled() {
  // Check if sigao has been installed by looking for key markers
  try {
    const homeDir = process.env.HOME || process.env.USERPROFILE;
    const markers = [
      path.join(homeDir, '.sigao-logo.ans'),
      path.join(homeDir, '.config', 'starship.toml'),
      path.join(homeDir, 'dev', 'README.md')
    ];

    for (const marker of markers) {
      try {
        await fs.access(marker);
        return true; // Found at least one marker
      } catch {
        // Continue checking
      }
    }

    return false;
  } catch {
    return false;
  }
}
