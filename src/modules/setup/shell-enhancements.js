import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { BaseInstaller } from './base.js';
import { readModification, updateModification, getCurrentVersion } from './change-index.js';

export class ShellEnhancementsInstaller extends BaseInstaller {
  constructor(module, options = {}) {
    super(module, options);
    this.shellConfig = null;
  }

  async isInstalled() {
    // Check if key components are installed
    const logoExists = await this.pathExists(path.join(os.homedir(), '.sigao-logo.ans'));
    const devDirExists = await this.pathExists(path.join(os.homedir(), 'dev'));
    const cheatsheetExists = await this.pathExists(path.join(os.homedir(), '.sigao-cheatsheet.md'));
    return logoExists && devDirExists && cheatsheetExists;
  }

  async install() {
    this.logger.info('Installing shell enhancements...');

    // Detect shell config file
    await this.detectShellConfig();

    // Create directory structure
    await this.createDirectoryStructure();

    // Add navigation aliases
    await this.addNavigationAliases();

    // Copy logo.ans to home directory
    await this.copyLogoFile();

    // Copy cheatsheet
    await this.copyCheatsheet();

    this.logger.success('Shell enhancements installed');
  }

  async detectShellConfig() {
    // Use the shared shell configuration
    const shellConfigs = this.getShellConfigFiles();
    this.shellConfigs = shellConfigs.map(config => {
      // For zsh, use .sigao.zshrc instead of .zshrc
      if (config === '.zshrc') {
        return path.join(os.homedir(), '.sigao.zshrc');
      }
      return path.join(os.homedir(), config);
    });

    // Ensure files exist
    for (const configPath of this.shellConfigs) {
      await fs.appendFile(configPath, '').catch(() => {});
    }
  }

  async createDirectoryStructure() {
    this.logger.info('Creating development directory structure...');

    const dirs = [
      '~/dev',
      '~/dev/personal',
      '~/dev/work',
      '~/dev/opensource',
      '~/dev/client-work',
      '~/dev/sigaostudios',
      '~/dev/.tools/scripts',
      '~/dev/.tools/configs',
      '~/dev/.tools/templates',
      '~/.local/bin',
      '~/.config/zsh',
      '~/.config/bash'
    ];

    for (const dir of dirs) {
      const fullPath = dir.replace('~', os.homedir());
      await fs.mkdir(fullPath, { recursive: true });
    }

    // Create README in dev directory
    const readmePath = path.join(os.homedir(), 'dev', 'README.md');
    const readmeContent = `# Development Directory Structure

This directory follows the recommended structure from sigao-ai-devkit:

\`\`\`
~/dev/
├── personal/          # Your personal projects
├── work/             # Work-related projects
├── opensource/       # Open source contributions
├── client-work/      # Client projects
├── sigaostudios/     # Sigao Studios projects
└── .tools/           # Development utilities
    ├── scripts/      # Utility scripts
    ├── configs/      # Shared configurations
    └── templates/    # Project templates
\`\`\`

## Usage

Each organization directory should contain repositories:
\`\`\`
~/dev/sigaostudios/
├── project1/
├── project2/
└── project3/
\`\`\`

## Using Git Worktrees

For each repository, use git worktrees to work on multiple branches:

\`\`\`bash
cd ~/dev/sigaostudios
git clone https://github.com/sigaostudios/myproject.git myproject/main
cd myproject/main
git worktree add ../feature-branch -b feature-branch
\`\`\`
`;

    await fs.writeFile(readmePath, readmeContent);
    this.logger.success('Created directory structure');
  }

