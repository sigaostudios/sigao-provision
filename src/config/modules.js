export const modules = [
  // Enabled by default - Core tools
  {
    id: 'shell',
    name: 'Shell Selection',
    description: 'Choose between Bash or Zsh with Oh My Zsh',
    enabled: true,
    priority: 1,
    tags: ['core', 'shell'],
    installer: 'shell'
  },
  {
    id: 'essentials',
    name: 'Essential Tools',
    description: 'Git, GitHub CLI, ripgrep, curl, wget, and unzip',
    enabled: true,
    priority: 2,
    tags: ['core', 'required'],
    installer: 'essentials'
  },
  {
    id: 'git-config',
    name: 'Git Configuration',
    description: 'Interactive Git setup with user info and recommended settings',
    enabled: true,
    priority: 3,
    tags: ['git', 'config'],
    installer: 'git-enhanced'
  },
  {
    id: 'cargo',
    name: 'Rust/Cargo',
    description: 'Rust programming language and Cargo package manager',
    enabled: true,
    priority: 4,
    tags: ['rust', 'cargo', 'tools'],
    installer: 'cargo'
  },
  {
    id: 'cli-tools',
    name: 'Modern CLI Tools',
    description: 'fd, bat, fzf, lazygit, zoxide, and more',
    enabled: true,
    priority: 5,
    tags: ['cli', 'tools'],
    installer: 'cli-tools',
    dependencies: ['cargo']
  },
  {
    id: 'direnv',
    name: 'Direnv',
    description: 'Environment variable management with shell integration',
    enabled: true,
    priority: 6,
    tags: ['env', 'tools'],
    installer: 'direnv'
  },
  {
    id: 'node',
    name: 'Node.js (via NVM)',
    description: 'Install NVM and latest LTS Node.js',
    enabled: true,
    priority: 7,
    tags: ['node', 'javascript'],
    installer: 'node',
    options: {
      version: 'lts',
      globalPackages: []
    }
  },
  {
    id: 'claude',
    name: 'Claude Code CLI',
    description: 'Anthropic Claude Code CLI tool',
    enabled: true,
    priority: 8,
    tags: ['ai', 'claude'],
    installer: 'claude',
    dependencies: ['node']
  },
  {
    id: 'docker',
    name: 'Docker',
    description: 'Docker container runtime with compose',
    enabled: true,
    priority: 9,
    tags: ['containers', 'docker'],
    installer: 'docker'
  },
  {
    id: 'shell-enhancements',
    name: 'Shell Enhancements',
    description: 'Starship prompt, development directories, and navigation aliases',
    enabled: true,
    priority: 10,
    tags: ['shell', 'productivity'],
    installer: 'shell-enhancements',
    dependencies: ['shell', 'cli-tools']
  },
  {
    id: 'azure-cli',
    name: 'Azure CLI',
    description: 'Microsoft Azure command-line interface',
    enabled: true,
    priority: 11,
    tags: ['cloud', 'azure'],
    installer: 'azure-cli'
  },

  // Disabled by default - Optional tools
  {
    id: 'dotnet',
    name: '.NET SDK',
    description: 'Microsoft .NET SDK (latest) with Entity Framework and other tools',
    enabled: false,
    priority: 12,
    tags: ['dotnet', 'csharp'],
    installer: 'dotnet'
  },
  {
    id: 'python-tools',
    name: 'Python Development Tools',
    description: 'Python tools via pipx (black, ruff, mypy, pytest, poetry)',
    enabled: false,
    priority: 13,
    tags: ['python'],
    installer: 'python-tools'
  },
  {
    id: 'python',
    name: 'Python (via pyenv)',
    description: 'Python with pyenv version manager',
    enabled: false,
    priority: 14,
    tags: ['python', 'advanced'],
    installer: 'python'
  }
];

export function getModuleById(id) {
  return modules.find(m => m.id === id);
}

export function getModulesByTag(tag) {
  return modules.filter(m => m.tags.includes(tag));
}

export function getEnabledModules() {
  return modules.filter(m => m.enabled);
}

export function sortModulesByPriority(moduleList) {
  return [...moduleList].sort((a, b) => a.priority - b.priority);
}

export const categories = [
  {
    name: 'Core Tools',
    modules: ['shell', 'essentials', 'git-config']
  },
  {
    name: 'Development Environments',
    modules: ['node', 'python', 'python-tools', 'dotnet', 'docker', 'cargo']
  },
  {
    name: 'CLI Enhancements',
    modules: ['cli-tools', 'shell-enhancements', 'direnv']
  },
  {
    name: 'Cloud & Services',
    modules: ['claude', 'azure-cli']
  }
];
