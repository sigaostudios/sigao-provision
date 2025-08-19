# repos - List GitHub Repositories

Display all your GitHub repositories with visual indicators for visibility.

## Usage

```bash
repos
repos | grep sigao
repos | wc -l
```

## Description

The `repos` function uses the GitHub CLI to fetch and display all repositories you have access to, including:
- Personal repositories
- Organization repositories
- Repositories where you're a collaborator

Each repository is displayed with a visual indicator:
- 🔒 Private repositories
- 📂 Public repositories

## Examples

### List All Repositories
```bash
repos
# Output:
# 🔒 sigaostudios/internal-tools
# 📂 sigaostudios/sigao-ai-devkit
# 🔒 personal/my-private-project
# 📂 personal/open-source-contrib
```

### Filter Repositories
```bash
# Find all Sigao repositories
repos | grep sigao

# Find all private repositories
repos | grep "🔒"

# Find all public repositories
repos | grep "📂"
```

### Count Repositories
```bash
# Total repository count
repos | wc -l

# Count private repositories
repos | grep "🔒" | wc -l
```

### Select Repository Interactively
```bash
# Use with fzf for interactive selection
repos | fzf --ansi | sed 's/^[🔒📂] //'
```

## Implementation

```bash
repos() {
  echo "Fetching your GitHub repositories..."
  gh repo list --limit 1000 --json nameWithOwner,isPrivate | \
  jq -r '.[] | 
    if .isPrivate then "🔒 " else "📂 " end + .nameWithOwner' | \
  sort
}
```

## Requirements

- GitHub CLI (`gh`) must be installed
- You must be authenticated with `gh auth login`
- `jq` is required for JSON parsing

## Advanced Usage

### Clone Selected Repository
```bash
# Combine with ghclone
repo=$(repos | fzf --ansi | sed 's/^[🔒📂] //')
ghclone $repo
```

### Export Repository List
```bash
# Save to file
repos > my-repos.txt

# Export as JSON
gh repo list --limit 1000 --json nameWithOwner,isPrivate > repos.json
```

### Filter by Organization
```bash
# List only sigaostudios repos
gh repo list sigaostudios --limit 100
```

## Related Commands

- `ghclone` - Clone repositories using GitHub CLI
- `gh` - GitHub CLI
- `projects` - List local git projects

## See Also

- `sigao help gh` - GitHub CLI usage
- `sigao help ghclone` - Clone with GitHub CLI
- GitHub CLI docs: https://cli.github.com/