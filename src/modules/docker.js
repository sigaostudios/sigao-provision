import fs from 'fs/promises';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { getPlatform, getOSInfo, isWSL } from '../utils/platform.js';
import { runCommand } from '../utils/shell.js';
import { BaseInstaller } from './base.js';

export class DockerInstaller extends BaseInstaller {
  constructor(config, options = {}) {
    super(config, options);
    this.installMethod = 'native'; // 'native' or 'desktop'
  }

  async collectConfig() {
    const config = {
      installMethod: 'native'
    };

    if (isWSL()) {
      console.log(chalk.yellow('\n  Detected WSL environment.'));
      const { dockerChoice } = await inquirer.prompt([{
        type: 'list',
        name: 'dockerChoice',
        message: 'Docker installation method:',
        choices: [
          { name: 'Install Docker Engine in WSL (standalone)', value: 'native' },
          { name: 'Skip Docker (install Docker Desktop later)', value: 'skip' }
        ],
        default: 'native'
      }]);

      config.installMethod = dockerChoice;
    }

    return config;
  }

  checkPrerequisites() {
    const platform = getPlatform();
    if (!platform.isLinux) {
      throw new Error('Docker installer only supports Linux. For macOS, please install Docker Desktop manually.');
    }

    // Check if running in WSL
    if (platform.isWSL) {
      this.logger.warn('Installing Docker in WSL. For best performance, consider using Docker Desktop on Windows.');
    }

    return true;
  }

  async isInstalled() {
    try {
      await runCommand('docker', ['--version'], { silent: true });

      // Also check if docker daemon is running
      try {
        await runCommand('docker', ['ps'], { silent: true });
        return true;
      } catch {
        this.logger.warn('Docker is installed but daemon is not running');
        return true; // Still consider it installed
      }
    } catch {
      return false;
    }
  }

  async getVersion() {
    try {
      const result = await runCommand('docker', ['--version'], { silent: true });
      return result.stdout.trim();
    } catch {
      return null;
    }
  }

  async install() {
    // Check if user chose to skip Docker installation
    if (this.installMethod === 'skip') {
      this.logger.info('Skipping Docker installation as requested.');
      this.logger.info('Please install Docker Desktop from: https://www.docker.com/products/docker-desktop/');
      return { success: true, skipped: true };
    }

    const _osInfo = await getOSInfo();

    this.logger.info('Installing Docker dependencies...');

    // Install prerequisites
    await runCommand('sudo', ['apt-get', 'update']);
    await runCommand('sudo', ['apt-get', 'install', '-y',
      'ca-certificates',
      'curl',
      'gnupg',
      'lsb-release'
    ]);

    // Add Docker's official GPG key
    this.logger.info('Adding Docker GPG key...');
    await runCommand('sudo', ['mkdir', '-p', '/etc/apt/keyrings']);
    await runCommand('bash', ['-c',
      'curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg'
    ]);

    // Set up the repository
    this.logger.info('Setting up Docker repository...');
    const arch = process.arch === 'x64' ? 'amd64' : process.arch;
    const repoCommand = `echo "deb [arch=${arch} signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null`;

    await runCommand('bash', ['-c', repoCommand]);

    // Install Docker Engine
    this.logger.info('Installing Docker Engine...');
    await runCommand('sudo', ['apt-get', 'update']);
    await runCommand('sudo', ['apt-get', 'install', '-y',
      'docker-ce',
      'docker-ce-cli',
      'containerd.io',
      'docker-buildx-plugin',
      'docker-compose-plugin'
    ]);

    return { installed: true };
  }

  async configure() {
    const platform = getPlatform();

    // Add current user to docker group
    this.logger.info('Adding user to docker group...');
    const username = process.env.USER || 'user';

    try {
      // Create docker group if it doesn't exist
      await runCommand('sudo', ['groupadd', 'docker']).catch(() => {});

      // Add user to docker group
      await runCommand('sudo', ['usermod', '-aG', 'docker', username]);

      this.logger.info(`Added ${username} to docker group`);
      this.logger.warn('You need to log out and back in for group changes to take effect');
    } catch (_error) {
      this.logger.warn(`Could not add user to docker group: ${_error.message}`);
    }

    // For WSL, additional configuration
    if (platform.isWSL) {
      this.logger.info('Configuring Docker for WSL...');

      // Create docker config directory
      const dockerDir = `${platform.homeDir}/.docker`;
      await fs.mkdir(dockerDir, { recursive: true }).catch(() => {});

      // Start Docker service (WSL2)
      try {
        await runCommand('sudo', ['service', 'docker', 'start']);
        this.logger.info('Started Docker service');
      } catch (_error) {
        this.logger.warn('Could not start Docker service. You may need to start it manually with: sudo service docker start');
      }
    }
  }

  async verify() {
    try {
      // Test docker command
      await runCommand('docker', ['--version'], { silent: true });

      // Try to run a test container (will fail if daemon not running)
      try {
        await runCommand('sudo', ['docker', 'run', '--rm', 'hello-world'], { silent: true });
        this.logger.info('Docker is working correctly');
        return true;
      } catch {
        this.logger.warn('Docker is installed but may require sudo or daemon is not running');
        return true;
      }
    } catch {
      return false;
    }
  }

  getInstructions() {
    const platform = getPlatform();
    const instructions = [
      'Docker has been installed!',
      '',
      'IMPORTANT: You need to log out and back in for group changes to take effect.',
      'After logging back in, you can use docker without sudo.',
      '',
      'To start Docker daemon (if not running):',
      '  sudo service docker start',
      '',
      'To test Docker installation:',
      '  docker run hello-world',
      '',
      'Common Docker commands:',
      '  docker ps                    # List running containers',
      '  docker images                # List images',
      '  docker compose up            # Start services with docker-compose'
    ];

    if (platform.isWSL) {
      instructions.push('',
        'WSL-specific notes:',
        '- For best performance, consider using Docker Desktop on Windows',
        '- You may need to start Docker manually after each WSL session',
        '- Add "sudo service docker start" to your .bashrc to auto-start'
      );
    }

    return instructions;
  }
}
