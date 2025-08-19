# direnv - Directory-based Environment Management

direnv automatically loads and unloads environment variables based on your current directory.

## How It Works

When you cd into a directory with a `.envrc` file:
1. direnv loads the environment variables
2. Variables are set for that shell session
3. When you leave, variables are unloaded

## Basic Usage

```bash
# Create .envrc in project
echo 'export API_KEY="secret"' > .envrc

# Allow direnv to load it
direnv allow

# Check it worked
echo $API_KEY
```

## Common .envrc Patterns

### Basic Environment Variables
```bash
# .envrc
export DATABASE_URL="postgresql://localhost/myapp"
export REDIS_URL="redis://localhost:6379"
export NODE_ENV="development"
export DEBUG="myapp:*"
```

### Load from Files
```bash
# Load from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Source another file
source_env .env.local
```

### Path Modifications
```bash
# Add local bin to PATH
PATH_add ./bin
PATH_add ./node_modules/.bin

# Add Python scripts
PATH_add ./scripts
```

### Virtual Environments

#### Python
```bash
# Python virtualenv
layout python3

# Or with pyenv
use python 3.11.7
layout python

# Poetry
layout poetry
```

#### Node.js
```bash
# Use specific Node version
use node 18.17.0

# Load nvm
use nvm 18.17.0

# Automatic from .nvmrc
use nvm
```

### Layout Functions

Sigao configures these layouts in `~/.config/direnv/direnvrc`:

```bash
# Python layout
layout_python() {
    if [[ -d ".venv" ]]; then
        VIRTUAL_ENV=".venv"
    else
        VIRTUAL_ENV=".direnv/python-$(python3 --version | cut -d' ' -f2)"
    fi
    # ... activates virtualenv
}

# Poetry layout
layout_poetry() {
    VIRTUAL_ENV=$(poetry env info --path 2>/dev/null)
    # ... activates poetry env
}

# Node.js layout
layout_node() {
    NODE_VERSION="${1:-$(cat .nvmrc 2>/dev/null)}"
    # ... loads node version
}
```

## Security

### Allow/Deny
```bash
# Allow .envrc in current directory
direnv allow

# Deny (disable) .envrc
direnv deny

# Allow specific file
direnv allow .envrc
```

### Best Practices
1. Never commit secrets to .envrc
2. Use `.envrc.example` for templates
3. Add `.envrc` to `.gitignore`
4. Review .envrc before allowing

## Advanced Features

### Conditional Logic
```bash
# Development vs production
if [ "$USER" = "developer" ]; then
    export API_URL="http://localhost:3000"
else
    export API_URL="https://api.example.com"
fi
```

### Functions
```bash
# Define project commands
start_server() {
    npm run dev
}

test() {
    npm test
}
```

### AWS Profiles
```bash
# Switch AWS profile
export AWS_PROFILE="development"
export AWS_REGION="us-east-1"
```

### Docker Compose
```bash
# Set compose file
export COMPOSE_FILE="docker-compose.dev.yml"
export COMPOSE_PROJECT_NAME="myapp_dev"
```

## Templates

### Web Project
```bash
# Node.js web app
use nvm
layout node

export NODE_ENV="development"
export PORT="3000"
export DATABASE_URL="postgresql://localhost/myapp_dev"
export REDIS_URL="redis://localhost:6379/0"
export SESSION_SECRET="dev-secret"

PATH_add ./node_modules/.bin
```

### Python Project
```bash
# Python with poetry
layout poetry

export FLASK_APP="app.py"
export FLASK_ENV="development"
export DATABASE_URL="sqlite:///dev.db"

PATH_add ./scripts
```

### Go Project
```bash
# Go module
export GOPATH="$PWD/.go"
PATH_add .go/bin
PATH_add bin
```

## Debugging

```bash
# Show direnv status
direnv status

# Reload .envrc
direnv reload

# Show current exports
direnv export bash

# Debug mode
export DIRENV_LOG_FORMAT='[$DIRENV_LOG_LEVEL] %s'
```

## Integration with Editors

### VS Code
Add to `.vscode/settings.json`:
```json
{
    "terminal.integrated.env.linux": {
        "DIRENV_LOG_FORMAT": ""
    }
}
```

### Vim
```vim
" Auto-reload on .envrc change
autocmd BufWritePost .envrc :!direnv allow
```

## Common Patterns

### Secrets Management
```bash
# Load from 1Password
export API_KEY="$(op read op://vault/item/field)"

# Load from AWS Secrets Manager
export DB_PASSWORD="$(aws secretsmanager get-secret-value --secret-id prod/db/password --query SecretString --output text)"
```

### Multi-Environment
```bash
# Choose environment
if [ -f .env.local ]; then
    source_env .env.local
elif [ -f .env.dev ]; then
    source_env .env.dev
fi
```

## Tips & Tricks

1. **Global gitignore**: Add `.envrc` to `~/.gitignore_global`
2. **Templates**: Keep `.envrc.example` in repo
3. **Automatic allow**: Set `DIRENV_LOG_FORMAT=""` to reduce noise
4. **Shell indicator**: PS1 can show when direnv is active

## Troubleshooting

### Not Loading
- Check `direnv allow`
- Verify shell hook is installed
- Check file permissions

### Slow Loading
- Avoid heavy commands in .envrc
- Cache expensive operations
- Use `direnv status` to debug

## See Also

- `sigao help shell` - Shell configuration
- `sigao help python` - Python environments
- `sigao help node` - Node.js environments
- Official wiki: https://github.com/direnv/direnv/wiki