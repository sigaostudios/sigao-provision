# btop - Resource Monitor

btop is a beautiful and powerful resource monitor that shows usage and stats for processor, memory, disks, network, and processes.

## Interface Overview

btop provides a comprehensive system overview with:
- CPU usage per core with graphs
- Memory and swap usage
- Disk I/O and free space
- Network traffic
- Process list with tree view

## Key Bindings

### Navigation
| Key | Action |
|-----|--------|
| `↑/↓/←/→` | Navigate |
| `Enter` | Show process details |
| `Esc` | Exit menus/details |
| `Tab/Shift+Tab` | Switch panels |
| `pgUp/pgDn` | Page up/down |

### View Controls
| Key | Action |
|-----|--------|
| `m` | Switch to Main menu |
| `o` | Show Options menu |
| `h` | Toggle help |
| `1-4` | Toggle panels (CPU/Mem/Net/Proc) |
| `d` | Toggle disk panels |
| `F2` | Toggle theme selector |

### Process Controls
| Key | Action |
|-----|--------|
| `k` | Kill process |
| `s` | Send signal |
| `f` | Filter processes |
| `t` | Toggle tree view |
| `r` | Reverse sort order |
| `e` | Toggle process command |
| `Space` | Expand/collapse in tree |

### Sorting (in process panel)
| Key | Sort by |
|-----|---------|
| `p` | PID |
| `n` | Name |
| `c` | CPU% |
| `m` | Memory% |
| `u` | User |

## Configuration

Config file: `~/.config/btop/btop.conf`

### Key Settings
```conf
# Theme
color_theme = "Default"

# Update frequency (ms)
update_ms = 2000

# Temperature unit
temp_scale = "celsius"

# Network interface
net_iface = "auto"

# Process sorting
proc_sorting = "cpu lazy"

# Tree view
proc_tree = True
```

## Panels Explained

### CPU Panel
- Shows usage per core/thread
- Frequency and temperature
- Load average
- Uptime

### Memory Panel
- RAM usage with breakdown
- Swap usage
- Cache and buffers
- Memory pressure

### Network Panel
- Upload/download speeds
- Total transferred
- Network interface info
- Connection graphs

### Disk Panel
- Disk usage percentage
- Free/used space
- Read/write activity
- Mount points

### Process Panel
- Process list/tree
- CPU and memory usage
- Command/program name
- Process state

## Themes

Switch themes with F2:
- Default
- TTY (monochrome)
- Gruvbox
- Dracula
- Nord
- Tokyo Night
- Many more...

## Mouse Support

btop supports mouse interactions:
- Click to select
- Scroll to navigate
- Click column headers to sort
- Drag to resize panels

## Advanced Features

### Process Details
Press Enter on a process to see:
- Detailed resource usage
- Open files
- Environment variables
- Process tree
- IO statistics

### Filtering
Press 'f' and type to filter:
- By process name
- By user
- By command
- Supports regex

### Presets
Quick layout presets:
- `0` - Default layout
- Custom presets in options

### Logging
btop can log to file:
```conf
# In config
log_level = "WARNING"
```

## Tips & Tricks

1. **Quick navigation**: Use number keys 1-4 to toggle panels
2. **Process tree**: Press 't' to see parent-child relationships
3. **Kill menu**: Press 'k' then choose signal
4. **Multi-select**: In options, enable for batch operations
5. **GPU monitoring**: If supported, shows GPU stats

## Performance

### Optimization
```conf
# Reduce update frequency
update_ms = 5000

# Disable certain panels
show_disks = False
show_network = False

# Limit process count
proc_per_core = False
```

### Resource Usage
btop itself is lightweight:
- Low CPU usage
- Minimal memory footprint
- Efficient terminal drawing

## Comparison with htop

| Feature | btop | htop |
|---------|------|------|
| Interface | Graphical boxes | Text-based |
| Graphs | Extensive | Limited |
| Themes | Many | Few |
| Network | Yes | No |
| Disks | Yes | No |
| Mouse | Full support | Basic |

## Troubleshooting

### Display Issues
- Check terminal supports 256 colors
- Try different theme
- Resize terminal window

### High CPU Usage
- Increase update_ms
- Disable graphs
- Reduce monitored interfaces

### Missing Stats
- Run with sudo for all stats
- Check sensor drivers
- Verify network interface

## Aliases in Sigao

Sigao aliases `top` to `btop` when available:
```bash
alias top="btop"
alias htop="btop"
```

## Common Use Cases

### System Overview
Default view shows everything needed:
- CPU per core
- Memory usage
- Network activity
- Top processes

### Process Hunting
1. Press 'f' to filter
2. Type process name
3. Sort by CPU/Memory
4. Press 'k' to kill

### Performance Monitoring
- Watch graphs over time
- Check disk I/O
- Monitor network traffic
- Track memory pressure

## See Also

- `sigao help htop` - Alternative process viewer
- `sigao help aliases` - Quick access
- System monitoring: `man 1 top`