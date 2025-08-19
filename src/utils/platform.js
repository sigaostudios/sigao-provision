import os from 'os';
import fs from 'fs/promises';
import { execa } from 'execa';

export function getPlatform() {
  return {
    os: process.platform,
    arch: process.arch,
    isWSL: isWSL(),
    isLinux: process.platform === 'linux',
    isMac: process.platform === 'darwin',
    isWindows: process.platform === 'win32',
    homeDir: os.homedir(),
    shell: process.env.SHELL || '/bin/bash'
  };
}

export function isWSL() {
  if (process.platform !== 'linux') return false;

  try {
    const release = os.release().toLowerCase();
    return release.includes('microsoft') || release.includes('wsl');
  } catch {
    return false;
  }
}

export async function hasCommand(command) {
  try {
    await execa('which', [command]);
    return true;
  } catch {
    return false;
  }
}

export function isRoot() {
  return process.getuid && process.getuid() === 0;
}

export async function getOSInfo() {
  const platform = getPlatform();

  if (platform.isLinux) {
    try {
      const osRelease = await fs.readFile('/etc/os-release', 'utf-8');
      const lines = osRelease.split('\n');
      const info = {};

      lines.forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
          info[key] = value.replace(/"/g, '');
        }
      });

      // Check if it's an apt-based system
      const isApt = ['ubuntu', 'debian', 'linuxmint', 'pop', 'elementary', 'kali', 'parrot'].includes(
        (info.ID || '').toLowerCase()
      ) || (info.ID_LIKE || '').toLowerCase().includes('debian');

      return {
        ...platform,
        distro: info.ID || 'unknown',
        distroName: info.NAME || 'Unknown Linux',
        version: info.VERSION_ID || 'unknown',
        isApt
      };
    } catch {
      return {
        ...platform,
        isApt: false
      };
    }
  }

  return {
    ...platform,
    isApt: false
  };
}

export function getPackageManager() {
  const platform = getPlatform();

  if (platform.isLinux) {
    // Check for common package managers
    const managers = [
      { cmd: 'apt', install: 'apt install -y', update: 'apt update', needsSudo: true },
      { cmd: 'dnf', install: 'dnf install -y', update: 'dnf update', needsSudo: true },
      { cmd: 'yum', install: 'yum install -y', update: 'yum update', needsSudo: true },
      { cmd: 'pacman', install: 'pacman -S --noconfirm', update: 'pacman -Syu', needsSudo: true },
      { cmd: 'zypper', install: 'zypper install -y', update: 'zypper refresh', needsSudo: true }
    ];

    // Return first available manager
    return managers.find(m => hasCommand(m.cmd));
  } else if (platform.isMac) {
    return { cmd: 'brew', install: 'brew install', update: 'brew update', needsSudo: false };
  }

  return null;
}
