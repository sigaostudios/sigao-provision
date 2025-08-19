# proj - Smart Project Navigation

Navigate quickly to projects within your ~/dev directory structure.

## Usage

```bash
# Go to ~/dev directory
proj

# Navigate to a specific project
proj myproject

# Navigate to a project in a specific organization
proj sigaostudios myapp
```

## Description

The `proj` function provides intelligent navigation to projects within your ~/dev directory. It searches through all subdirectories to find your project, supporting both direct project names and organization/project paths.

## Examples

### Navigate to Development Root
```bash
proj
# Changes to ~/dev
```

### Find and Navigate to Project
```bash
proj my-awesome-app
# Searches for 'my-awesome-app' in:
# ~/dev/personal/my-awesome-app
# ~/dev/work/my-awesome-app
# ~/dev/sigaostudios/my-awesome-app
# etc.
```

### Navigate to Specific Organization Project
```bash
proj sigaostudios sigao-cli
# Goes directly to ~/dev/sigaostudios/sigao-cli
```

## Behavior

- Without arguments: Changes to ~/dev
- With one argument: Searches all organization directories for the project
- With two arguments: Goes directly to ~/dev/org/project
- If multiple matches are found, displays all matches and navigates to the first one
- If no match is found, displays an error message

## Directory Structure

The function expects projects to be organized under ~/dev:
```
~/dev/
├── personal/
├── work/
├── opensource/
├── client-work/
├── sigaostudios/
└── .tools/
```

## Implementation

```bash
proj() {
  local base_dir="$HOME/dev"
  
  if [ $# -eq 0 ]; then
    cd "$base_dir"
  elif [ $# -eq 1 ]; then
    local project="$1"
    local matches=$(find "$base_dir" -maxdepth 2 -name "$project" -type d 2>/dev/null | grep -v "/.git")
    
    if [ -z "$matches" ]; then
      echo "Project '$project' not found in $base_dir"
      return 1
    elif [ $(echo "$matches" | wc -l) -eq 1 ]; then
      cd "$matches"
    else
      echo "Multiple matches found:"
      echo "$matches"
      cd $(echo "$matches" | head -n1)
    fi
  elif [ $# -eq 2 ]; then
    cd "$base_dir/$1/$2"
  else
    echo "Usage: proj [org] [project]"
    return 1
  fi
}
```

## Related Commands

- `projects` - List all git projects in ~/dev
- `dev` - Navigate to ~/dev
- `devs` - Navigate to ~/dev/sigaostudios
- `devp` - Navigate to ~/dev/personal
- `devw` - Navigate to ~/dev/work

## See Also

- `sigao help navigation` - Learn about all navigation aliases
- `sigao help projects` - List all projects command