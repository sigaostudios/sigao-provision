/**
 * SIGAO Shell Configuration Modification Index
 * 
 * This file tracks all modifications made to shell configuration files (.bashrc, .zshrc)
 * by the Sigao CLI installer modules. Each modification is wrapped in SIGAO_MOD tags
 * for easy identification and management.
 * 
 * Tag Format: #<SIGAO_MOD name='mod-name' ver='version' hash='sha256hash'>...</SIGAO_MOD>
 * 
 * The hash is the first 16 characters of the SHA256 hash of the trimmed content,
 * used to detect manual modifications (drift) to the generated code.
 */

import fs from 'fs/promises';
import crypto from 'crypto';

export const SHELL_MODIFICATIONS = {
  // shell.js module modifications
  'shell': [
    {
      name: 'logo-display',
      description: 'Displays Sigao logo on terminal start',
      files: ['.bashrc', '.zshrc'],
      content: 'Logo display logic with ANSI file'
    },
    {
      name: 'oh-my-zsh-config',
      description: 'Oh My Zsh configuration and plugin setup',
      files: ['.zshrc'],
      content: 'ZSH theme, plugins configuration'
    },
    {
      name: 'path-setup',
      description: 'Basic PATH configuration and locale settings',
      files: ['.zshrc'],
      content: 'Local bin paths, cargo bin, locale exports'
    },
    {
      name: 'tool-integrations',
      description: 'Tool integrations (FZF, direnv, NVM, pyenv, Starship)',
      files: ['.zshrc'],
      content: 'Hooks and initializations for various tools'
    },
    {
      name: 'aliases-placeholder',
      description: 'Placeholder for aliases added by shell-enhancements',
      files: ['.zshrc'],
      content: 'Note about shell-enhancements module'
    },
    {
      name: 'bash-enhancements',
      description: 'Enhanced Bash configuration',
      files: ['.bashrc'],
      content: 'Bash completion, history settings, basic aliases, color support'
    },
    {
      name: 'wsl-path-cleanup',
      description: 'WSL-specific PATH cleanup to remove Windows Node/npm paths',
      files: ['.bashrc', '.zshrc'],
      content: 'Filters out Windows Node.js/npm paths while preserving other Windows tools'
    }
  ],

  // claude.js module modifications
  'claude': [
    {
      name: 'claude-nvm-default',
      description: 'Ensures NVM default version is loaded for Claude CLI',
      files: ['.bashrc', '.zshrc'],
      content: 'nvm use default command'
    }
  ],

  // direnv.js module modifications
  'direnv': [
    {
      name: 'direnv-hook',
      description: 'Direnv shell hook for automatic environment loading',
      files: ['.bashrc', '.zshrc'],
      content: 'direnv hook for bash/zsh'
    },
    {
      name: 'direnv-plugin',
      description: 'Adds direnv to Oh My Zsh plugins list',
      files: ['.zshrc'],
      content: 'Updates plugins=() array in Oh My Zsh config'
    }
  ],

  // dotnet.js module modifications
  'dotnet': [
    {
      name: 'dotnet-path',
      description: '.NET SDK PATH configuration',
      files: ['.bashrc', '.zshrc'],
      content: 'DOTNET_ROOT and PATH exports'
    },
    {
      name: 'dotnet-telemetry',
      description: 'Disables .NET CLI telemetry',
      files: ['.bashrc', '.zshrc'],
      content: 'DOTNET_CLI_TELEMETRY_OPTOUT export'
    }
  ],

  // python.js module modifications
  'python': [
    {
      name: 'pyenv-config',
      description: 'pyenv configuration for Python version management',
      files: ['.bashrc', '.zshrc'],
      content: 'PYENV_ROOT, PATH, and pyenv init commands'
    }
  ],

  // shell-enhancements.js module modifications
  'shell-enhancements': [
    {
      name: 'starship-init',
      description: 'Starship prompt initialization',
      files: ['.bashrc', '.zshrc'],
      content: 'Starship init command'
    },
    {
      name: 'zoxide-init',
      description: 'Zoxide (smart cd) initialization',
      files: ['.bashrc', '.zshrc'],
      content: 'Zoxide init command'
    },
    {
      name: 'fzf-init',
      description: 'FZF (fuzzy finder) configuration',
      files: ['.bashrc', '.zshrc'],
      content: 'Sources FZF configuration files'
    },
    {
      name: 'shell-enhancements-aliases',
      description: 'Comprehensive aliases and functions collection',
      files: ['.bashrc', '.zshrc'],
      content: `Includes:
        - Navigation aliases (dev, devs, devp, devw)
        - Git aliases (g, gs, ga, gc, gp, etc.)
        - GitHub CLI aliases and functions
        - Modern CLI tool aliases (bat→cat, eza→ls, etc.)
        - Docker aliases
        - Python/Node.js aliases
        - Utility functions (mkcd, extract, proj, etc.)
        - Auto NVM directory switching`
    },
    {
      name: 'logo-display',
      description: 'Sigao logo display on terminal start',
      files: ['.bashrc', '.zshrc'],
      content: 'Logo display logic (duplicate of shell.js for shell-enhancements)'
    }
  ]
};

