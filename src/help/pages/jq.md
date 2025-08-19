# jq - Command-line JSON Processor

jq is a lightweight and flexible command-line JSON processor, like sed for JSON data.

## Basic Usage

```bash
# Pretty print JSON
curl api.example.com/data | jq '.'

# Extract field
echo '{"name": "John", "age": 30}' | jq '.name'
# Output: "John"

# Remove quotes
echo '{"name": "John"}' | jq -r '.name'
# Output: John
```

## Selecting Data

### Object Fields
```bash
# Single field
jq '.field'

# Nested fields
jq '.user.name'

# Multiple fields
jq '.name, .age'

# Optional field (no error if missing)
jq '.field?'
```

### Arrays
```bash
# Get array element
jq '.[0]'

# Get all elements
jq '.[]'

# Array slice
jq '.[2:4]'

# Last element
jq '.[-1]'
```

### Filtering
```bash
# Select objects with condition
jq '.[] | select(.age > 25)'

# Select by field existence
jq '.[] | select(has("email"))'

# Select by regex
jq '.[] | select(.name | test("^J"))'

# Multiple conditions
jq '.[] | select(.age > 25 and .active == true)'
```

## Transforming Data

### Creating Objects
```bash
# New object from fields
jq '{name: .firstName, years: .age}'

# Rename fields
jq '{username: .name, email: .email}'

# Computed fields
jq '{name: .name, adult: (.age >= 18)}'
```

### Array Operations
```bash
# Map over array
jq '.users | map(.name)'

# Get array length
jq '.items | length'

# Sort array
jq '.users | sort_by(.age)'

# Reverse array
jq '.items | reverse'

# Unique values
jq '.tags | unique'

# Group by field
jq 'group_by(.category)'
```

### String Operations
```bash
# Concatenate
jq '.firstName + " " + .lastName'

# Split string
jq '.email | split("@")'

# Change case
jq '.name | ascii_downcase'
jq '.code | ascii_upcase'

# String interpolation
jq '"Hello, \(.name)!"'
```

## Advanced Features

### Pipes and Composition
```bash
# Chain operations
jq '.users | map(select(.active)) | sort_by(.age) | .[0:5]'

# Multiple transformations
jq '.data | to_entries | map({key: .key, count: .value | length})'
```

### Conditionals
```bash
# If-then-else
jq 'if .age >= 18 then "adult" else "minor" end'

# Default values
jq '.name // "Anonymous"'

# Try-catch
jq 'try .field.subfield catch "N/A"'
```

### Reduce and Fold
```bash
# Sum array
jq '[.[] | .price] | add'

# Custom reduce
jq 'reduce .[] as $item (0; . + $item.quantity)'

# Min/max
jq '.prices | min'
jq '.scores | max'
```

## Practical Examples

### API Response Processing
```bash
# GitHub repos - get names and stars
curl https://api.github.com/users/torvalds/repos | \
  jq '.[] | {name: .name, stars: .stargazers_count}'

# Sort by stars
curl https://api.github.com/users/torvalds/repos | \
  jq 'sort_by(.stargazers_count) | reverse | .[0:5] | .[] | .name'
```

### Configuration Files
```bash
# Extract database config
jq '.database | {host, port, name: .database}' config.json

# Merge configs
jq -s '.[0] * .[1]' defaults.json overrides.json
```

### Data Analysis
```bash
# Count by status
jq 'group_by(.status) | map({status: .[0].status, count: length})'

# Average value
jq '[.[] | .score] | add / length'

# Find duplicates
jq 'group_by(.id) | map(select(length > 1))'
```

## Useful Options

| Option | Description |
|--------|-------------|
| `-r` | Raw output (no quotes) |
| `-s` | Slurp (read entire input into array) |
| `-c` | Compact output |
| `-S` | Sort object keys |
| `-e` | Exit status based on output |
| `-n` | Null input (useful for generation) |

## Working with Files

```bash
# Read from file
jq '.' data.json

# Write to file
jq '.' input.json > output.json

# In-place edit (with temp file)
jq '.version = "2.0"' package.json > tmp.json && mv tmp.json package.json

# Process multiple files
jq -s '.[0] + .[1]' file1.json file2.json
```

## Error Handling

```bash
# Check if field exists
jq 'if has("field") then .field else empty end'

# Provide defaults
jq '.field // "default"'

# Skip nulls
jq '.[] | select(. != null)'

# Handle parse errors
cat maybe-json.txt | jq '.' 2>/dev/null || echo "Invalid JSON"
```

## Performance Tips

1. **Use streaming for large files**: `jq --stream`
2. **Avoid repeated parsing**: Save intermediate results
3. **Use `-r` for text output**: Faster than removing quotes later
4. **Compile complex queries**: Use `-f query.jq`

## Common Patterns

### CSV Generation
```bash
# JSON to CSV
jq -r '.[] | [.id, .name, .email] | @csv'
```

### Environment Variables
```bash
# Use in queries
jq --arg name "$USER" '.users[] | select(.name == $name)'

# Multiple variables
jq --arg min 18 --arg max 65 '.[] | select(.age >= ($min|tonumber) and .age <= ($max|tonumber))'
```

### JSON Generation
```bash
# From scratch
jq -n '{name: "John", age: 30}'

# From environment
jq -n --arg user "$USER" --arg home "$HOME" '{user: $user, home: $home}'
```

## Integration with Other Tools

```bash
# With curl
curl -s https://api.example.com | jq '.data[]'

# With docker
docker inspect container_name | jq '.[0].NetworkSettings.IPAddress'

# With aws cli
aws ec2 describe-instances | jq '.Reservations[].Instances[] | {id: .InstanceId, ip: .PublicIpAddress}'
```

## See Also

- `sigao help httpie` - HTTP client with JSON support
- `sigao help bat` - Pretty print JSON files
- jq manual: https://stedolan.github.io/jq/manual/
- jq playground: https://jqplay.org/