  async addNavigationAliases() {
    const version = getCurrentVersion();
    const aliasesContent = `
# Development directory navigation
alias dev="cd ~/dev"
alias devs="cd ~/dev/sigaostudios"
alias devp="cd ~/dev/personal"
alias devw="cd ~/dev/work"

# Git aliases
alias g="git"
alias gs="git status"
alias ga="git add"
alias gc="git commit"
alias gp="git push"
alias gl="git log --oneline --graph --decorate"
alias gd="git diff"
alias gb="git branch"
alias gco="git checkout"
alias gcb="git checkout -b"
alias gm="git merge"
alias gr="git rebase"
alias gf="git fetch"
alias clone="git clone"

# GitHub CLI aliases
alias ghpr="gh pr list"
alias ghprc="gh pr create"
alias ghprv="gh pr view"
alias ghis="gh issue list"
alias ghisc="gh issue create"
alias ghisv="gh issue view"

# GitHub repo listing function
repos() {
    echo "Fetching your GitHub repositories..."
    gh repo list --limit 100 --json name,description,isPrivate,updatedAt --template '{{range .}}{{if .isPrivate}}🔒{{else}}📂{{end}} {{.name}} - {{.description}}{{printf "\\n"}}{{end}}'
}

# Clone GitHub repo with gh
ghclone() {
    if [ -z "$1" ]; then
        echo "Usage: ghclone <repo-name>"
        echo "   or: ghclone <org/repo>"
        return 1
    fi
    gh repo clone "$1"
}

# Modern CLI tool aliases (conditional on availability)
command -v bat &>/dev/null && alias cat="bat"
command -v eza &>/dev/null && alias ls="eza --icons" && alias ll="eza -la --icons" && alias la="eza -a --icons" && alias lt="eza --tree --icons"
command -v fd &>/dev/null && alias find="fd"
command -v rg &>/dev/null && alias grep="rg"
command -v procs &>/dev/null && alias ps="procs"
command -v btop &>/dev/null && alias top="btop" && alias htop="btop"
command -v nvim &>/dev/null && alias vim="nvim" && alias vi="nvim"

# Docker aliases
alias d="docker"
alias dc="docker-compose"
alias dps="docker ps"
alias dpsa="docker ps -a"
alias dim="docker images"
alias dex="docker exec -it"
alias dlog="docker logs -f"
alias dprune="docker system prune -a"

# Python aliases
alias py="python3"
alias pip="pip3"
alias venv="python3 -m venv"
alias activate="source venv/bin/activate"

# Node/npm aliases
alias ni="npm install"
alias nr="npm run"
alias ns="npm start"
alias nt="npm test"
alias nb="npm run build"

# Sigao CLI alias - always uses latest version
alias sigao="npx @sigaostudios/sigao-cli"

# Directory listing aliases
alias ...="cd ../.."
alias ....="cd ../../.."
alias .....="cd ../../../.."

# Utility aliases
alias reload="source ~/.zshrc 2>/dev/null || source ~/.bashrc"
alias h="history"
alias j="jobs"
alias which="type -a"
alias path='echo -e \${PATH//:/\\\\n}'
alias now='date +"%Y-%m-%d %H:%M:%S"'
alias week='date +%V'

# Safety aliases
alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'

# Make directory and cd into it
mkcd() {
    mkdir -p "$1" && cd "$1"
}

# Extract any archive
extract() {
    if [ -f "$1" ]; then
        case "$1" in
            *.tar.bz2)   tar xjf "$1"   ;;
            *.tar.gz)    tar xzf "$1"   ;;
            *.bz2)       bunzip2 "$1"   ;;
            *.rar)       unrar x "$1"   ;;
            *.gz)        gunzip "$1"    ;;
            *.tar)       tar xf "$1"    ;;
            *.tbz2)      tar xjf "$1"   ;;
            *.tgz)       tar xzf "$1"   ;;
            *.zip)       unzip "$1"     ;;
            *.Z)         uncompress "$1";;
            *.7z)        7z x "$1"      ;;
            *)           echo "'$1' cannot be extracted" ;;
        esac
    else
        echo "'$1' is not a valid file"
    fi
}

# Project navigation function
proj() {
    if [ -z "$1" ]; then
        cd ~/dev
    elif [ -z "$2" ]; then
        # Try to find project in any org
        cd ~/dev/*/$1 2>/dev/null || cd ~/dev/*/*/$1 2>/dev/null || echo "Project not found"
    else
        # Go to specific org/project
        cd ~/dev/$1/$2 2>/dev/null || echo "Project not found"
    fi
}

# List all projects
projects() {
    find ~/dev -type d -name ".git" -not -path "*/.*/*" | sed "s|/\\.git||" | sed "s|$HOME/dev/||" | sort
}

# Git worktree helper
worktree-add() {
    if [ -z "$1" ]; then
        echo "Usage: worktree-add <branch-name>"
        return 1
    fi
    git worktree add ../$1 -b $1 && cd ../$1
}

# Show Sigao cheatsheet
cheat() {
    if [ -f ~/.sigao-cheatsheet.md ]; then
        if command -v glow &>/dev/null; then
            glow ~/.sigao-cheatsheet.md
        elif command -v bat &>/dev/null; then
            bat ~/.sigao-cheatsheet.md
        else
            cat ~/.sigao-cheatsheet.md
        fi
    else
        echo "Cheatsheet not found. Run 'sigao setup' to install it."
    fi
}

# Show utilities guide
cheat-utils() {
    if [ -f ~/.sigao-cheatsheet-utils.md ]; then
        if command -v glow &>/dev/null; then
            glow ~/.sigao-cheatsheet-utils.md
        elif command -v bat &>/dev/null; then
            bat ~/.sigao-cheatsheet-utils.md
        else
            cat ~/.sigao-cheatsheet-utils.md
        fi
    else
        echo "Utilities cheatsheet not found. Run 'sigao setup' to install it."
    fi
}

# Initialize zoxide if available
if command -v zoxide &>/dev/null; then
    if [ -n "$BASH_VERSION" ]; then
        eval "$(zoxide init bash)"
    elif [ -n "$ZSH_VERSION" ]; then
        eval "$(zoxide init zsh)"
    fi
fi

`;

    // Add aliases to all configured shells
    for (const configPath of this.shellConfigs) {
      try {
        await updateModification(configPath, 'shell-enhancements-aliases', aliasesContent, version);
        const displayName = configPath.endsWith('.sigao.zshrc') ? '.sigao.zshrc' : path.basename(configPath);
        this.logger.success(`Added navigation aliases to ${displayName}`);
      } catch (_error) {
        this.logger.debug(`Could not add aliases to ${path.basename(configPath)}: ${_error.message}`);
      }
    }
  }

