# mkcd - Make Directory and Enter

A convenient shell function that creates a directory and immediately changes into it.

## Usage

```bash
mkcd new-directory
mkcd path/to/new/directory
```

## Description

The `mkcd` function combines two common operations:
1. `mkdir -p` - Creates the directory (and parent directories if needed)
2. `cd` - Changes into the newly created directory

## Examples

### Simple Directory
```bash
mkcd myproject
# Creates 'myproject' and enters it
# Now in: ./myproject
```

### Nested Directories
```bash
mkcd src/components/Button
# Creates the entire path if it doesn't exist
# Now in: ./src/components/Button
```

### With Spaces
```bash
mkcd "My Project"
# Creates 'My Project' directory
# Now in: ./My Project
```

### Development Workflow
```bash
# Start new project
mkcd ~/dev/personal/awesome-app

# Create source structure
mkcd src/components
mkcd ../utils
mkcd ../hooks
```

## Implementation

The function is defined in your shell configuration:
```bash
mkcd() {
    mkdir -p "$1" && cd "$1"
}
```

## Error Handling

If directory creation fails (permissions, disk space, etc.):
- Directory is not created
- You remain in current directory
- Error message is displayed

## Tips

1. **Project Setup**: Use with project templates
   ```bash
   mkcd my-app && npm init -y
   ```

2. **Date-based Directories**:
   ```bash
   mkcd "backup-$(date +%Y-%m-%d)"
   ```

3. **Batch Creation**:
   ```bash
   for dir in src tests docs; do mkcd $dir && cd ..; done
   ```

## Related Functions

- `mkdir -p` - Just create directories
- `cd` - Just change directory
- `pushd/popd` - Directory stack navigation

## See Also

- `sigao help navigation` - Project navigation
- `sigao help aliases` - Other helper functions
- `sigao help extract` - Archive extraction helper