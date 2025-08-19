import React from 'react';
import { render } from 'ink';
import { Banner } from '../components/Banner.js';

/**
 * Displays the banner using ink and returns a promise when done
 * @returns {Promise<void>}
 */
export async function displayBanner() {
  return new Promise((resolve) => {
    const { unmount } = render(<Banner />);
    
    // Give it a moment to render
    setTimeout(() => {
      unmount();
      resolve();
    }, 100);
  });
}

export default displayBanner;