  async copyLogoFile() {
    try {
      this.logger.info('Copying Sigao logo...');

      // Find the logo.ans file in the package
      const currentFileUrl = new URL(import.meta.url);
      // Go up from modules/setup/shell-enhancements.js to package root
      const modulesDir = path.dirname(path.dirname(currentFileUrl.pathname));
      const srcDir = path.dirname(modulesDir);
      const sourceLogo = path.join(srcDir, 'logo.ans');
      const destLogo = path.join(os.homedir(), '.sigao-logo.ans');

      // Copy the logo file
      await fs.copyFile(sourceLogo, destLogo);
      this.logger.success('Logo copied to ~/.sigao-logo.ans');

      // Don't add logo display here - shell.js already handles it
    } catch (_error) {
      this.logger.warn(`Could not copy logo file: ${_error.message}`);
    }
  }


  async copyCheatsheet() {
    try {
      this.logger.info('Installing Sigao cheatsheets...');

      // Find the cheatsheet files in the package
      const currentFileUrl = new URL(import.meta.url);
      // Go up from modules/setup/shell-enhancements.js to src dir
      const modulesDir = path.dirname(path.dirname(currentFileUrl.pathname));
      const srcDir = path.dirname(modulesDir);

      // Copy main cheatsheet
      const sourceCheatsheet = path.join(srcDir, 'cheatsheet.md');
      const destCheatsheet = path.join(os.homedir(), '.sigao-cheatsheet.md');
      await fs.copyFile(sourceCheatsheet, destCheatsheet);

      // Copy utilities cheatsheet
      const sourceUtilsCheatsheet = path.join(srcDir, 'cheatsheet-utils.md');
      const destUtilsCheatsheet = path.join(os.homedir(), '.sigao-cheatsheet-utils.md');
      await fs.copyFile(sourceUtilsCheatsheet, destUtilsCheatsheet);

      this.logger.success('Cheatsheets installed:');
      this.logger.info('  Type "cheat" for command reference');
      this.logger.info('  Type "cheat-utils" for utilities guide');
    } catch (_error) {
      this.logger.warn(`Could not copy cheatsheet files: ${_error.message}`);
    }
  }

  async pathExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async verify() {
    const checks = [
      await this.pathExists(path.join(os.homedir(), 'dev')),
      await this.pathExists(path.join(os.homedir(), 'dev/README.md')),
      await this.pathExists(path.join(os.homedir(), '.sigao-logo.ans')),
      await this.pathExists(path.join(os.homedir(), '.sigao-cheatsheet.md')),
      await this.pathExists(path.join(os.homedir(), '.sigao-cheatsheet-utils.md'))
    ];

    return checks.every(check => check);
  }
}
