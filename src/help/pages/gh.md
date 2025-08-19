# GitHub CLI (gh)

The GitHub CLI brings GitHub to your terminal, enabling you to work with issues, pull requests, releases, and more.

## Authentication

```bash
# Login to GitHub
gh auth login

# Check auth status
gh auth status

# Switch accounts
gh auth switch
```

## Repository Commands

### Basic Operations
```bash
# Clone repository
gh repo clone owner/repo

# Create new repo
gh repo create my-repo --public

# Fork repository
gh repo fork owner/repo

# View repo in browser
gh repo view --web
```

### Repository Info
```bash
# List your repos
gh repo list

# List org repos
gh repo list orgname

# View repo details
gh repo view owner/repo
```

## Pull Requests

### Creating PRs
```bash
# Create PR interactively
gh pr create

# Create with title and body
gh pr create --title "Feature X" --body "Description"

# Create draft PR
gh pr create --draft

# Create and set reviewers
gh pr create --reviewer user1,user2
```

### Managing PRs
```bash
# List PRs
gh pr list

# View PR details
gh pr view 123

# Check out PR locally
gh pr checkout 123

# Merge PR
gh pr merge 123

# Close PR
gh pr close 123
```

### PR Reviews
```bash
# Review PR
gh pr review 123 --approve
gh pr review 123 --request-changes
gh pr review 123 --comment

# Add review comment
gh pr review 123 --comment --body "Looks good!"
```

## Issues

### Creating Issues
```bash
# Create issue interactively
gh issue create

# Create with details
gh issue create --title "Bug" --body "Description" --label bug

# Assign issue
gh issue create --assignee @me
```

### Managing Issues
```bash
# List issues
gh issue list

# View issue
gh issue view 456

# Close issue
gh issue close 456

# Reopen issue
gh issue reopen 456

# Edit issue
gh issue edit 456
```

## Sigao Aliases

Sigao provides these GitHub CLI aliases:

| Alias | Command | Description |
|-------|---------|-------------|
| `repos` | Custom function | List all your repos |
| `ghclone` | Custom function | Clone using gh |
| `ghpr` | `gh pr list` | List PRs |
| `ghprc` | `gh pr create` | Create PR |
| `ghprv` | `gh pr view` | View PR |
| `ghis` | `gh issue list` | List issues |
| `ghisc` | `gh issue create` | Create issue |
| `ghisv` | `gh issue view` | View issue |

## Workflows

### Feature Development
```bash
# 1. Create feature branch
gcb feature/new-feature

# 2. Make changes and commit
ga . && gc -m "Add feature"

# 3. Push branch
gp -u origin feature/new-feature

# 4. Create PR
gh pr create --fill

# 5. After review, merge
gh pr merge --squash --delete-branch
```

### Code Review
```bash
# List PRs needing review
gh pr list --reviewer @me

# Check out PR
gh pr checkout 123

# Test locally
npm test

# Approve
gh pr review --approve
```

## Advanced Features

### GitHub Actions
```bash
# List workflow runs
gh run list

# View run details
gh run view

# Watch run in progress
gh run watch

# Download artifacts
gh run download
```

### Releases
```bash
# Create release
gh release create v1.0.0 --title "Version 1.0.0" --notes "Release notes"

# Upload assets
gh release upload v1.0.0 ./dist/*

# List releases
gh release list
```

### Gists
```bash
# Create gist
gh gist create file.js

# Create secret gist
gh gist create --secret file.js

# List gists
gh gist list
```

## API Access

```bash
# Make API request
gh api /user

# GraphQL query
gh api graphql -f query='{ viewer { login } }'

# With pagination
gh api /users/octocat/repos --paginate
```

## Configuration

### Aliases
```bash
# Set gh alias
gh alias set pv 'pr view'

# List aliases
gh alias list
```

### Config
```bash
# Set default editor
gh config set editor vim

# Set default browser
gh config set browser firefox

# Use SSH for clones
gh config set git_protocol ssh
```

## Tips & Tricks

1. **Quick PR creation**: `gh pr create --fill` uses commit messages
2. **Web shortcuts**: Add `--web` to open in browser
3. **JSON output**: Add `--json` for scripting
4. **Filters**: Use labels, assignees, etc: `gh issue list --label bug`
5. **Templates**: Use issue/PR templates from repo

## Common Patterns

### Review Dashboard
```bash
# PRs I need to review
gh pr list --reviewer @me

# My PRs
gh pr list --author @me

# Issues assigned to me
gh issue list --assignee @me
```

### Bulk Operations
```bash
# Close all issues with label
gh issue list --label "wontfix" --json number -q '.[].number' | xargs -I {} gh issue close {}

# Add label to multiple issues
echo "123 456 789" | xargs -n1 -I {} gh issue edit {} --add-label "priority"
```

## See Also

- `sigao help git` - Git commands and workflows
- `sigao help navigation` - Project navigation
- GitHub CLI manual: https://cli.github.com/manual/