/**
 * Get all modifications for a specific module
 * @param {string} moduleName - Name of the module
 * @returns {Array} Array of modifications
 */
export function getModuleModifications(moduleName) {
  return SHELL_MODIFICATIONS[moduleName] || [];
}

/**
 * Get all modifications for a specific shell config file
 * @param {string} fileName - Name of the shell config file (.bashrc or .zshrc)
 * @returns {Array} Array of modifications that affect this file
 */
export function getFileModifications(fileName) {
  const modifications = [];
  
  for (const [module, mods] of Object.entries(SHELL_MODIFICATIONS)) {
    for (const mod of mods) {
      if (mod.files.includes(fileName)) {
        modifications.push({
          module,
          ...mod
        });
      }
    }
  }
  
  return modifications;
}

/**
 * Get the current version being used for modifications
 * @returns {string} Current version string
 */
export function getCurrentVersion() {
  return 'v1.12.2';
}

/**
 * Generate a regex pattern to find a specific SIGAO_MOD block
 * @param {string} name - The name of the modification
 * @returns {RegExp} Regex pattern to match the modification block
 */
export function getModificationPattern(name) {
  return new RegExp(
    `#<SIGAO_MOD\\s+name=['"]${name}['"]\\s+ver=['"][^'"]+['"](?:\\s+hash=['"][^'"]+['"])?>([\s\S]*?)#</SIGAO_MOD>`,
    'g'
  );
}

/**
 * Extract version from a SIGAO_MOD tag
 * @param {string} tag - The SIGAO_MOD opening tag
 * @returns {string|null} Version string or null if not found
 */
export function extractVersion(tag) {
  const match = tag.match(/ver=['"]([^'"]+)['"]/);
  return match ? match[1] : null;
}

/**
 * Extract hash from a SIGAO_MOD tag
 * @param {string} tag - The SIGAO_MOD opening tag
 * @returns {string|null} Hash string or null if not found
 */
export function extractHash(tag) {
  const match = tag.match(/hash=['"]([^'"]+)['"]/);
  return match ? match[1] : null;
}

/**
 * Calculate SHA256 hash of content
 * @param {string} content - Content to hash
 * @returns {string} First 16 characters of hex-encoded SHA256 hash
 */
export function calculateHash(content) {
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex').substring(0, 16);
}

/**
 * Read a specific SIGAO_MOD section from a file
 * @param {string} filePath - Path to the shell config file
 * @param {string} modName - Name of the modification to read
 * @returns {Promise<Object|null>} Object with content, version, hash, and drift status
 */
export async function readModification(filePath, modName) {
  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    const pattern = getModificationPattern(modName);
    const match = pattern.exec(fileContent);
    
    if (!match) {
      return null;
    }
    
    const fullMatch = match[0];
    const content = match[1];
    const tagMatch = fullMatch.match(/#<SIGAO_MOD[^>]+>/);
    const tag = tagMatch ? tagMatch[0] : '';
    
    const version = extractVersion(tag);
    const storedHash = extractHash(tag);
    const currentHash = calculateHash(content.trim());
    
    return {
      content: content.trim(),
      version,
      storedHash,
      currentHash,
      hasDrift: storedHash && storedHash !== currentHash,
      tag
    };
  } catch (error) {
    console.error(`Error reading modification ${modName} from ${filePath}:`, error);
    return null;
  }
}

