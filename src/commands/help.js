import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Command } from 'commander';
import { createLogger } from '../utils/logger.js';
import { checkCommandExists } from '../utils/shell.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logger = createLogger();

// Available help pages
const HELP_PAGES = {
  // Modern CLI Tools
  'zoxide': { title: 'Zoxide - Smart Directory Jumper', category: 'CLI Tools' },
  'fzf': { title: 'FZF - Fuzzy Finder', category: 'CLI Tools' },
  'ripgrep': { title: 'Ripgrep - Fast Text Search', category: 'CLI Tools' },
  'fd': { title: 'fd - Fast File Finder', category: 'CLI Tools' },
  'bat': { title: 'bat - Better Cat', category: 'CLI Tools' },
  'eza': { title: 'eza - Modern ls', category: 'CLI Tools' },
  'lazygit': { title: 'Lazygit - Git UI', category: 'CLI Tools' },
  'htop': { title: 'htop - Interactive Process Viewer', category: 'CLI Tools' },
  'btop': { title: 'btop - Resource Monitor', category: 'CLI Tools' },
  'ncdu': { title: 'ncdu - Disk Usage Analyzer', category: 'CLI Tools' },
  'tldr': { title: 'tldr - Simplified Man Pages', category: 'CLI Tools' },
  'httpie': { title: 'HTTPie - HTTP Client', category: 'CLI Tools' },
  'jq': { title: 'jq - JSON Processor', category: 'CLI Tools' },
  'tmux': { title: 'tmux - Terminal Multiplexer', category: 'CLI Tools' },
  'procs': { title: 'procs - Modern ps', category: 'CLI Tools' },
  'glow': { title: 'Glow - Markdown Renderer', category: 'CLI Tools' },

  // Development Tools
  'git': { title: 'Git - Version Control', category: 'Development' },
  'gh': { title: 'GitHub CLI', category: 'Development' },
  'docker': { title: 'Docker - Containerization', category: 'Development' },
  'node': { title: 'Node.js & npm (via NVM)', category: 'Development' },
  'python': { title: 'Python & pip (via pyenv)', category: 'Development' },
  'direnv': { title: 'direnv - Environment Management', category: 'Development' },
  'starship': { title: 'Starship - Shell Prompt', category: 'Development' },
  'claude': { title: 'Claude Code CLI', category: 'Development' },
  'dotnet': { title: '.NET SDK', category: 'Development' },
  'azure': { title: 'Azure CLI', category: 'Development' },

  // Shell Functions
  'mkcd': { title: 'mkcd - Make and Enter Directory', category: 'Shell Functions' },
  'extract': { title: 'extract - Universal Archive Extractor', category: 'Shell Functions' },
  'proj': { title: 'proj - Project Navigation', category: 'Shell Functions' },
  'projects': { title: 'projects - List All Projects', category: 'Shell Functions' },
  'repos': { title: 'repos - List GitHub Repositories', category: 'Shell Functions' },
  'ghclone': { title: 'ghclone - Clone with GitHub CLI', category: 'Shell Functions' },
  'worktree-add': { title: 'worktree-add - Git Worktree Helper', category: 'Shell Functions' },
  'cheat': { title: 'cheat - Show Command Cheatsheet', category: 'Shell Functions' },
  'cheat-utils': { title: 'cheat-utils - Show Utilities Guide', category: 'Shell Functions' },

  // Sigao Features
  'work': { title: 'Workpackage Automation', category: 'Sigao' },
  'generate': { title: 'Generate Workpackages from PRD', category: 'Sigao' },
  'sigao': { title: 'Sigao CLI Overview', category: 'Sigao' },
  'aliases': { title: 'Shell Aliases & Functions', category: 'Sigao' },
  'navigation': { title: 'Project Navigation', category: 'Sigao' },
  'shell': { title: 'Shell Configuration', category: 'Sigao' }
};

async function displayHelp(topic, usePager = false) {
  const helpDir = join(__dirname, '..', 'help', 'pages');
  const helpFile = join(helpDir, `${topic}.md`);

  try {
    const content = await fs.readFile(helpFile, 'utf8');

    // Check if glow is available
    if (await checkCommandExists('glow')) {
      try {
        // Use glow with stdin to avoid temp file issues
        const { execa } = await import('execa');
        const glowArgs = usePager ? ['-p', '-'] : ['-'];
        const glowProcess = execa('glow', glowArgs, {
          stdin: 'pipe',
          stdout: 'inherit',
          stderr: 'inherit'
        });

        glowProcess.stdin.write(content);
        glowProcess.stdin.end();

        await glowProcess;
      } catch (_glowError) {
        // If glow fails, fall back to console
        console.log(content);
      }
    } else {
      // Fallback to simple display
      console.log(content);
    }
  } catch (_error) {
    logger.error(`Help page for "${topic}" not found.`);
    logger.error(`Looked in: ${helpFile}`);
    logger.info('Try "sigao help" to see available topics.');
  }
}

async function listHelpTopics(usePager = false) {
  const header = `
# 🚀 Sigao AI DevKit Help

Available help topics organized by category:
`;

  const categories = {};
  for (const [key, info] of Object.entries(HELP_PAGES)) {
    if (!categories[info.category]) {
      categories[info.category] = [];
    }
    categories[info.category].push({ key, ...info });
  }

  let content = header;

  for (const [category, topics] of Object.entries(categories)) {
    content += `\n## ${category}\n\n`;
    for (const topic of topics) {
      content += `- **${topic.key}** - ${topic.title}\n`;
    }
  }

  content += `
## Usage

\`\`\`bash
# View help for a specific topic
sigao help <topic>

# View help with pager mode
sigao help -p <topic>

# Examples
sigao help zoxide
sigao help work
sigao help -p git
\`\`\`

## Quick References

- **sigao cheat** - Quick command reference
- **sigao help** - This help index
- **sigao help <tool>** - Detailed help for a specific tool
`;

  // Display using glow if available
  if (await checkCommandExists('glow')) {
    try {
      // Use glow with stdin to avoid temp file issues
      const { execa } = await import('execa');
      const glowArgs = usePager ? ['-p', '-'] : ['-'];
      const glowProcess = execa('glow', glowArgs, {
        stdin: 'pipe',
        stdout: 'inherit',
        stderr: 'inherit'
      });

      glowProcess.stdin.write(content);
      glowProcess.stdin.end();

      await glowProcess;
    } catch (_glowError) {
      // If glow fails, fall back to console
      console.log(content);
    }
  } else {
    console.log(content);
  }
}

export function createHelpCommand() {
  const help = new Command('help')
    .description('Show detailed help for tools and features')
    .argument('[topic]', 'Help topic to display')
    .option('-p, --pager', 'Use pager mode for scrolling through content')
    .action(async (topic, options) => {
      if (!topic) {
        await listHelpTopics(options.pager);
      } else {
        await displayHelp(topic, options.pager);
      }
    });

  return help;
}
