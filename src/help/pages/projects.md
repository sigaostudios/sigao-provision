# projects - List All Git Projects

Display all git repositories in your ~/dev directory structure.

## Usage

```bash
projects
```

## Description

The `projects` function scans your entire ~/dev directory tree to find all git repositories and displays them in a sorted list. It's useful for getting an overview of all projects you're working on across different organizations.

## Examples

### List All Projects
```bash
projects
# Output:
# opensource/awesome-tool
# personal/my-blog
# personal/side-project
# sigaostudios/sigao-ai-devkit
# sigaostudios/sigao-cli
# work/company-api
# work/company-frontend
```

## Behavior

- Searches recursively through ~/dev for directories containing .git folders
- Strips the base path to show relative paths
- Sorts results alphabetically
- Excludes the .git directories themselves from the output

## Implementation

```bash
projects() {
  find ~/dev -name ".git" -type d 2>/dev/null | 
    sed 's|/.git$||' | 
    sed "s|$HOME/dev/||" | 
    sort
}
```

## Tips & Tricks

### Count Your Projects
```bash
projects | wc -l
```

### Filter by Organization
```bash
projects | grep "^work/"
projects | grep "^personal/"
```

### Find Specific Project
```bash
projects | grep "sigao"
```

### Open Project in Editor
```bash
# Combine with fzf for interactive selection
cd ~/dev/$(projects | fzf)
```

## Related Commands

- `proj` - Navigate to a specific project
- `repos` - List GitHub repositories
- `dev` - Navigate to ~/dev directory

## See Also

- `sigao help proj` - Smart project navigation
- `sigao help navigation` - All navigation shortcuts
- `sigao help repos` - GitHub repository listing