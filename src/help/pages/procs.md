# procs - Modern Process Viewer

A modern replacement for ps written in Rust with a user-friendly interface.

## Usage

```bash
# List all processes
procs

# Search for processes
procs firefox
procs "python|node"

# Tree view
procs --tree

# Watch mode
procs --watch
```

## Description

procs is a modern replacement for the traditional `ps` command. It provides a cleaner, more colorful output with additional information like TCP/UDP ports, read/write throughput, and Docker container names.

## Examples

### Basic Usage
```bash
# List all processes
procs

# Search for specific process
procs chrome
procs nginx

# Multiple search terms
procs "chrome|firefox|safari"
```

### Display Options
```bash
# Tree view (like pstree)
procs --tree

# Show only your processes
procs --uid $(id -u)

# Sort by memory usage
procs --sortby mem

# Sort by CPU usage
procs --sortby cpu
```

### Filtering
```bash
# By PID
procs --pid 1234

# By port
procs --port 8080
procs --port 80,443

# By user
procs --uid root
procs --uid $(whoami)
```

## Advanced Features

### Watch Mode
```bash
# Auto-refresh every 2 seconds
procs --watch

# Watch specific process
procs --watch nginx

# Custom interval (in seconds)
procs --watch-interval 5 firefox
```

### Output Formats
```bash
# Show additional columns
procs --insert VmSize
procs --insert TcpPort,UdpPort

# Custom columns
procs --columns pid,user,cpu,mem,name

# All available information
procs --debug
```

### Tree View
```bash
# Process tree
procs --tree

# Tree for specific process
procs --tree systemd

# Combine with search
procs --tree docker
```

## Comparison with ps

| Feature | procs | ps |
|---------|-------|-------|
| Colored output | ✓ | ✗ |
| Human-readable | ✓ | ✗ |
| TCP/UDP ports | ✓ | ✗ |
| Docker names | ✓ | ✗ |
| Search built-in | ✓ | Requires grep |
| Tree view | ✓ | Separate pstree |

## Common Use Cases

### Development
```bash
# Find process using port
procs --port 3000

# Find all Node.js processes
procs node

# Find Python processes with details
procs python --tree
```

### System Administration
```bash
# High CPU processes
procs --sortby cpu | head -20

# High memory processes
procs --sortby mem | head -20

# All processes by root
procs --uid root
```

### Docker Integration
```bash
# Shows Docker container names
procs

# Find processes in containers
procs --docker
```

## Configuration

### Config File
```bash
# Location: ~/.config/procs/config.toml

# Example configuration:
[[columns]]
name = "PID"
[[columns]]
name = "User"
[[columns]]
name = "CPU"
[[columns]]
name = "Mem"
[[columns]]
name = "Command"
```

### Environment Variables
```bash
# Set default columns
export PROCS_COLUMNS="pid,user,cpu,mem,vsz,name"

# Set default sort
export PROCS_SORTBY="cpu"
```

## Tips & Tricks

### Aliases
```bash
# Replace ps with procs
alias ps='procs'

# Quick monitors
alias pcpu='procs --sortby cpu'
alias pmem='procs --sortby mem'
alias pwatch='procs --watch'
```

### Kill Processes
```bash
# Find and kill
procs firefox | awk '{print $1}' | xargs kill

# Interactive kill with fzf
procs | fzf | awk '{print $1}' | xargs kill
```

### Monitoring Scripts
```bash
# Monitor specific service
while true; do
  clear
  procs nginx
  sleep 2
done

# Log high CPU processes
procs --sortby cpu | head -10 >> cpu-hogs.log
```

## Integration

### With Other Tools
```bash
# Pipe to grep
procs | grep -i python

# Use with awk
procs | awk '$3 > 50 {print $0}'  # CPU > 50%

# Export to file
procs > process-snapshot.txt
```

## Related Commands

- `ps` - Traditional process viewer
- `htop` - Interactive process viewer
- `btop` - Beautiful process viewer
- `pgrep` - Search processes by name
- `top` - Real-time process viewer

## See Also

- procs GitHub: https://github.com/dalance/procs
- `sigao help htop` - Interactive process viewer
- `sigao help btop` - Resource monitor