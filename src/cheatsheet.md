# 🚀 Sigao AI DevKit Cheatsheet

## 📁 Directory Navigation

| Command | Description |
|---------|-------------|
| `dev` | Go to ~/dev directory |
| `devs` | Go to ~/dev/sigaostudios |
| `devp` | Go to ~/dev/personal |
| `devw` | Go to ~/dev/work |
| `proj` | Navigate to project (see examples below) |
| `projects` | List all projects in ~/dev |
| `mkcd <dir>` | Make directory and cd into it |
| `...` | Go up 2 directories |
| `....` | Go up 3 directories |
| `.....` | Go up 4 directories |

### Project Navigation Examples
- `proj` - Go to ~/dev
- `proj myapp` - Find and go to myapp in any org
- `proj sigaostudios myapp` - Go to specific org/project

## 🔥 Git Shortcuts

| Command | Description |
|---------|-------------|
| `g` | git |
| `gs` | git status |
| `ga` | git add |
| `gc` | git commit |
| `gp` | git push |
| `gl` | git log (pretty graph) |
| `gd` | git diff |
| `gb` | git branch |
| `gco` | git checkout |
| `gcb` | git checkout -b |
| `gm` | git merge |
| `gr` | git rebase |
| `gf` | git fetch |
| `clone` | git clone |
| `worktree-add <branch>` | Create worktree for branch |

## 🐙 GitHub CLI

| Command | Description |
|---------|-------------|
| `repos` | List all your GitHub repos |
| `ghclone <repo>` | Clone repo using gh |
| `ghpr` | List pull requests |
| `ghprc` | Create pull request |
| `ghprv` | View pull request |
| `ghis` | List issues |
| `ghisc` | Create issue |
| `ghisv` | View issue |

## 🛠️ Modern CLI Tools

| Command | Tool | Description |
|---------|------|-------------|
| `cat` | bat | Better cat with syntax highlighting |
| `ls` | eza | Better ls with icons |
| `ll` | eza -la | List all files (long format) |
| `la` | eza -a | List all files |
| `lt` | eza --tree | Tree view with icons |
| `find` | fd | Fast file finder |
| `grep` | rg (ripgrep) | Fast grep |
| `ps` | procs | Better process viewer |
| `top` | btop | Beautiful system monitor |
| `z` | zoxide | Smart directory jumper |

### Zoxide Usage
- `z <partial-name>` - Jump to frecent directory
- `zi <partial-name>` - Interactive selection

### Bat (Better Cat)
- `bat file.txt` - View with syntax highlighting
- `bat -n file.txt` - Show line numbers
- `bat -A file.txt` - Show non-printable characters

### Eza (Better LS)
- `ls` - List with icons
- `ll` - Detailed list with permissions
- `lt` - Tree view
- `ls -s modified` - Sort by modification time

### Fd (Find)
- `fd pattern` - Find files matching pattern
- `fd -e txt` - Find by extension
- `fd -H pattern` - Include hidden files
- `fd -E node_modules` - Exclude directory

### Ripgrep (rg)
- `rg pattern` - Search for pattern
- `rg -i pattern` - Case insensitive
- `rg -C 3 pattern` - Show 3 lines context
- `rg --type js pattern` - Search only JS files
- `rg -l pattern` - List matching files only

### Fzf (Fuzzy Finder)
- `Ctrl+R` - Fuzzy search command history
- `Ctrl+T` - Fuzzy find files
- `Alt+C` - Fuzzy cd to directory
- `vim $(fzf)` - Open file in vim with fuzzy search

### Lazygit
- `lazygit` - Open interactive git UI
- `lg` - Alias for lazygit

## 🐳 Docker

| Command | Description |
|---------|-------------|
| `d` | docker |
| `dc` | docker-compose |
| `dps` | docker ps |
| `dpsa` | docker ps -a |
| `dim` | docker images |
| `dex <container>` | docker exec -it |
| `dlog <container>` | docker logs -f |
| `dprune` | Clean up everything |

## 🐍 Python

| Command | Description |
|---------|-------------|
| `py` | python3 |
| `pip` | pip3 |
| `venv <name>` | Create virtual environment |
| `activate` | Activate venv in current dir |

## 📦 Node.js

| Command | Description |
|---------|-------------|
| `ni` | npm install |
| `nr <script>` | npm run |
| `ns` | npm start |
| `nt` | npm test |
| `nb` | npm run build |
| `sigao` | Run Sigao CLI (always latest version) |

## 🧰 Utility Commands

| Command | Description |
|---------|-------------|
| `reload` | Reload shell configuration |
| `h` | Show command history |
| `j` | Show background jobs |
| `path` | Show PATH (one per line) |
| `now` | Current date/time |
| `week` | Current week number |
| `extract <file>` | Extract any archive |
| `cheat` | Show this cheatsheet |
| `cheat-utils` | Show detailed utilities guide |

## 🌟 Starship Prompt

Your prompt shows:
- Current directory
- Git branch and status
- Language versions (Node, Python, etc.)
- Command execution time
- Error status

## 🔧 Direnv

Automatically loads `.envrc` files:
- Create `.envrc` in project root
- Add environment variables
- Run `direnv allow` to approve

## 🎯 Tips & Tricks

### Quick Navigation
1. Use `z` (zoxide) to jump to frecent directories
2. Use `proj` to navigate projects
3. Use `...` shortcuts for going up directories

### Git Workflow
1. `gs` - Check status
2. `ga .` - Stage changes
3. `gc -m "message"` - Commit
4. `gp` - Push

### File Operations
1. `fd pattern | fzf` - Find and select files
2. `rg pattern -l | fzf | xargs vim` - Search and edit
3. `lt` - See directory structure

### Shell Features
- Tab completion for everything
- Command history with `Ctrl+R`
- Directory history with `z`
- Auto-switching Node versions with .nvmrc

## 🪟 WSL-Specific Commands

| Command | Description |
|---------|-------------|
| `code <file/dir>` | Open in VS Code |
| `browse <url>` | Open URL in Windows browser |
| `explorer <path>` | Open Windows Explorer |
| `chrome <url>` | Open in Chrome (if installed) |
| `firefox <url>` | Open in Firefox (if installed) |
| `edge <url>` | Open in Edge (if installed) |

### WSL Tips
- Windows tools are available but PATH is cleaned to prevent conflicts
- Use `browse` to open any URL or file in default Windows app
- VS Code and browsers are preserved in PATH

## 📚 More Help

- `sigao help` - Sigao CLI help
- `<command> --help` - Help for any command
- `man <command>` - Manual pages
- `tldr <command>` - Simplified help (if installed)

---
💡 Pro tip: Type `cheat` anytime to see this guide!