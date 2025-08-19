# ncdu - NCurses Disk Usage Analyzer

Interactive disk usage analyzer with an ncurses interface.

## Usage

```bash
# Analyze current directory
ncdu

# Analyze specific directory
ncdu /home/user

# Analyze with extended information
ncdu -x /

# Export results
ncdu -o report.json
```

## Description

ncdu (NCurses Disk Usage) provides a fast, interactive way to find out what's taking up disk space. Unlike `du`, it presents results in an easy-to-navigate ncurses interface where you can browse, sort, and even delete files.

## Examples

### Basic Usage
```bash
# Analyze current directory
ncdu

# Analyze home directory
ncdu ~

# Analyze entire filesystem (stay on same filesystem)
sudo ncdu -x /
```

### Navigation Keys

While in ncdu:
- `↑/↓` or `j/k` - Navigate up/down
- `→/Enter` - Enter directory
- `←` or `h` - Go to parent directory
- `d` - Delete selected file/directory
- `n` - Sort by name
- `s` - Sort by size (default)
- `c` - Sort by items
- `a` - Toggle apparent size/disk usage
- `e` - Show extended information
- `i` - Show selected item info
- `r` - Refresh
- `q` - Quit

### Advanced Options

```bash
# Cross filesystem boundaries
ncdu /

# Stay on same filesystem
ncdu -x /

# Show hidden files
ncdu --hidden

# Exclude patterns
ncdu --exclude .git --exclude node_modules

# Read from file
ncdu -f saved-report.json
```

## Common Use Cases

### Find Large Files
```bash
# Start from root (with sudo for full access)
sudo ncdu -x /

# Navigate to directories consuming most space
# Press 's' to ensure sorted by size
```

### Clean Up Home Directory
```bash
# Analyze home
ncdu ~

# Common space hogs:
# - ~/.cache
# - ~/Downloads
# - ~/.local/share/Trash
# - Old log files
```

### Analyze Specific Applications
```bash
# Docker usage
ncdu /var/lib/docker

# Package managers
ncdu ~/.npm
ncdu ~/.cache/pip
ncdu ~/.cargo

# Development
ncdu ~/dev --exclude node_modules --exclude .git
```

## Export and Import

### Export Analysis
```bash
# Export to JSON
ncdu -o disk-usage.json /home

# Export with extended info
ncdu -xe -o full-report.json /
```

### View Exported Data
```bash
# View previously exported data
ncdu -f disk-usage.json

# Useful for:
# - Comparing usage over time
# - Analyzing remote systems
# - Sharing reports
```

## Integration with Other Tools

### Cleanup Scripts
```bash
# Find and clean old logs
ncdu /var/log
# Then delete old files with 'd' key

# Clean package caches
ncdu ~/.cache
```

### Monitoring
```bash
# Regular disk usage check
alias disk-check='ncdu -x /'

# Quick home directory check
alias home-usage='ncdu ~'
```

## Tips & Tricks

### Performance
```bash
# Faster scanning (no crossing mount points)
ncdu -x /

# Exclude slow network mounts
ncdu --exclude /mnt/network
```

### Safety
- Press `d` to delete (asks for confirmation)
- Use `--read-only` to prevent accidental deletion
- Always verify before deleting system files

### Common Exclusions
```bash
# Development directory analysis
ncdu ~/dev \
  --exclude .git \
  --exclude node_modules \
  --exclude target \
  --exclude dist \
  --exclude build
```

## Comparison with Other Tools

| Feature | ncdu | du | df |
|---------|------|----|----|
| Interactive | ✓ | ✗ | ✗ |
| Visual navigation | ✓ | ✗ | ✗ |
| Delete capability | ✓ | ✗ | ✗ |
| Speed | Fast | Slow | Instant |
| Output format | ncurses | Text | Text |

## Related Commands

- `df` - Show filesystem disk usage
- `du` - Show directory disk usage
- `btop` - System resource monitor
- `htop` - Process viewer

## See Also

- ncdu website: https://dev.yorhel.nl/ncdu
- `sigao help btop` - Resource monitoring
- `sigao help htop` - Process management