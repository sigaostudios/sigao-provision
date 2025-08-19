import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Command } from 'commander';
import { checkCommandExists } from '../utils/shell.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CHEATSHEET_CONTENT = `# 🚀 Sigao AI DevKit Quick Reference

## Essential Commands

### Directory Navigation
- \`dev\` - Go to ~/dev directory
- \`proj [name]\` - Navigate to project
- \`z <partial>\` - Jump to directory (zoxide)
- \`...\` / \`....\` - Go up 2/3 directories

### Git Shortcuts
- \`g\` - git
- \`gs\` - git status
- \`ga\` - git add
- \`gc\` - git commit
- \`gp\` - git push
- \`gl\` - git log (graph)
- \`lazygit\` / \`lg\` - Interactive git UI

### Modern CLI Tools
- \`cat\` → \`bat\` - Syntax highlighting
- \`ls\` → \`eza\` - Icons & tree view
- \`find\` → \`fd\` - Fast file finder
- \`grep\` → \`rg\` - Fast text search
- \`top\` → \`btop\` - Beautiful monitor
- \`cd\` → \`z\` - Smart navigation

### Key Bindings
- \`Ctrl+R\` - Fuzzy search history
- \`Ctrl+T\` - Fuzzy find files
- \`Alt+C\` - Fuzzy cd

### Sigao Commands
- \`sigao\` - Run Sigao CLI
- \`sigao help\` - List all help topics
- \`sigao help <tool>\` - Tool-specific help
- \`sigao work <package>\` - Run workpackage

## Getting More Help

- \`sigao help\` - Full help index
- \`sigao help <topic>\` - Detailed help
- \`man <command>\` - Traditional manuals
- \`tldr <command>\` - Simplified help

## Pro Tips

1. Use \`z\` to jump to frecent directories
2. Pipe commands to \`fzf\` for selection
3. Use \`rg -l | fzf\` to search & select
4. \`lazygit\` for visual git workflow
5. Tab completion works everywhere!
`;

async function displayCheatsheet() {
  // Check if glow is available
  if (await checkCommandExists('glow')) {
    try {
      // Use glow with stdin to avoid temp file issues
      const { execa } = await import('execa');
      const glowProcess = execa('glow', ['-'], {
        stdin: 'pipe',
        stdout: 'inherit',
        stderr: 'inherit'
      });

      glowProcess.stdin.write(CHEATSHEET_CONTENT);
      glowProcess.stdin.end();

      await glowProcess;
    } catch (_glowError) {
      // If glow fails, fall back to console
      console.log(CHEATSHEET_CONTENT);
    }
  } else {
    // Fallback to simple display
    console.log(CHEATSHEET_CONTENT);
  }
}

export function createCheatCommand() {
  const cheat = new Command('cheat')
    .description('Show quick command reference')
    .action(async () => {
      await displayCheatsheet();
    });

  return cheat;
}
