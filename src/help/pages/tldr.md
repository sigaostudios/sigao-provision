# tldr - Simplified Man Pages

Community-driven simplified documentation for command-line tools.

## Usage

```bash
# Get help for a command
tldr git
tldr docker
tldr tar

# Update tldr pages
tldr --update

# Search for commands
tldr --search "compress"
```

## Description

tldr (too long; didn't read) provides simplified, practical examples for command-line tools. Instead of comprehensive man pages, tldr shows you the most common use cases with clear examples.

## Examples

### Basic Usage
```bash
# Get help for git
tldr git

# Get help for specific git command
tldr git-commit
tldr git-branch

# Get help for any command
tldr wget
tldr ssh
tldr rsync
```

### Platform-Specific Pages
```bash
# Linux-specific
tldr --platform linux apt

# macOS-specific
tldr --platform osx brew

# Windows-specific
tldr --platform windows choco
```

### Language Support
```bash
# Spanish
tldr --language es git

# French
tldr --language fr docker

# List available languages
tldr --list-languages
```

## Common Commands

### Archive Tools
```bash
tldr tar      # Create and extract archives
tldr zip      # ZIP compression
tldr unzip    # ZIP extraction
tldr gzip     # GNU compression
```

### Network Tools
```bash
tldr curl     # HTTP requests
tldr wget     # Download files
tldr ssh      # Secure shell
tldr scp      # Secure copy
tldr rsync    # Sync files
```

### System Tools
```bash
tldr ps       # Process status
tldr kill     # Terminate processes
tldr chmod    # Change permissions
tldr chown    # Change ownership
tldr find     # Find files
```

### Development Tools
```bash
tldr git      # Version control
tldr docker   # Containers
tldr npm      # Node packages
tldr pip      # Python packages
tldr make     # Build automation
```

## tldr vs man

| Aspect | tldr | man |
|--------|------|-----|
| Length | 5-10 examples | Comprehensive docs |
| Focus | Common use cases | Complete reference |
| Format | Simple examples | Detailed sections |
| Updates | Community-driven | Official docs |
| Speed | Quick reference | Deep dive |

## Tips & Tricks

### Quick Access
```bash
# Alias for faster access
alias h='tldr'  # h for help

# Usage
h git
h docker
```

### Offline Access
```bash
# Update pages for offline use
tldr --update

# All pages are cached locally
ls ~/.cache/tldr/
```

### Integration with fzf
```bash
# Interactive command search
tldr --list | fzf | xargs tldr

# Function for shell
tldrf() {
  tldr --list | fzf --preview 'tldr {}' | xargs tldr
}
```

### Custom Pages
```bash
# tldr pages location
~/.local/share/tldr/

# Create custom page
mkdir -p ~/.local/share/tldr/pages/common
echo "# mycommand" > ~/.local/share/tldr/pages/common/mycommand.md
```

## Example Output

When you run `tldr tar`:
```
  tar

  Archiving utility.
  Often combined with a compression method, such as gzip or bzip2.

  - Create an archive from files:
    tar cf target.tar file1 file2 file3

  - Create a gzipped archive:
    tar czf target.tar.gz file1 file2 file3

  - Extract an archive:
    tar xf source.tar

  - Extract a gzipped archive:
    tar xzf source.tar.gz

  - List contents of tar file:
    tar tvf source.tar
```

## Updating Pages

```bash
# Update to latest pages
tldr --update

# Clear cache and update
tldr --clear-cache
tldr --update

# Check version
tldr --version
```

## Related Commands

- `man` - Traditional manual pages
- `info` - GNU info documents
- `help` - Bash built-in help
- `--help` - Most commands' help flag

## See Also

- tldr pages: https://tldr.sh/
- GitHub: https://github.com/tldr-pages/tldr
- `sigao help cheat` - Sigao command cheatsheet