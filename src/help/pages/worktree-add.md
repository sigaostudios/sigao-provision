# worktree-add - Git Worktree Helper

Quickly create and switch to a new git worktree for branch-based development.

## Usage

```bash
worktree-add branch-name
worktree-add feature/new-feature
worktree-add bugfix/issue-123
```

## Description

The `worktree-add` function simplifies the process of creating git worktrees, which allow you to have multiple branches checked out simultaneously in different directories. This is particularly useful for:

- Working on multiple features in parallel
- Quick bug fixes without disrupting current work
- Code reviews without switching branches
- Testing different versions side by side

## Examples

### Create Feature Branch Worktree
```bash
# From main project directory
worktree-add feature/user-auth
# Creates ../feature-user-auth/ with the new branch
# Automatically switches to the new worktree directory
```

### Create Bugfix Worktree
```bash
worktree-add bugfix/login-error
# Creates ../bugfix-login-error/ with the new branch
# Changes to that directory
```

### Typical Workflow
```bash
# In ~/dev/myproject (main branch)
worktree-add feature/new-ui

# Now in ~/dev/feature-new-ui
git status  # On branch feature/new-ui

# Work on feature...
git add .
git commit -m "Implement new UI"

# Switch back to main project
cd ../myproject

# Remove worktree when done
git worktree remove ../feature-new-ui
```

## Behavior

1. Creates a new git worktree in a sibling directory
2. Directory name is branch name with slashes replaced by dashes
3. Creates the branch if it doesn't exist
4. Automatically changes to the new worktree directory
5. The worktree shares the same repository but has its own working directory

## Implementation

```bash
worktree-add() {
  if [ -z "$1" ]; then
    echo "Usage: worktree-add <branch-name>"
    return 1
  fi
  
  local branch="$1"
  local worktree_dir="../${branch//\//-}"
  
  git worktree add "$worktree_dir" -b "$branch" && cd "$worktree_dir"
}
```

## Git Worktree Basics

### List All Worktrees
```bash
git worktree list
```

### Remove a Worktree
```bash
# From anywhere in the repository
git worktree remove ../feature-branch-name

# Force removal if there are uncommitted changes
git worktree remove --force ../feature-branch-name
```

### Prune Stale Worktrees
```bash
git worktree prune
```

## Best Practices

- Name branches descriptively: `feature/`, `bugfix/`, `hotfix/`
- Clean up worktrees after merging branches
- Don't create worktrees inside other worktrees
- Use worktrees for parallel development, not long-term branches

## Related Commands

- `git worktree` - Native git worktree commands
- `gb` - List git branches
- `gcb` - Create and checkout new branch

## See Also

- `sigao help git` - Git aliases and shortcuts
- Git documentation: `man git-worktree`