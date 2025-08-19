import React from 'react';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';
import { Box } from 'ink';

/**
 * Banner component that displays "Sigao AI" with gradient colors
 * @returns {JSX.Element} The banner component
 */
export function Banner() {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Gradient name="rainbow">
        <BigText text="Sigao AI" font="block" />
      </Gradient>
    </Box>
  );
}

export default Banner;