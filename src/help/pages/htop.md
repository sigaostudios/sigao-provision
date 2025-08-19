# htop - Interactive Process Viewer

htop is an interactive process viewer and system monitor with a user-friendly ncurses interface.

## Interface Overview

```
CPU [||||||||  25.0%]   Tasks: 95, 210 thr; 2 running
Mem [||||||    384M/8G]  Load average: 0.52 0.58 0.59
Swp [          0K/2G]    Uptime: 2 days, 03:17:18

  PID USER  PRI  NI  VIRT   RES   SHR S CPU% MEM%   TIME+  Command
 1234 user   20   0  164M  12.5M 3.2M R 25.0  0.2  1:23.45 node index.js
```

## Key Bindings

### Navigation
| Key | Action |
|-----|--------|
| `↑/↓` | Select process |
| `←/→` | Scroll horizontally |
| `PgUp/PgDn` | Page up/down |
| `Home/End` | Jump to top/bottom |
| `Space` | Tag process |
| `U` | Untag all |

### Process Actions
| Key | Action |
|-----|--------|
| `F9` or `k` | Kill process |
| `F7/F8` | Nice -/+ (priority) |
| `a` | Set CPU affinity |
| `i` | Set IO priority |
| `l` | List open files (lsof) |
| `s` | Trace syscalls (strace) |
| `e` | Show environment |

### Display Options
| Key | Action |
|-----|--------|
| `F2` | Setup/Configure |
| `F3` | Search |
| `F4` | Filter |
| `F5` | Tree view |
| `F6` | Sort by column |
| `t` | Toggle tree view |
| `H` | Hide user threads |
| `K` | Hide kernel threads |
| `p` | Show program path |

### Other Commands
| Key | Action |
|-----|--------|
| `F1` or `h` | Help |
| `F10` or `q` | Quit |
| `u` | Filter by user |
| `M` | Sort by memory |
| `P` | Sort by CPU |
| `T` | Sort by time |
| `I` | Invert sort order |

## Configuration (F2)

### Display Options
- **Colors**: Choose color scheme
- **Meters**: Configure top bars
- **Display**: Tree view, thread names
- **Columns**: Choose visible columns

### Meters
Configure CPU, Memory, and other meters:
- Bar graph
- Text mode
- LED mode
- Graph mode

### Available Columns
- PID, User, Priority, Nice
- CPU%, Memory%, Time
- Command, State
- IO rates (if available)

## Sorting

Press F6 or click column headers:
- **PID**: Process ID
- **USER**: Process owner
- **CPU%**: CPU usage
- **MEM%**: Memory usage
- **TIME+**: CPU time used
- **COMMAND**: Process name

## Filtering

### By String (F4)
```
# Filter by command name
node

# Filter by user
user1

# Clear filter
ESC
```

### By User (u)
- Select from user list
- Shows only selected user's processes

## Tree View (F5/t)

Shows process hierarchy:
```
├─ systemd
│  ├─ systemd-journal
│  ├─ systemd-udevd
│  └─ systemd-resolved
├─ sshd
│  └─ sshd: user
│     └─ bash
│        └─ htop
```

## Process Management

### Killing Processes
1. Select process with arrows
2. Press F9 or k
3. Choose signal:
   - `15 SIGTERM` - Graceful termination
   - `9 SIGKILL` - Force kill
   - `1 SIGHUP` - Reload config
   - `2 SIGINT` - Interrupt (Ctrl+C)

### Changing Priority (Nice)
- F7: Decrease nice (higher priority)
- F8: Increase nice (lower priority)
- Range: -20 (highest) to 19 (lowest)

### Multiple Process Selection
1. Tag with Space
2. Perform action on all tagged
3. Untag all with U

## Understanding the Display

### CPU Meter
```
CPU [||||||||  25.0%]
```
- Green: User processes
- Red: Kernel/system
- Blue: Low priority (nice)
- Orange: IRQ time

### Memory Meter
```
Mem [||||||    384M/8G]
```
- Green: Used memory
- Blue: Buffers
- Orange: Cache

### Load Average
```
Load average: 0.52 0.58 0.59
```
- 1, 5, and 15 minute averages
- Compare to CPU count

### Process States
- `R` - Running
- `S` - Sleeping
- `D` - Disk sleep
- `Z` - Zombie
- `T` - Stopped
- `t` - Traced

## Advanced Features

### CPU Affinity (a)
Pin process to specific CPU cores:
- Select process
- Press 'a'
- Toggle CPU cores with Space

### IO Priority (i)
Set IO scheduling class and priority:
- Classes: None, Real-time, Best-effort, Idle
- Priority: 0-7 (0 is highest)

### Custom Columns
In Setup (F2), add columns like:
- IO_RATE: Disk I/O rate
- CGROUP: Control group
- OOM: Out-of-memory score

## Tips & Tricks

1. **Quick kill**: Select and press k, then Enter for SIGTERM
2. **Find process**: F3 to search by name
3. **Monitor specific user**: Press u and select
4. **See full command**: Scroll right with →
5. **Pause updates**: Press Z

## Common Use Cases

### Find Memory Hogs
1. Press M to sort by memory
2. Look at MEM% column
3. Check RES (resident) size

### Find CPU Intensive
1. Press P to sort by CPU
2. Watch CPU% column
3. Check if sustained high usage

### Monitor Specific App
1. Press F4
2. Type app name
3. Watch filtered view

### Check System Load
- Look at load average
- Check CPU meters
- Monitor running task count

## Comparison with top

| Feature | htop | top |
|---------|------|-----|
| Colors | Yes | Limited |
| Mouse | Yes | No |
| Scrolling | Yes | No |
| Tree view | Yes | No |
| Setup menu | Yes | Limited |
| Tagging | Yes | No |

## Alternatives

- `btop` - Even more visual
- `glances` - System overview
- `nmon` - Performance monitor
- `atop` - Advanced logging

## See Also

- `sigao help btop` - Modern alternative
- `sigao help aliases` - Quick access
- Process management: `man 7 signal`