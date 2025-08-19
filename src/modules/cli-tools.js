import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { runCommand, checkCommandExists, runWithSpinner } from '../utils/shell.js';
import { BaseInstaller } from './base.js';

export class CLIToolsInstaller extends BaseInstaller {
  constructor(module, options = {}) {
    super(module, options);
    this.tools = [
      { name: 'ripgrep', pkg: 'ripgrep', cmd: 'rg', description: 'Better grep' },
      { name: 'fd-find', pkg: 'fd-find', cmd: 'fd', altCmd: 'fdfind', description: 'Better find' },
      { name: 'bat', pkg: 'bat', cmd: 'bat', altCmd: 'batcat', description: 'Better cat with syntax highlighting' },
      { name: 'htop', pkg: 'htop', cmd: 'htop', description: 'Interactive process viewer' },
      { name: 'ncdu', pkg: 'ncdu', cmd: 'ncdu', description: 'Disk usage analyzer' },
      { name: 'tldr', pkg: 'tldr', cmd: 'tldr', description: 'Simplified man pages' },
      { name: 'httpie', pkg: 'httpie', cmd: 'http', description: 'Modern HTTP client' },
      { name: 'jq', pkg: 'jq', cmd: 'jq', description: 'JSON processor' },
      { name: 'tmux', pkg: 'tmux', cmd: 'tmux', description: 'Terminal multiplexer' },
      { name: 'btop', pkg: 'btop', cmd: 'btop', description: 'Beautiful resource monitor' },
      { name: 'procs', pkg: 'procs', cmd: 'procs', description: 'Modern ps replacement' }
    ];
    // Note: Additional tools (fzf, lazygit, zoxide, glow, eza) are installed via custom methods
  }

  async isInstalled() {
    // Check if majority of tools are installed
    let installedCount = 0;
    for (const tool of this.tools) {
      if (await checkCommandExists(tool.cmd) || (tool.altCmd && await checkCommandExists(tool.altCmd))) {
        installedCount++;
      }
    }
    return installedCount >= this.tools.length * 0.7;
  }

  async install() {
    this.logger.info('Installing modern CLI tools...');

    // Skip on Windows
    if (process.platform === 'win32') {
      this.logger.warn('CLI tools installation is not supported on Windows.');
      this.logger.info('Please install tools manually or use WSL for full functionality.');
      return;
    }

    // Update package lists
    await runCommand('sudo', ['apt', 'update']);

    // Install tools via apt (excluding procs which isn't in standard repos)
    const aptTools = this.tools.filter(t => t.name !== 'procs').map(t => t.pkg);
    try {
      await runWithSpinner(
        'Installing CLI tools via apt...',
        () => runCommand('sudo', ['apt', 'install', '-y', ...aptTools])
      );
    } catch (_error) {
      this.logger.warn('Some tools failed to install via apt');
    }

    // Create symlinks for tools with alternative names
    for (const tool of this.tools) {
      if (tool.altCmd && await checkCommandExists(tool.altCmd) && !await checkCommandExists(tool.cmd)) {
        try {
          const altPath = await this.which(tool.altCmd);
          await runCommand('sudo', ['ln', '-sf', altPath, `/usr/local/bin/${tool.cmd}`]);
          this.logger.success(`Created symlink: ${tool.cmd} -> ${tool.altCmd}`);
        } catch (_error) {
          this.logger.debug(`Failed to create symlink for ${tool.cmd}`);
        }
      }
    }

    // Install fzf (fuzzy finder)
    await this.installFzf();

    // Install lazygit
    await this.installLazygit();

    // Install zoxide (better cd)
    await this.installZoxide();

    // Install glow (markdown renderer)
    await this.installGlow();

    // Install eza (modern ls)
    await this.installEza();

    // Install procs (modern ps)
    await this.installProcs();

    this.logger.success('CLI tools installation complete');
  }

