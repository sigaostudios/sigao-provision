import { runCommand, checkCommandExists } from '../../utils/shell.js';
import { BaseInstaller } from './base.js';

export class AzureCliInstaller extends BaseInstaller {
  isInstalled() {
    return checkCommandExists('az');
  }

  async install() {
    this.logger.info('Installing Azure CLI...');

    try {
      // Install via Microsoft's official script
      const { runShellScript } = await import('../../utils/shell.js');
      await runShellScript('curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash');

      this.logger.success('Azure CLI installed');
    } catch (_error) {
      this.logger.error('Failed to install Azure CLI');
      throw _error;
    }
  }

  async verify() {
    if (!await checkCommandExists('az')) {
      return false;
    }

    try {
      const { stdout } = await runCommand('az', ['--version']);
      const version = stdout.split('\n')[0];
      this.logger.info(`Azure CLI version: ${version}`);
      return true;
    } catch {
      return false;
    }
  }

  postInstall() {
    this.logger.info('Azure CLI installed successfully!');
    this.logger.info('');
    this.logger.info('To get started:');
    this.logger.info('  az login                    # Login to Azure');
    this.logger.info('  az account list             # List subscriptions');
    this.logger.info('  az configure --defaults     # Set default subscription');
    this.logger.info('');
    this.logger.info('Common commands:');
    this.logger.info('  az group create             # Create resource group');
    this.logger.info('  az vm create                # Create virtual machine');
    this.logger.info('  az webapp create            # Create web app');
    this.logger.info('  az storage account create   # Create storage account');

    return true;
  }
}
