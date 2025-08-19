/**
 * Utility functions for SIGAO_MOD tag generation and management
 */

import crypto from 'crypto';

/**
 * Calculate SHA256 hash of content
 * @param {string} content - Content to hash
 * @returns {string} First 16 characters of hex-encoded SHA256 hash
 */
export function calculateContentHash(content) {
  // Use first 16 chars of hash for brevity
  return crypto.createHash('sha256').update(content.trim(), 'utf8').digest('hex').substring(0, 16);
}

/**
 * Generate opening SIGAO_MOD tag with hash
 * @param {string} name - Modification name
 * @param {string} version - Version string
 * @param {string} content - Content to be wrapped (for hash calculation)
 * @returns {string} Opening tag with hash
 */
export function generateOpenTag(name, version, content) {
  const hash = calculateContentHash(content);
  return `#<SIGAO_MOD name='${name}' ver='${version}' hash='${hash}'>`;
}

/**
 * Generate closing SIGAO_MOD tag
 * @returns {string} Closing tag
 */
export function generateCloseTag() {
  return '#</SIGAO_MOD>';
}

/**
 * Wrap content with SIGAO_MOD tags including hash
 * @param {string} name - Modification name
 * @param {string} version - Version string
 * @param {string} content - Content to wrap
 * @returns {string} Content wrapped with SIGAO_MOD tags
 */
export function wrapContent(name, version, content) {
  const trimmedContent = content.trim();
  const openTag = generateOpenTag(name, version, trimmedContent);
  const closeTag = generateCloseTag();
  return `${openTag}\n${trimmedContent}\n${closeTag}`;
}

/**
 * Generate a complete shell config snippet with SIGAO_MOD tags
 * @param {string} name - Modification name
 * @param {string} version - Version string
 * @param {Array<string>} lines - Array of lines to include
 * @returns {string} Complete snippet with tags and proper formatting
 */
export function generateShellSnippet(name, version, lines) {
  const content = lines.join('\n');
  return wrapContent(name, version, content);
}

/**
 * Update content within existing SIGAO_MOD tags to add hash if missing
 * @param {string} existingBlock - Existing SIGAO_MOD block
 * @returns {string} Updated block with hash
 */
export function updateBlockWithHash(existingBlock) {
  const blockMatch = existingBlock.match(/#<SIGAO_MOD\s+name=['"]([^'"]+)['"](?:\s+ver=['"]([^'"]+)['"])?(?:\s+hash=['"]([^'"]+)['"])?>([\s\S]*?)#<\/SIGAO_MOD>/);
  
  if (!blockMatch) {
    return existingBlock; // Invalid block format
  }
  
  const [, name, version = 'v1.12.2', existingHash, content] = blockMatch;
  const trimmedContent = content.trim();
  const newHash = calculateContentHash(trimmedContent);
  
  // If hash already exists and matches, return as-is
  if (existingHash === newHash) {
    return existingBlock;
  }
  
  // Generate new block with updated hash
  return wrapContent(name, version, trimmedContent);
}