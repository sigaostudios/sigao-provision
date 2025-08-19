import { EssentialsInstaller } from './setup/essentials.js';
import { GitInstaller } from './setup/git.js';
import { GitEnhancedInstaller } from './setup/git-enhanced.js';
import { NodeInstaller } from './setup/node.js';
import { ClaudeInstaller } from './setup/claude.js';
import { DotNetInstaller } from './setup/dotnet.js';
import { DockerInstaller } from './setup/docker.js';
import { PythonInstaller } from './setup/python.js';
import { PythonToolsInstaller } from './setup/python-tools.js';
import { ShellInstaller } from './setup/shell.js';
import { DirenvInstaller } from './setup/direnv.js';
import { CLIToolsInstaller } from './setup/cli-tools.js';
import { ShellEnhancementsInstaller } from './setup/shell-enhancements.js';
import { AzureCliInstaller } from './setup/azure-cli.js';
import { CargoInstaller } from './setup/cargo.js';

const installerMap = {
  'essentials': EssentialsInstaller,
  'git': GitInstaller,
  'git-enhanced': GitEnhancedInstaller,
  'node': NodeInstaller,
  'claude': ClaudeInstaller,
  'dotnet': DotNetInstaller,
  'docker': DockerInstaller,
  'python': PythonInstaller,
  'python-tools': PythonToolsInstaller,
  'shell': ShellInstaller,
  'direnv': DirenvInstaller,
  'cli-tools': CLIToolsInstaller,
  'shell-enhancements': ShellEnhancementsInstaller,
  'azure-cli': AzureCliInstaller,
  'cargo': CargoInstaller
};

export function getInstaller(module, options) {
  const InstallerClass = installerMap[module.installer];

  if (!InstallerClass) {
    throw new Error(`No installer found for module: ${module.id}`);
  }

  return new InstallerClass(module, options);
}

export function registerInstaller(name, installerClass) {
  installerMap[name] = installerClass;
}
