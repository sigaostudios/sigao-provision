import { createLogger } from '../../utils/logger.js';

export class BaseInstaller {
  constructor(module, options = {}) {
    this.module = module;
    this.options = options;
    this.logger = createLogger({ prefix: module.id });
    this.dryRun = options.dryRun || false;
    this.globalConfig = null; // Will be set by the main installer
  }

  collectConfig() {
    // Override in subclasses to collect configuration upfront
    // This is called before any installations begin
    return {};
  }

  checkDependencies() {
    if (!this.module.dependencies) return true;

    // Check if dependency modules were installed
    for (const dep of this.module.dependencies) {
      // Check if the dependency was installed in this session
      if (this.globalConfig?.installedModules?.has(dep)) {
        this.logger.debug(`Dependency ${dep} satisfied (installed in current session)`);
        continue;
      }

      // For some dependencies, we need special handling
      if (dep === 'shell') {
        // Shell dependency is satisfied if we have shell configuration
        if (this.globalConfig?.shellConfig) {
          this.logger.debug('Shell dependency satisfied via configuration');
          continue;
        }
      }

      // Try to check if the dependency is installed on the system
      // This is a best-effort check - we don't fail hard on dependencies
      this.logger.warn(`Dependency ${dep} may not be satisfied - continuing anyway`);
    }

    // We don't fail on missing dependencies, just warn
    // This allows the installer to be more flexible
    return true;
  }

  isInstalled(_what = null) {
    // Override in subclasses
    return false;
  }

  preInstall() {
    // Override in subclasses for pre-installation checks
    return true;
  }

  install() {
    // Override in subclasses
    throw new Error('install() must be implemented by subclass');
  }

  postInstall() {
    // Override in subclasses for post-installation tasks
    return true;
  }

  verify() {
    // Override in subclasses to verify installation
    return true;
  }

  getShellConfigFiles() {
    // Get the shell configuration files to update based on user selection
    if (this.globalConfig?.shellConfig) {
      // User selected a specific shell, use that config file
      return [this.globalConfig.shellConfig];
    }

    // Fallback: update both common shell config files if they exist
    // This ensures compatibility regardless of shell choice
    return ['.bashrc', '.zshrc'];
  }

  async run() {
    try {
      this.logger.info(`Starting installation of ${this.module.name}...`);

      // Check if already installed
      if (await this.isInstalled()) {
        this.logger.success(`${this.module.name} is already installed`);
        return { success: true, skipped: true };
      }

      // Check dependencies
      if (!await this.checkDependencies()) {
        throw new Error('Dependencies not met');
      }

      // Pre-install
      if (!await this.preInstall()) {
        throw new Error('Pre-installation checks failed');
      }

      // Install
      if (this.dryRun) {
        this.logger.info(`[DRY RUN] Would install ${this.module.name}`);
      } else {
        await this.install();
      }

      // Post-install
      if (!this.dryRun) {
        await this.postInstall();
      }

      // Verify
      if (!this.dryRun && !await this.verify()) {
        throw new Error('Installation verification failed');
      }

      this.logger.success(`${this.module.name} installed successfully`);
      return { success: true, skipped: false };

    } catch (_error) {
      this.logger.error(`Failed to install ${this.module.name}: ${_error.message}`);
      return { success: false, error: _error.message };
    }
  }
}
