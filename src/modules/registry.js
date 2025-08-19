import { EssentialsInstaller } from './essentials.js';
import { GitInstaller } from './git.js';
import { GitEnhancedInstaller } from './git-enhanced.js';
import { NodeInstaller } from './node.js';
import { ClaudeInstaller } from './claude.js';
import { DotNetInstaller } from './dotnet.js';
import { DockerInstaller } from './docker.js';
import { PythonInstaller } from './python.js';
import { PythonToolsInstaller } from './python-tools.js';
import { ShellInstaller } from './shell.js';
import { DirenvInstaller } from './direnv.js';
import { CLIToolsInstaller } from './cli-tools.js';
import { ShellEnhancementsInstaller } from './shell-enhancements.js';
import { AzureCliInstaller } from './azure-cli.js';
import { CargoInstaller } from './cargo.js';

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
