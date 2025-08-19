# extract - Universal Archive Extractor

A shell function that automatically detects and extracts various archive formats.

## Usage

```bash
extract archive.tar.gz
extract file.zip
extract package.deb
```

## Supported Formats

| Extension | Archive Type | Command Used |
|-----------|--------------|--------------|
| `.tar.bz2` | Tar with Bzip2 | `tar xjf` |
| `.tar.gz` | Tar with Gzip | `tar xzf` |
| `.bz2` | Bzip2 | `bunzip2` |
| `.rar` | RAR | `unrar x` |
| `.gz` | Gzip | `gunzip` |
| `.tar` | Tar | `tar xf` |
| `.tbz2` | Tar with Bzip2 | `tar xjf` |
| `.tgz` | Tar with Gzip | `tar xzf` |
| `.zip` | ZIP | `unzip` |
| `.Z` | Compress | `uncompress` |
| `.7z` | 7-Zip | `7z x` |

## Examples

### Basic Extraction
```bash
# Extract tar.gz
extract node-v18.17.0.tar.gz

# Extract zip
extract project.zip

# Extract multiple
for file in *.zip; do extract "$file"; done
```

### Download and Extract
```bash
# Download and extract in one go
wget https://example.com/file.tar.gz && extract file.tar.gz

# Or with curl
curl -L -o archive.zip https://example.com/archive.zip && extract archive.zip
```

## Behavior

### Extraction Location
- Files are extracted in the current directory
- Original archive is preserved
- No automatic directory creation

### Smart Extraction
For archives with many top-level files:
```bash
# Manual safety approach
mkdir output && cd output
extract ../messy-archive.zip
```

## Error Handling

The function handles:
- Missing files: Shows "not a valid file"
- Unknown formats: Shows "cannot be extracted"
- Missing tools: Command will fail with error

## Required Tools

Some formats need additional tools:
- **rar**: Install `unrar`
  ```bash
  sudo apt install unrar
  ```
- **7z**: Install `p7zip-full`
  ```bash
  sudo apt install p7zip-full
  ```

## Tips & Tricks

### Preview Before Extract
```bash
# List tar contents
tar -tf archive.tar.gz | less

# List zip contents
unzip -l archive.zip

# Then extract
extract archive.tar.gz
```

### Extract to Specific Directory
```bash
# The function doesn't support this directly
# Use mkcd instead:
mkcd extracted && extract ../archive.zip
```

### Batch Processing
```bash
# Extract all archives in directory
for archive in *.{zip,tar.gz,7z}; do
    [ -f "$archive" ] && extract "$archive"
done
```

## Implementation

The function is defined in your shell configuration:
```bash
extract() {
    if [ -f "$1" ]; then
        case "$1" in
            *.tar.bz2)   tar xjf "$1"   ;;
            *.tar.gz)    tar xzf "$1"   ;;
            *.bz2)       bunzip2 "$1"   ;;
            *.rar)       unrar x "$1"   ;;
            *.gz)        gunzip "$1"    ;;
            *.tar)       tar xf "$1"    ;;
            *.tbz2)      tar xjf "$1"   ;;
            *.tgz)       tar xzf "$1"   ;;
            *.zip)       unzip "$1"     ;;
            *.Z)         uncompress "$1";;
            *.7z)        7z x "$1"      ;;
            *)           echo "'$1' cannot be extracted" ;;
        esac
    else
        echo "'$1' is not a valid file"
    fi
}
```

## Advanced Usage

### Extract with Progress
For large files, use native commands with progress:
```bash
# Instead of extract
pv large.tar.gz | tar xzf -

# Or with tar's verbose
tar xzvf large.tar.gz
```

### Extract Specific Files
Use native commands for selective extraction:
```bash
# From tar
tar xzf archive.tar.gz path/to/file

# From zip
unzip archive.zip specific-file.txt
```

## Related Commands

- `tar` - Tape archive tool
- `unzip` - ZIP archive tool
- `7z` - 7-Zip archiver
- `mkcd` - Make and enter directory

## See Also

- `sigao help mkcd` - Create and enter directories
- `sigao help aliases` - Other helper functions
- Archive formats: `man tar`, `man unzip`