import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { runCommand, checkCommandExists } from '../utils/shell.js';
import { BaseInstaller } from './base.js';
import { readModification, updateModification, getCurrentVersion } from './change-index.js';

/**
 * Cargo (Rust) installer module
 * Installs Rust and Cargo using rustup
 */
export class CargoInstaller extends BaseInstaller {

  async isInstalled() {
    const hasRustup = await checkCommandExists('rustup');
    const hasCargo = await checkCommandExists('cargo');
    const hasRustc = await checkCommandExists('rustc');
    return hasRustup && hasCargo && hasRustc;
  }

  async install() {
    try {
      this.logger.info('Installing Rust and Cargo...');

      // Download and run rustup installer with proper flags
      // -y flag auto-accepts the default installation options
      // --default-toolchain stable ensures we get the stable toolchain
      // --profile default includes all the standard components
      const result = await runCommand(
        'sh',
        ['-c', 'curl --proto "=https" --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain stable --profile default'],
        { 
          shell: false,
          env: {
            ...process.env,
            CARGO_HOME: path.join(os.homedir(), '.cargo'),
            RUSTUP_HOME: path.join(os.homedir(), '.rustup')
          }
        }
      );

      // Add cargo to PATH for current session
      const cargoHome = path.join(os.homedir(), '.cargo');
      const cargoBin = path.join(cargoHome, 'bin');
      
      // Update PATH for subsequent commands in this process
      process.env.PATH = `${cargoBin}:${process.env.PATH}`;

      this.logger.success('Rust and Cargo installed successfully');
      this.logger.info('Note: You may need to restart your terminal or run: source $HOME/.cargo/env');
      return true;
    } catch (error) {
      this.logger.error(`Failed to install Rust and Cargo: ${error.message}`);
      return false;
    }
  }

  async verify() {
    // Check if binaries exist in the cargo bin directory
    const cargoBin = path.join(os.homedir(), '.cargo', 'bin');
    const binaries = ['rustup', 'cargo', 'rustc'];
    
    try {
      // Check if all binaries exist
      for (const binary of binaries) {
        const binaryPath = path.join(cargoBin, binary);
        try {
          await fs.access(binaryPath, fs.constants.X_OK);
        } catch {
          // Binary doesn't exist or isn't executable
          return false;
        }
      }

      // Try to run version commands using full paths
      const cargoPath = path.join(cargoBin, 'cargo');
      const rustcPath = path.join(cargoBin, 'rustc');
      
      try {
        await runCommand(cargoPath, ['--version']);
        await runCommand(rustcPath, ['--version']);
        return true;
      } catch {
        // Commands failed to run
        return false;
      }
    } catch {
      return false;
    }
  }

  async configure(shell = 'bash') {
    try {
      // The rustup installer automatically adds the necessary PATH configuration
      // to the shell profile, but we'll ensure it's sourced in the active shell config
      const cargoEnv = path.join(os.homedir(), '.cargo', 'env');

      // Check if cargo env file exists
      try {
        await fs.access(cargoEnv);
      } catch {
        this.logger.error('Cargo env file not found. Rust installation may have failed.');
        return false;
      }

      const rcFile = shell === 'zsh' ? '.zshrc' : '.bashrc';
      const rcPath = path.join(os.homedir(), rcFile);

      // Read current shell config
      let content = '';
      try {
        content = await fs.readFile(rcPath, 'utf-8');
      } catch {
        // File doesn't exist, that's okay
      }

      // Check if cargo env file exists and prepare configuration
      const version = getCurrentVersion();
      let cargoConfig;
      
      if (await fs.access(cargoEnv).then(() => true).catch(() => false)) {
        // Use the env file if it exists
        cargoConfig = `# Rust/Cargo configuration
source "$HOME/.cargo/env"`;
      } else {
        // Fallback to manual PATH export if env file doesn't exist
        cargoConfig = `# Rust/Cargo configuration
export PATH="$HOME/.cargo/bin:$PATH"`;
      }
      
      // Add or update cargo configuration
      await updateModification(rcPath, 'cargo-config', cargoConfig, version);
      this.logger.info(`Added Cargo environment to ${rcFile}`);

      return true;
    } catch (_error) {
      this.logger.error(`Failed to configure Cargo: ${_error.message}`);
      return false;
    }
  }
}