  async installFzf() {
    const fzfPath = path.join(os.homedir(), '.fzf');

    if (await this.pathExists(fzfPath)) {
      this.logger.info('fzf already installed');
      return;
    }

    this.logger.info('Installing fzf (fuzzy finder)...');

    try {
      await runCommand('git', ['clone', '--depth', '1', 'https://github.com/junegunn/fzf.git', fzfPath]);
      await runCommand('bash', [path.join(fzfPath, 'install'), '--all', '--no-bash', '--no-fish']);
      this.logger.success('fzf installed');
    } catch (_error) {
      this.logger.warn('Failed to install fzf');
    }
  }

  async installLazygit() {
    if (await checkCommandExists('lazygit')) {
      this.logger.info('lazygit already installed');
      return;
    }

    this.logger.info('Installing lazygit...');

    try {
      // Install via binary download
      const { stdout } = await runCommand('curl', ['-s', 'https://api.github.com/repos/jesseduffield/lazygit/releases/latest']);
      const release = JSON.parse(stdout);
      const asset = release.assets.find(a => a.name.includes('Linux_x86_64.tar.gz'));

      if (asset) {
        await runCommand('wget', [asset.browser_download_url, '-O', '/tmp/lazygit.tar.gz']);
        await runCommand('tar', ['xf', '/tmp/lazygit.tar.gz', '-C', '/tmp']);
        await runCommand('sudo', ['mv', '/tmp/lazygit', '/usr/local/bin/']);
        await runCommand('rm', ['/tmp/lazygit.tar.gz']);
      }
      this.logger.success('lazygit installed');
    } catch (_error) {
      this.logger.warn('Failed to install lazygit');
    }
  }

  async installZoxide() {
    if (await checkCommandExists('zoxide')) {
      this.logger.info('zoxide already installed');
      return;
    }

    this.logger.info('Installing zoxide (better cd)...');

    try {
      // Check if cargo is available
      if (!await checkCommandExists('cargo')) {
        throw new Error('Cargo is required to install zoxide. Please ensure Rust/Cargo is installed first.');
      }

      // Install zoxide using cargo
      await runCommand('cargo', ['install', 'zoxide', '--locked']);

      // Verify installation succeeded
      if (await checkCommandExists('zoxide')) {
        this.logger.success('zoxide installed via cargo');
      } else {
        throw new Error('zoxide installation completed but command not found');
      }
    } catch (_error) {
      this.logger.warn(`Failed to install zoxide: ${_error.message}`);
      this.logger.debug('Error details:', _error);
    }
  }

  async installGlow() {
    if (await checkCommandExists('glow')) {
      this.logger.info('glow already installed');
      return;
    }

    this.logger.info('Installing glow (markdown renderer)...');

    try {
      // Check if snap is available
      if (!await checkCommandExists('snap')) {
        throw new Error('Snap is required to install glow. Please ensure snapd is installed.');
      }

      // Install glow using snap
      const result = await runCommand('sudo', ['snap', 'install', 'glow']);
      
      // Verify installation succeeded
      if (await checkCommandExists('glow')) {
        this.logger.success('glow installed via snap');
      } else {
        throw new Error('glow installation completed but command not found');
      }
    } catch (_error) {
      this.logger.warn(`Failed to install glow: ${_error.message}`);
      this.logger.info('You can install glow manually via snap: sudo snap install glow');
    }
  }

  async installProcs() {
    if (await checkCommandExists('procs')) {
      this.logger.info('procs already installed');
      return;
    }

    this.logger.info('Installing procs (modern ps replacement)...');

    try {
      // Install from GitHub releases
      const { stdout } = await runCommand('curl', ['-s', 'https://api.github.com/repos/dalance/procs/releases/latest']);
      const release = JSON.parse(stdout);
      const arch = process.arch === 'x64' ? 'x86_64' : process.arch;
      const asset = release.assets.find(a => a.name.includes(`${arch}-linux`) && a.name.endsWith('.zip'));

      if (asset) {
        this.logger.info('Installing procs from GitHub release...');
        await runCommand('wget', [asset.browser_download_url, '-O', '/tmp/procs.zip']);
        await runCommand('unzip', ['-o', '/tmp/procs.zip', '-d', '/tmp']);
        await runCommand('sudo', ['mv', '/tmp/procs', '/usr/local/bin/']);
        await runCommand('sudo', ['chmod', '+x', '/usr/local/bin/procs']);
        await runCommand('rm', ['-f', '/tmp/procs.zip']);
        
        // Verify installation succeeded
        if (await checkCommandExists('procs')) {
          this.logger.success('procs installed to /usr/local/bin');
        } else {
          throw new Error('procs installation completed but command not found');
        }
      } else {
        throw new Error(`Could not find procs release for ${arch} Linux`);
      }
    } catch (_error) {
      this.logger.warn(`Failed to install procs: ${_error.message}`);
      this.logger.info('You can install procs manually from: https://github.com/dalance/procs/releases');
    }
  }

