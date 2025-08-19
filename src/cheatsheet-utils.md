# 🛠️ Sigao DevKit - Installed Utilities Guide

## 🔍 File Search & Navigation

### **fd** - Fast File Finder
A simple, fast alternative to `find` with intuitive syntax.
```bash
fd pattern                  # Find files matching pattern
fd -e js                   # Find all .js files
fd -H pattern              # Include hidden files
fd -E node_modules pattern # Exclude directories
fd -t f pattern            # Files only
fd -t d pattern            # Directories only
```

### **ripgrep (rg)** - Ultra-fast Text Search
Blazingly fast grep replacement that respects .gitignore.
```bash
rg pattern                 # Search for pattern in files
rg -i pattern             # Case insensitive search
rg -C 3 pattern           # Show 3 lines of context
rg -t js pattern          # Search only JavaScript files
rg -l pattern             # List matching files only
rg --stats pattern        # Show search statistics
```

### **fzf** - Fuzzy Finder
Interactive fuzzy finder for files, commands, and more.
```bash
Ctrl+R                    # Fuzzy search command history
Ctrl+T                    # Fuzzy find files
Alt+C                     # Fuzzy cd to directory
vim $(fzf)                # Open file with fuzzy search
kill -9 $(ps aux | fzf)   # Interactive process killer
```

### **zoxide (z)** - Smart Directory Jumper
Tracks your most used directories and lets you jump quickly.
```bash
z proj                    # Jump to most frecent dir matching "proj"
zi proj                   # Interactive selection if multiple matches
z foo bar                 # Jump to dir matching "foo" and "bar"
zoxide query proj         # Show matching directories
```

### **eza** - Modern ls Replacement
Feature-rich ls alternative with colors, icons, and Git integration.
```bash
eza                       # Basic listing with icons
eza -la                   # Long format with all files
eza --tree                # Tree view
eza -la --git             # Show Git status
eza --icons --group-directories-first
eza -s modified           # Sort by modification time
```

## 📝 File Viewing & Editing

### **bat** - Better Cat
Syntax highlighting, line numbers, and Git integration for file viewing.
```bash
bat file.py               # View with syntax highlighting
bat -n file.py            # Show line numbers
bat -A file.txt           # Show non-printable characters
bat --diff file.txt       # Show as diff
bat -p file.txt           # Plain output (no decorations)
bat --theme=TwoDark file  # Use specific theme
```

### **delta** - Beautiful Diffs
Syntax-highlighted diffs with side-by-side view.
```bash
git diff | delta          # Enhanced git diff
delta file1 file2         # Compare two files
git log -p | delta        # Enhanced git log
delta --side-by-side      # Side-by-side diff view
```

### **jq** - JSON Processor
Command-line JSON parser and transformer.
```bash
jq '.' file.json          # Pretty print JSON
jq '.users[]' api.json    # Extract users array
jq '.name' package.json   # Get specific field
jq 'keys' object.json     # List all keys
cat file.json | jq '.items | length'  # Count array items
```

## 🖥️ System Monitoring

### **btop** - Resource Monitor
Beautiful, feature-rich replacement for htop.
```bash
btop                      # Launch system monitor
# Keys inside btop:
# h - Help
# f - Filter processes
# t - Tree view
# m - Sort by memory
# p - Sort by CPU
```

### **procs** - Modern ps
Human-readable process viewer with colors.
```bash
procs                     # List all processes
procs node                # Find processes matching "node"
procs --tree              # Tree view of processes
procs --sortd cpu         # Sort by CPU usage
procs --watch node        # Watch processes live
```

### **duf** - Disk Usage
User-friendly df alternative with colors and better formatting.
```bash
duf                       # Show all mounted filesystems
duf /home                 # Show specific path
duf --only local          # Local filesystems only
duf --json                # JSON output
```

### **ncdu** - NCurses Disk Usage
Interactive disk usage analyzer.
```bash
ncdu                      # Analyze current directory
ncdu /home                # Analyze specific directory
# Keys: d=delete, q=quit, arrows=navigate
```

