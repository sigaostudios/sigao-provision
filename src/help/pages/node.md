# Node.js & NVM

Sigao installs Node.js via NVM (Node Version Manager) for easy version management.

## NVM Basics

```bash
# List installed versions
nvm ls

# List available versions
nvm ls-remote

# Install specific version
nvm install 18.17.0
nvm install --lts  # Latest LTS

# Use specific version
nvm use 18.17.0
nvm use --lts

# Set default version
nvm alias default 18.17.0
```

## Automatic Version Switching

Sigao configures automatic .nvmrc detection:

```bash
# Create .nvmrc in project
echo "18.17.0" > .nvmrc

# Auto-switches when you cd into directory
cd /path/to/project  # Automatically uses 18.17.0
```

## NPM Commands & Aliases

| Alias | Command | Description |
|-------|---------|-------------|
| `ni` | `npm install` | Install dependencies |
| `nr` | `npm run` | Run scripts |
| `ns` | `npm start` | Start project |
| `nt` | `npm test` | Run tests |
| `nb` | `npm run build` | Build project |

## Managing Node Versions

### Project-Specific Versions
```bash
# In project directory
nvm install     # Installs version from .nvmrc
nvm use         # Uses version from .nvmrc

# Install and use
nvm install --lts && nvm use --lts
```

### Version Aliases
```bash
# Create custom aliases
nvm alias work 16.20.0
nvm alias personal 18.17.0

# Use aliases
nvm use work
nvm use personal
```

## NPM Configuration

### Registry & Authentication
```bash
# Set registry
npm config set registry https://registry.npmjs.org/

# Login to registry
npm login

# Set auth token
npm config set //registry.npmjs.org/:_authToken YOUR_TOKEN
```

### Global Packages
```bash
# List global packages
npm list -g --depth=0

# Install global package
npm install -g typescript

# Update global packages
npm update -g
```

## Package Management

### Initialize Project
```bash
# Interactive init
npm init

# Quick init with defaults
npm init -y

# Create with scope
npm init --scope=@myorg
```

### Dependencies
```bash
# Add dependency
npm install express

# Add dev dependency
npm install --save-dev jest

# Add exact version
npm install lodash@4.17.21

# Add from git
npm install git+https://github.com/user/repo.git
```

### Scripts
```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest",
    "build": "webpack",
    "lint": "eslint .",
    "format": "prettier --write ."
  }
}
```

Run with:
```bash
npm run dev
nr dev        # Sigao alias
```

## Workspaces

### Monorepo Setup
```json
{
  "workspaces": [
    "packages/*",
    "apps/*"
  ]
}
```

### Workspace Commands
```bash
# Install all workspace deps
npm install

# Run script in workspace
npm run test --workspace=packages/core

# Install dep in workspace
npm install lodash --workspace=packages/utils
```

## Security

### Audit Dependencies
```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Force fixes (major updates)
npm audit fix --force
```

### Lock Files
```bash
# Clean install from lock
npm ci

# Update lock file
npm install --package-lock-only
```

## Performance Tips

### NPM Optimizations
```bash
# Faster installs
npm install --prefer-offline

# Skip optional dependencies
npm install --no-optional

# Use CI mode in production
npm ci --production
```

### Cache Management
```bash
# Verify cache
npm cache verify

# Clean cache
npm cache clean --force

# View cache location
npm config get cache
```

## Common Patterns

### Development Workflow
```bash
# Clone project
git clone repo && cd repo

# Auto-switch Node version
# (handled by .nvmrc)

# Install dependencies
ni  # or npm install

# Start development
nr dev  # or npm run dev
```

### Publishing Packages
```bash
# Login first
npm login

# Bump version
npm version patch  # or minor, major

# Publish
npm publish

# With scope
npm publish --access public
```

## Troubleshooting

### Permission Errors
```bash
# Never use sudo with npm
# Instead, fix npm permissions:
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
```

### Version Conflicts
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Use exact versions
npm install --save-exact
```

### NVM Issues
```bash
# Reinstall NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# Reset to system node
nvm deactivate

# Uninstall version
nvm uninstall 14.17.0
```

## Useful NPM Commands

```bash
# Show outdated packages
npm outdated

# List installed packages
npm list

# Package info
npm info express

# Search packages
npm search redis

# View package homepage
npm home express

# View package repo
npm repo express
```

## Environment Variables

```bash
# Node.js
export NODE_ENV="development"
export NODE_OPTIONS="--max-old-space-size=4096"

# NPM
export NPM_CONFIG_LOGLEVEL="warn"
export NPM_CONFIG_PROGRESS="false"
```

## Integration with direnv

Create `.envrc`:
```bash
use nvm
layout node

export NODE_ENV="development"
export PORT="3000"

PATH_add node_modules/.bin
```

## See Also

- `sigao help direnv` - Environment management
- `sigao help aliases` - NPM aliases
- NVM docs: https://github.com/nvm-sh/nvm
- NPM docs: https://docs.npmjs.com/