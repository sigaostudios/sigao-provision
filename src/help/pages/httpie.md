# HTTPie - Human-Friendly HTTP Client

A modern command-line HTTP client designed for testing APIs and HTTP servers.

## Usage

```bash
# Simple GET request
http httpbin.org/get

# POST with JSON
http POST httpbin.org/post name=John age=29

# Custom headers
http GET httpbin.org/headers Authorization:"Bearer token"

# Download file
http --download https://example.com/file.pdf
```

## Description

HTTPie (command: `http`) makes API testing intuitive with its simple syntax, formatted output, and sensible defaults. It's designed to make CLI interaction with web services as human-friendly as possible.

## Installation

HTTPie can be installed via:
- Python: `pipx install httpie` (recommended by Sigao)
- System package manager: `apt install httpie`

## Examples

### Basic Requests

#### GET Request
```bash
# Simple GET
http httpbin.org/get

# With query parameters
http httpbin.org/get search==flask page==2
```

#### POST Request
```bash
# JSON data (default)
http POST httpbin.org/post name=John email=john@example.com

# Form data
http --form POST httpbin.org/post name=John email=john@example.com
```

#### Other Methods
```bash
# PUT
http PUT httpbin.org/put id=1 name="Updated Name"

# DELETE
http DELETE httpbin.org/delete/1

# PATCH
http PATCH httpbin.org/patch/1 status=completed
```

### Headers and Authentication

```bash
# Custom headers
http GET httpbin.org/headers \
  X-API-Token:123 \
  User-Agent:"My App"

# Basic auth
http -a username:password httpbin.org/basic-auth/username/password

# Bearer token
http GET api.example.com/data \
  Authorization:"Bearer YOUR_TOKEN"
```

### Working with JSON

```bash
# Send JSON file
http POST httpbin.org/post < data.json

# Nested JSON
http POST httpbin.org/post \
  user[name]=John \
  user[email]=john@example.com \
  tags[]=python \
  tags[]=httpie
```

### File Operations

```bash
# Upload file
http --form POST httpbin.org/post file@~/document.pdf

# Download file
http --download https://example.com/file.zip

# Download with custom name
http --download --output myfile.zip https://example.com/file.zip
```

## Advanced Features

### Sessions
```bash
# Create named session
http --session=mysession httpbin.org/cookies/set/token/abc123

# Use session
http --session=mysession httpbin.org/cookies
```

### Formatting Options
```bash
# Pretty print with colors
http --pretty=all httpbin.org/get

# Format JSON output
http httpbin.org/get | jq '.'

# Output only body
http --body httpbin.org/get

# Output only headers
http --headers httpbin.org/get
```

### HTTPS and Certificates
```bash
# Skip certificate verification (dev only!)
http --verify=no https://self-signed.example.com

# Use client certificate
http --cert=client.pem https://example.com
```

## Common Use Cases

### API Testing
```bash
# Test REST endpoint
http GET api.example.com/users/123

# Test with pagination
http GET api.example.com/users page==2 limit==10

# Test error handling
http POST api.example.com/users
```

### Debugging
```bash
# Verbose output
http --verbose GET httpbin.org/get

# Show request/response cycle
http --print=HhBb httpbin.org/get
```

### Scripting
```bash
# Check status code
if http --check-status GET api.example.com/health; then
  echo "API is healthy"
fi

# Parse JSON response
name=$(http GET api.example.com/user/1 | jq -r '.name')
```

## HTTPie vs curl

| Feature | HTTPie | curl |
|---------|---------|------|
| Syntax | `http POST url name=value` | `curl -X POST -d '{"name":"value"}' url` |
| Output | Formatted, colored | Raw |
| JSON | Default Content-Type | Requires -H "Content-Type: application/json" |
| Auth | `http -a user:pass url` | `curl -u user:pass url` |

## Tips & Tricks

### Aliases
```bash
# Add to shell config
alias GET='http GET'
alias POST='http POST'
alias PUT='http PUT'
alias DELETE='http DELETE'
```

### Integration with jq
```bash
# Pretty JSON with jq
http GET api.example.com/data | jq '.'

# Extract specific field
http GET api.example.com/user/1 | jq '.email'
```

### Testing Local Servers
```bash
# Localhost shortcuts
http :3000/api/users  # Same as http://localhost:3000/api/users
http :8080/health
```

## Related Commands

- `curl` - Traditional HTTP client
- `jq` - JSON processor
- `wget` - File downloader

## See Also

- HTTPie Documentation: https://httpie.io/docs
- `sigao help jq` - JSON processing
- `sigao help curl` - curl basics