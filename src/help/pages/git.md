# Git - Version Control

Sigao provides numerous Git aliases and enhancements to streamline your workflow.

## Git Aliases

| Alias | Command | Description |
|-------|---------|-------------|
| `g` | `git` | Short git command |
| `gs` | `git status` | Check status |
| `ga` | `git add` | Stage changes |
| `gc` | `git commit` | Commit changes |
| `gp` | `git push` | Push to remote |
| `gl` | `git log --oneline --graph --decorate` | Pretty log |
| `gd` | `git diff` | Show changes |
| `gb` | `git branch` | List branches |
| `gco` | `git checkout` | Switch branches |
| `gcb` | `git checkout -b` | Create new branch |
| `gm` | `git merge` | Merge branches |
| `gr` | `git rebase` | Rebase branch |
| `gf` | `git fetch` | Fetch from remote |
| `clone` | `git clone` | Clone repository |

## Common Workflows

### Starting New Feature
```bash
# Create and switch to new branch
gcb feature/new-feature

# Or using git directly
git checkout -b feature/new-feature
```

### Basic Workflow
```bash
# Check what changed
gs

# Stage specific files
ga src/file1.js src/file2.js

# Stage everything
ga .

# Commit with message
gc -m "Add new feature"

# Push to remote
gp
```

### Reviewing Changes
```bash
# See unstaged changes
gd

# See staged changes
gd --staged

# See log with graph
gl

# See detailed log
git log -p
```

## Git Worktrees

Sigao includes a helper for Git worktrees:

```bash
# Add new worktree for a branch
worktree-add feature-branch

# This creates ../feature-branch and checks it out
```

### Worktree Benefits
- Work on multiple branches simultaneously
- No need to stash/unstash
- Keep different builds separate
- Faster branch switching

### Worktree Setup Example
```bash
cd ~/dev/sigaostudios
git clone https://github.com/user/repo.git repo/main
cd repo/main
worktree-add feature-1
worktree-add bugfix-1
```

Structure:
```
repo/
├── main/       # Main branch
├── feature-1/  # Feature branch
└── bugfix-1/   # Bugfix branch
```

## Interactive Git UI

Use Lazygit for a full-featured Git UI:

```bash
lazygit
# or
lg
```

Lazygit features:
- Visual staging/unstaging
- Interactive rebasing
- Branch management
- Stash management
- Cherry-picking
- Diff viewing

## Advanced Git Commands

### Stashing
```bash
# Stash changes
git stash

# List stashes
git stash list

# Apply latest stash
git stash pop

# Apply specific stash
git stash apply stash@{2}
```

### Interactive Rebase
```bash
# Rebase last 3 commits
git rebase -i HEAD~3

# Rebase onto main
git rebase -i main
```

### Cherry-pick
```bash
# Apply specific commit
git cherry-pick abc123

# Cherry-pick range
git cherry-pick abc123..def456
```

## Git Configuration

Sigao respects your global Git config. Common settings:

```bash
# Set user info
git config --global user.name "Your Name"
git config --global user.email "you@example.com"

# Useful aliases
git config --global alias.unstage "reset HEAD --"
git config --global alias.last "log -1 HEAD"

# Better diffs
git config --global diff.algorithm histogram
```

## Integration with GitHub

See `sigao help gh` for GitHub CLI integration.

## Tips & Tricks

1. **Quick amend**: `git commit --amend` to modify last commit
2. **See branches**: `git branch -vv` shows tracking info
3. **Clean branches**: `git branch --merged | grep -v main | xargs git branch -d`
4. **Find lost commits**: `git reflog` shows all ref updates
5. **Blame with date**: `git blame -L 10,20 file.js`

## Troubleshooting

### Merge Conflicts
```bash
# See conflicted files
git status

# After resolving
ga .
gc
```

### Undo Operations
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Undo git add
git reset HEAD file.js
```

## See Also

- `sigao help gh` - GitHub CLI integration
- `sigao help lazygit` - Interactive Git UI
- Pro Git Book: https://git-scm.com/book