/**
 * Update or insert a SIGAO_MOD section in a file
 * @param {string} filePath - Path to the shell config file
 * @param {string} modName - Name of the modification
 * @param {string} newContent - New content for the modification
 * @param {string} version - Version string (defaults to current version)
 * @param {Object} options - Additional options
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
export async function updateModification(filePath, modName, newContent, version = null, options = {}) {
  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    const pattern = getModificationPattern(modName);
    const contentHash = calculateHash(newContent.trim());
    const ver = version || getCurrentVersion();
    
    // Build the new SIGAO_MOD block
    const newBlock = `#<SIGAO_MOD name='${modName}' ver='${ver}' hash='${contentHash}'>\n${newContent}\n#</SIGAO_MOD>`;
    
    let updatedContent;
    if (pattern.test(fileContent)) {
      // Replace existing modification
      updatedContent = fileContent.replace(pattern, newBlock);
    } else {
      // Append new modification
      const position = options.position || 'end';
      if (position === 'start') {
        updatedContent = newBlock + '\n\n' + fileContent;
      } else {
        updatedContent = fileContent + '\n\n' + newBlock;
      }
    }
    
    await fs.writeFile(filePath, updatedContent, 'utf8');
    return true;
  } catch (error) {
    console.error(`Error updating modification ${modName} in ${filePath}:`, error);
    return false;
  }
}

/**
 * Remove a SIGAO_MOD section from a file
 * @param {string} filePath - Path to the shell config file
 * @param {string} modName - Name of the modification to remove
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
export async function removeModification(filePath, modName) {
  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    const pattern = getModificationPattern(modName);
    
    if (!pattern.test(fileContent)) {
      return false; // Modification not found
    }
    
    // Remove the modification and any surrounding empty lines
    const updatedContent = fileContent.replace(
      new RegExp(`\\n*${pattern.source}\\n*`, 'g'),
      '\n'
    );
    
    await fs.writeFile(filePath, updatedContent, 'utf8');
    return true;
  } catch (error) {
    console.error(`Error removing modification ${modName} from ${filePath}:`, error);
    return false;
  }
}

/**
 * Check all modifications in a file for drift
 * @param {string} filePath - Path to the shell config file
 * @returns {Promise<Array>} Array of modifications with drift status
 */
export async function checkFileDrift(filePath) {
  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    const allMods = [];
    
    // Find all SIGAO_MOD blocks
    const blockPattern = /#<SIGAO_MOD\s+name=['"]([^'"]+)['"][^>]*>([\s\S]*?)#<\/SIGAO_MOD>/g;
    let match;
    
    while ((match = blockPattern.exec(fileContent)) !== null) {
      const modName = match[1];
      const content = match[2];
      const tagMatch = match[0].match(/#<SIGAO_MOD[^>]+>/);
      const tag = tagMatch ? tagMatch[0] : '';
      
      const version = extractVersion(tag);
      const storedHash = extractHash(tag);
      const currentHash = calculateHash(content.trim());
      
      allMods.push({
        name: modName,
        version,
        storedHash,
        currentHash,
        hasDrift: storedHash && storedHash !== currentHash,
        content: content.trim()
      });
    }
    
    return allMods;
  } catch (error) {
    console.error(`Error checking drift in ${filePath}:`, error);
    return [];
  }
}

/**
 * Update all existing SIGAO_MOD tags to include hashes
 * @param {string} filePath - Path to the shell config file
 * @returns {Promise<number>} Number of modifications updated
 */
export async function addHashesToExistingMods(filePath) {
  try {
    let fileContent = await fs.readFile(filePath, 'utf8');
    let updateCount = 0;
    
    // Find all SIGAO_MOD blocks without hashes
    const blockPattern = /#<SIGAO_MOD\s+name=['"]([^'"]+)['"](?:\s+ver=['"]([^'"]+)['"])?(?!\s+hash=)[^>]*>([\s\S]*?)#<\/SIGAO_MOD>/g;
    
    const replacements = [];
    let match;
    
    while ((match = blockPattern.exec(fileContent)) !== null) {
      const fullMatch = match[0];
      const modName = match[1];
      const version = match[2] || getCurrentVersion();
      const content = match[3];
      const contentHash = calculateHash(content.trim());
      
      const newTag = `#<SIGAO_MOD name='${modName}' ver='${version}' hash='${contentHash}'>`;
      const newBlock = `${newTag}${content}#</SIGAO_MOD>`;
      
      replacements.push({ old: fullMatch, new: newBlock });
    }
    
    // Apply replacements
    for (const { old, new: newBlock } of replacements) {
      fileContent = fileContent.replace(old, newBlock);
      updateCount++;
    }
    
    if (updateCount > 0) {
      await fs.writeFile(filePath, fileContent, 'utf8');
    }
    
    return updateCount;
  } catch (error) {
    console.error(`Error adding hashes to ${filePath}:`, error);
    return 0;
  }
}