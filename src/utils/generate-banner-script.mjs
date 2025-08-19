import React from 'react';
import { render } from 'ink';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';

const app = render(
  React.createElement(Gradient, { name: 'rainbow' },
    React.createElement(BigText, { text: 'Sigao AI', font: 'block' })
  )
);

setTimeout(() => {
  app.unmount();
  process.exit(0);
}, 100);