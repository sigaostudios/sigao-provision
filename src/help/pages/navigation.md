# Project Navigation

Sigao provides powerful navigation commands to move quickly between projects and directories.

## Directory Shortcuts

| Command | Description |
|---------|-------------|
| `dev` | Go to ~/dev directory |
| `devs` | Go to ~/dev/sigaostudios |
| `devp` | Go to ~/dev/personal |
| `devw` | Go to ~/dev/work |
| `...` | Go up 2 directories |
| `....` | Go up 3 directories |
| `.....` | Go up 4 directories |

## Project Navigation

The `proj` command helps you navigate to projects quickly:

```bash
# Go to ~/dev
proj

# Find project in any organization
proj myproject

# Go to specific org/project
proj sigaostudios backend-api
```

### How It Works

1. **No arguments**: Changes to ~/dev
2. **One argument**: Searches for project name in all orgs
3. **Two arguments**: Goes directly to org/project

### Directory Structure

Sigao assumes this structure:
```
~/dev/
├── personal/
│   ├── project1/
│   └── project2/
├── work/
│   ├── client-a/
│   └── client-b/
├── sigaostudios/
│   ├── backend/
│   └── frontend/
└── opensource/
    ├── contrib1/
    └── contrib2/
```

## List All Projects

```bash
# Show all projects
projects

# Output:
# opensource/contrib1
# personal/blog
# sigaostudios/backend
# work/client-website
```

## Smart Directory Jumping (Zoxide)

Use `z` for intelligent directory navigation:

```bash
# Jump to most used directory containing "backend"
z backend

# Jump with multiple keywords
z work client

# Interactive selection
zi proj
```

See `sigao help zoxide` for more details.

## Creating Project Structure

### Quick Directory Creation
```bash
# Make directory and cd into it
mkcd ~/dev/personal/new-project
```

### Setting Up New Project
```bash
# Navigate to organization
devp  # or devw, devs

# Create project with structure
mkcd awesome-app
mkdir -p src tests docs .github/workflows
touch README.md .gitignore
git init
```

## Git Worktrees for Projects

Organize branches as separate directories:

```bash
cd ~/dev/sigaostudios
git clone https://github.com/org/repo.git repo/main
cd repo/main
worktree-add feature-auth
worktree-add bugfix-login
```

Result:
```
repo/
├── main/           # Main branch
├── feature-auth/   # Feature branch
└── bugfix-login/   # Bugfix branch
```

## Environment Variables

Each project can have its own environment:

```bash
cd ~/dev/work/client-project

# Create .envrc
echo 'export API_KEY="secret"' > .envrc

# Allow direnv to load it
direnv allow
```

See `sigao help direnv` for more.

## VSCode Integration

```bash
# Open current directory in VSCode
code .

# Open specific project
proj myapp && code .

# Open file
code README.md
```

## Tips & Tricks

1. **Combine with fzf**:
   ```bash
   # Fuzzy find and cd to project
   cd $(find ~/dev -name ".git" -type d | sed 's/\/.git$//' | fzf)
   ```

2. **Recent directories**:
   ```bash
   # Use zoxide to jump to recent projects
   z myproj
   ```

3. **Project templates**:
   ```bash
   # Create a template script
   ~/dev/.tools/scripts/new-node-project.sh
   ```

4. **Quick status check**:
   ```bash
   # Check git status of all projects
   find ~/dev -name ".git" -type d -exec sh -c 'cd "${0%/.git}" && pwd && git status -s' {} \;
   ```

## Navigation Workflow Example

```bash
# Start your day
dev              # Go to dev directory
projects         # List all projects

# Work on specific project
proj backend     # or z backend
gs               # Check git status
lg               # Open lazygit

# Switch projects quickly
z frontend       # Jump to frontend project
code .           # Open in editor

# Create new feature branch
worktree-add feature-new-ui
cd ../feature-new-ui
```

## Troubleshooting

### Project Not Found
- Check if it exists: `projects | grep myproject`
- Use interactive mode: `zi proj`
- Navigate manually first time for zoxide to learn

### Wrong Directory Selected
- Use more specific keywords
- Use full org/project syntax
- Clear zoxide data: `zoxide remove /wrong/path`

## See Also

- `sigao help zoxide` - Smart directory jumping
- `sigao help git` - Git integration
- `sigao help aliases` - All available aliases