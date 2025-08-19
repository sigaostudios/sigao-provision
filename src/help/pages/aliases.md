# Shell Aliases & Functions

Sigao sets up numerous aliases and functions to speed up your workflow.

## Directory Navigation

| Alias | Command | Description |
|-------|---------|-------------|
| `dev` | `cd ~/dev` | Go to development directory |
| `devs` | `cd ~/dev/sigaostudios` | Sigao projects |
| `devp` | `cd ~/dev/personal` | Personal projects |
| `devw` | `cd ~/dev/work` | Work projects |
| `...` | `cd ../..` | Up 2 directories |
| `....` | `cd ../../..` | Up 3 directories |
| `.....` | `cd ../../../..` | Up 4 directories |

## Git Aliases

| Alias | Command | Description |
|-------|---------|-------------|
| `g` | `git` | Git command |
| `gs` | `git status` | Check status |
| `ga` | `git add` | Stage files |
| `gc` | `git commit` | Commit changes |
| `gp` | `git push` | Push to remote |
| `gl` | `git log --oneline --graph --decorate` | Pretty log |
| `gd` | `git diff` | Show differences |
| `gb` | `git branch` | List branches |
| `gco` | `git checkout` | Switch branches |
| `gcb` | `git checkout -b` | Create branch |
| `gm` | `git merge` | Merge branch |
| `gr` | `git rebase` | Rebase |
| `gf` | `git fetch` | Fetch updates |
| `clone` | `git clone` | Clone repo |

## GitHub CLI Aliases

| Alias | Function | Description |
|-------|----------|-------------|
| `repos` | Custom | List your GitHub repos |
| `ghclone` | Custom | Clone with gh |
| `ghpr` | `gh pr list` | List PRs |
| `ghprc` | `gh pr create` | Create PR |
| `ghprv` | `gh pr view` | View PR |
| `ghis` | `gh issue list` | List issues |
| `ghisc` | `gh issue create` | Create issue |
| `ghisv` | `gh issue view` | View issue |

## Modern CLI Tools

| Alias | Command | Description |
|-------|---------|-------------|
| `cat` | `bat` | Syntax highlighting |
| `ls` | `eza --icons` | Icons in listings |
| `ll` | `eza -la --icons` | Detailed list |
| `la` | `eza -a --icons` | All files |
| `lt` | `eza --tree --icons` | Tree view |
| `find` | `fd` | Fast file finder |
| `grep` | `rg` | Fast text search |
| `ps` | `procs` | Better process list |
| `top` | `btop` | Resource monitor |
| `vim` | `nvim` | Neovim (if installed) |
| `z` | `zoxide` | Smart cd |
| `lg` | `lazygit` | Git UI |

## Docker Aliases

| Alias | Command | Description |
|-------|---------|-------------|
| `d` | `docker` | Docker command |
| `dc` | `docker-compose` | Docker Compose |
| `dps` | `docker ps` | List containers |
| `dpsa` | `docker ps -a` | All containers |
| `dim` | `docker images` | List images |
| `dex` | `docker exec -it` | Execute in container |
| `dlog` | `docker logs -f` | Follow logs |
| `dprune` | `docker system prune -a` | Clean everything |

## Python Aliases

| Alias | Command | Description |
|-------|---------|-------------|
| `py` | `python3` | Python 3 |
| `pip` | `pip3` | Pip 3 |
| `venv` | `python3 -m venv` | Create virtualenv |
| `activate` | `source venv/bin/activate` | Activate venv |

## Node.js Aliases

| Alias | Command | Description |
|-------|---------|-------------|
| `ni` | `npm install` | Install packages |
| `nr` | `npm run` | Run script |
| `ns` | `npm start` | Start project |
| `nt` | `npm test` | Run tests |
| `nb` | `npm run build` | Build project |
| `sigao` | `npx @sigaostudios/sigao-cli` | Sigao CLI |

## Utility Aliases

| Alias | Command | Description |
|-------|---------|-------------|
| `reload` | `source ~/.zshrc` or `~/.bashrc` | Reload config |
| `h` | `history` | Command history |
| `j` | `jobs` | Background jobs |
| `which` | `type -a` | Find command |
| `path` | Custom | Show PATH entries |
| `now` | `date +"%Y-%m-%d %H:%M:%S"` | Current time |
| `week` | `date +%V` | Week number |

## Safety Aliases

| Alias | Command | Description |
|-------|---------|-------------|
| `rm` | `rm -i` | Confirm removal |
| `cp` | `cp -i` | Confirm copy |
| `mv` | `mv -i` | Confirm move |

## Custom Functions

### mkcd - Make and Enter Directory
```bash
mkcd new-dir
# Creates new-dir and changes into it
```

### extract - Universal Archive Extractor
```bash
extract file.tar.gz
extract file.zip
# Automatically detects and extracts archive
```

### proj - Project Navigation
```bash
proj              # Go to ~/dev
proj myapp        # Find myapp in any org
proj work client  # Go to ~/dev/work/client
```

### projects - List All Projects
```bash
projects
# Lists all git repositories under ~/dev
```

### worktree-add - Git Worktree Helper
```bash
worktree-add feature-branch
# Creates ../feature-branch worktree
```

### cheat - Show Cheatsheet
```bash
cheat       # Show command reference
cheat-utils # Show utilities guide
```

### repos - List GitHub Repositories
```bash
repos
# Shows all your GitHub repositories
```

### ghclone - Clone with GitHub CLI
```bash
ghclone repo-name
ghclone org/repo-name
```

## WSL-Specific (Windows Subsystem for Linux)

| Alias/Command | Description |
|---------------|-------------|
| `code` | Open in VS Code |
| `browse` | Open URL in Windows browser |
| `explorer` | Open Windows Explorer |
| `chrome` | Open in Chrome |
| `firefox` | Open in Firefox |
| `edge` | Open in Edge |

## Environment Variables

Key environment variables set by Sigao:

```bash
# If using pyenv
export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"

# If using NVM
export NVM_DIR="$HOME/.nvm"

# Local binaries
export PATH="$HOME/.local/bin:$PATH"
```

## Tips

1. **Tab Completion**: Most aliases support tab completion
2. **Combining**: Chain aliases: `gs && ga . && gc -m "msg" && gp`
3. **Override**: Use `\command` to bypass alias: `\ls`
4. **Check alias**: Use `type aliasname` to see definition
5. **Custom aliases**: Add your own to `~/.bashrc` or `~/.zshrc`

## Adding Your Own Aliases

Edit your shell config file:
```bash
# For Zsh
vim ~/.zshrc

# For Bash
vim ~/.bashrc
```

Add aliases:
```bash
alias myalias='my command'
alias deploy='npm run build && npm run deploy'
```

Reload config:
```bash
reload  # or source ~/.zshrc
```

## See Also

- `sigao help navigation` - Project navigation
- `sigao help git` - Git workflow
- `sigao help zoxide` - Smart directory jumping