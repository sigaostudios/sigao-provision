# Zoxide - Smart Directory Jumper

Zoxide is a smarter cd command that learns your habits. It remembers which directories you use frequently and lets you jump to them with partial names.

## Basic Usage

```bash
# Jump to a directory containing "proj"
z proj

# Jump to a directory containing "work" and "client"
z work client

# Interactive selection with fzf
zi proj
```

## How It Works

Zoxide tracks directory usage based on:
- **Frequency**: How often you visit a directory
- **Recency**: How recently you visited it
- **Combined Score**: A "frecency" algorithm

## Common Commands

| Command | Description |
|---------|-------------|
| `z foo` | Jump to most frecent dir matching "foo" |
| `z foo bar` | Jump to dir matching "foo" and "bar" |
| `zi foo` | Interactive selection with fzf |
| `z -` | Jump to previous directory |
| `zoxide query foo` | Show matches without jumping |

## Integration with Shell

Zoxide integrates seamlessly with your shell:
- Works with cd habits
- Updates database automatically
- Supports tab completion

## Advanced Features

### Exclude Directories
```bash
# Add to your shell config
export _ZO_EXCLUDE_DIRS="$HOME:$HOME/tmp/*:/mnt/*"
```

### Custom Data Directory
```bash
export _ZO_DATA_DIR="$HOME/.local/share/zoxide"
```

## Tips & Tricks

1. **Quick Project Navigation**
   ```bash
   # Instead of: cd ~/dev/sigaostudios/myproject
   z myproject
   ```

2. **Multiple Keywords**
   ```bash
   # Jump to ~/dev/work/client-projects/acme
   z work acme
   ```

3. **Interactive Mode**
   ```bash
   # When multiple matches exist
   zi project  # Opens fzf to select
   ```

4. **Show Statistics**
   ```bash
   zoxide query -s  # Show all directories with scores
   ```

## Troubleshooting

### Directory Not Found
- Visit the directory with `cd` first to add it to the database
- Check if the directory is excluded

### Wrong Directory Selected
- Use more specific keywords
- Use interactive mode with `zi`
- Manually boost a directory: `z /full/path && z`

## Aliases in Sigao

Sigao sets up these aliases for you:
- `z` → `zoxide`

## See Also

- `sigao help navigation` - Project navigation helpers
- `sigao help fzf` - Fuzzy finder integration
- Official docs: https://github.com/ajeetdsouza/zoxide