## 🌐 Network Tools

### **httpie** - Modern curl
User-friendly HTTP client with intuitive syntax.
```bash
http GET api.github.com/users/github
http POST httpbin.org/post name=John age=29
http PUT example.com/api/item/1 token:secret
http --download example.com/file.zip
```

### **gping** - Graphical Ping
Ping with real-time graph visualization.
```bash
gping google.com          # Ping with graph
gping 8.8.8.8 1.1.1.1     # Ping multiple hosts
gping -s                  # Simple mode
```

## 🎨 Development Tools

### **lazygit** - Terminal Git UI
Full-featured Git GUI in your terminal.
```bash
lazygit                   # Launch in current repo
lg                        # Alias for lazygit
# Keys: space=stage, c=commit, p=push, ?=help
```

### **tldr** - Simplified Man Pages
Community-driven man pages with practical examples.
```bash
tldr tar                  # Quick examples for tar
tldr git commit           # Git commit examples
tldr --update             # Update tldr database
```

### **direnv** - Directory Environments
Automatically load/unload environment variables per directory.
```bash
# Create .envrc in project:
echo 'export API_KEY=secret' > .envrc
direnv allow              # Approve the file
# Variables auto-load when you cd into directory
```

## 📊 Text Processing

### **sd** - Find & Replace
Intuitive find-and-replace (better than sed).
```bash
sd 'old' 'new' file.txt   # Replace in file
sd -i 'old' 'new' *.txt   # Replace in multiple files
sd '\n' ', ' file.txt     # Replace newlines with commas
echo "hello" | sd 'l' 'L' # Pipe support
```

### **choose** - Field Extractor
Human-friendly alternative to cut/awk.
```bash
choose 0 3                # Select fields 0 and 3
choose -f ':' 0           # Use : as delimiter
choose 2:5                # Select range of fields
ps | choose -1            # Select last field
```

## 🔧 Helper Functions (Custom)

### **proj** - Project Navigator
```bash
proj                      # Go to ~/dev
proj myapp               # Find project in any org
proj sigao myapp         # Go to specific org/project
```

### **projects** - List All Projects
```bash
projects                  # List all Git repos in ~/dev
```

### **mkcd** - Make and Enter Directory
```bash
mkcd new-project          # Create and cd into directory
```

### **extract** - Universal Archive Extractor
```bash
extract file.tar.gz       # Auto-detect and extract
extract archive.zip       # Works with any archive type
```

### **repos** - List GitHub Repositories
```bash
repos                     # List your GitHub repos with details
```

### **ghclone** - Clone from GitHub
```bash
ghclone myrepo           # Clone your repo
ghclone org/repo         # Clone specific repo
```

### **worktree-add** - Git Worktree Helper
```bash
worktree-add feature     # Create worktree for branch
```

### **cheat** - Show Main Cheatsheet
```bash
cheat                    # Show command reference
```

### **cheat-utils** - Show This Guide
```bash
cheat-utils              # Show utilities guide
```

## 🎯 Pro Tips

1. **Combine Tools**: Many tools work great together
   ```bash
   fd -e js | fzf | xargs bat        # Find, select, view
   rg -l TODO | fzf | xargs code      # Find TODOs, edit
   ps aux | fzf | awk '{print $2}' | xargs kill -9
   ```

2. **Use Aliases**: We've set up many for you
   - `ls` → `eza --icons`
   - `cat` → `bat`
   - `find` → `fd`
   - `grep` → `rg`
   - `top` → `btop`

3. **Interactive Mode**: Many tools have interactive features
   - `lazygit` for Git operations
   - `btop` for system monitoring
   - `fzf` for fuzzy selection
   - `ncdu` for disk cleanup

4. **Config Files**: Most tools support customization
   - `~/.config/bat/` - Bat themes and config
   - `~/.config/starship.toml` - Prompt customization
   - `~/.gitconfig` - Git aliases and settings

---
💡 Remember: Type `cheat` for command reference or `cheat-utils` for this guide!