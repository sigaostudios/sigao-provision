# ghclone - Clone with GitHub CLI

Clone GitHub repositories using the GitHub CLI with automatic directory navigation.

## Usage

```bash
# Clone your own repository
ghclone my-repo

# Clone from specific organization/user
ghclone sigaostudios/sigao-cli

# Clone and specify directory name
ghclone my-repo my-local-name
```

## Description

The `ghclone` function is a wrapper around `gh repo clone` that automatically changes into the cloned directory after cloning. It simplifies the common workflow of cloning a repository and immediately starting work in it.

## Examples

### Clone Personal Repository
```bash
ghclone my-awesome-project
# Clones https://github.com/YOUR-USERNAME/my-awesome-project
# Changes to ./my-awesome-project/
```

### Clone Organization Repository
```bash
ghclone sigaostudios/sigao-ai-devkit
# Clones https://github.com/sigaostudios/sigao-ai-devkit
# Changes to ./sigao-ai-devkit/
```

### Clone with Custom Directory
```bash
ghclone sigaostudios/project work-project
# Clones to ./work-project/
# Changes to ./work-project/
```

### Clone Private Repository
```bash
ghclone my-private-repo
# Works seamlessly with private repos you have access to
# GitHub CLI handles authentication
```

## Implementation

```bash
ghclone() {
  if [ -z "$1" ]; then
    echo "Usage: ghclone <repo> [directory]"
    return 1
  fi
  
  gh repo clone "$@" && cd "$(basename "${2:-$1}")"
}
```

## Behavior

- Uses GitHub CLI authentication (must run `gh auth login` first)
- Automatically navigates into cloned directory
- Supports all `gh repo clone` options
- Works with private repositories you have access to
- Handles HTTPS/SSH based on your git configuration

## Advanced Usage

### Clone All Organization Repos
```bash
# Clone all repos from an organization
gh repo list sigaostudios --limit 100 --json name -q '.[].name' | \
while read repo; do
  ghclone "sigaostudios/$repo"
done
```

### Clone with Specific Protocol
```bash
# Force HTTPS
gh config set git_protocol https
ghclone my-repo

# Force SSH
gh config set git_protocol ssh
ghclone my-repo
```

### Clone Fork and Set Upstream
```bash
# Clone your fork and set upstream
ghclone my-fork
cd my-fork
gh repo set-default OWNER/ORIGINAL-REPO
```

## Requirements

- GitHub CLI (`gh`) must be installed
- Authenticated with `gh auth login`
- Git must be installed

## Related Commands

- `repos` - List all your GitHub repositories
- `gh` - GitHub CLI
- `git clone` - Standard git clone
- `proj` - Navigate to existing projects

## See Also

- `sigao help gh` - GitHub CLI overview
- `sigao help repos` - List GitHub repositories
- GitHub CLI docs: https://cli.github.com/