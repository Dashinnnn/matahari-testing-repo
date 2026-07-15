import React from 'react';
import { renderToString } from 'react-dom/server';
import { Dialog } from 'radix-ui';

const App = () => (
  <Dialog.Root open={true}>
    <Dialog.Content>
      Hello
    </Dialog.Content>
  </Dialog.Root>
);

console.log(renderToString(<App />));