  async installEza() {
    if (await checkCommandExists('eza')) {
      this.logger.info('eza already installed');
      return;
    }

    this.logger.info('Installing eza (modern ls)...');

    try {
      // First ensure we have gpg
      try {
        await runCommand('sudo', ['apt', 'update']);
        await runCommand('sudo', ['apt', 'install', '-y', 'gpg']);
      } catch (_error) {
        this.logger.debug('gpg installation failed or already installed');
      }

      // Add the gierens repository key and source
      await runCommand('sudo', ['mkdir', '-p', '/etc/apt/keyrings']);

      const { runShellScript } = await import('../utils/shell.js');

      // Download and add GPG key
      await runShellScript(`
        wget -qO- https://raw.githubusercontent.com/eza-community/eza/main/deb.asc | sudo gpg --dearmor -o /etc/apt/keyrings/gierens.gpg
      `);

      // Add repository to sources list
      await runShellScript(`
        echo "deb [signed-by=/etc/apt/keyrings/gierens.gpg] http://deb.gierens.de stable main" | sudo tee /etc/apt/sources.list.d/gierens.list
      `);

      // Set correct permissions
      await runCommand('sudo', ['chmod', '644', '/etc/apt/keyrings/gierens.gpg', '/etc/apt/sources.list.d/gierens.list']);

      // Update package list and install eza
      await runCommand('sudo', ['apt', 'update']);
      await runCommand('sudo', ['apt', 'install', '-y', 'eza']);

      // Verify installation succeeded
      if (await checkCommandExists('eza')) {
        this.logger.success('eza installed successfully');
      } else {
        throw new Error('eza installation completed but command not found');
      }
    } catch (_error) {
      this.logger.warn('Failed to install eza via repository, trying alternative method...');

      try {
        // Fallback: install via cargo if available
        if (await checkCommandExists('cargo')) {
          await runCommand('cargo', ['install', 'eza']);
          
          // Verify installation succeeded
          if (await checkCommandExists('eza')) {
            this.logger.success('eza installed via cargo');
          } else {
            throw new Error('eza installation via cargo completed but command not found');
          }
        } else {
          throw new Error('cargo not available for fallback installation');
        }
      } catch (_fallbackError) {
        this.logger.warn(`Failed to install eza: ${_fallbackError.message}`);
        this.logger.info('You can install eza manually from: https://github.com/eza-community/eza');
      }
    }
  }

  async which(cmd) {
    const whichCmd = process.platform === 'win32' ? 'where' : 'which';
    const { stdout } = await runCommand(whichCmd, [cmd]);
    return stdout.trim();
  }

  async pathExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async verify() {
    const results = [];
    for (const tool of this.tools) {
      const installed = await checkCommandExists(tool.cmd) || (tool.altCmd && await checkCommandExists(tool.altCmd));
      results.push({ name: tool.name, installed });
    }

    // Check additional tools
    const additionalTools = ['fzf', 'lazygit', 'zoxide', 'glow', 'eza'];
    for (const tool of additionalTools) {
      results.push({
        name: tool,
        installed: await checkCommandExists(tool) || (tool === 'fzf' && await this.pathExists(path.join(os.homedir(), '.fzf')))
      });
    }

    // Log results
    this.logger.info('CLI Tools Status:');
    for (const result of results) {
      if (result.installed) {
        this.logger.success(`  ✓ ${result.name}`);
      } else {
        this.logger.warn(`  ✗ ${result.name}`);
      }
    }

    // Return true if most tools are installed
    const installedCount = results.filter(r => r.installed).length;
    return installedCount >= results.length * 0.7;
  }
}
