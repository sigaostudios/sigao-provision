#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Generates a static ANSI banner file using ink
 */
async function generateBanner() {
  const outputPath = path.join(__dirname, '..', 'logo.ans');
  const scriptPath = path.join(__dirname, 'generate-banner-script.mjs');
  
  try {
    // Run the script and capture output with forced color
    const { stdout } = await execAsync(`FORCE_COLOR=3 node ${scriptPath}`, {
      env: { ...process.env, FORCE_COLOR: '3' }
    });
    
    // Write the captured output to logo.ans
    await fs.writeFile(outputPath, stdout.trim());
    
    console.log(`Banner generated at: ${outputPath}`);
  } catch (error) {
    console.error('Error generating banner:', error);
  }
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateBanner().catch(console.error);
}

export { generateBanner };