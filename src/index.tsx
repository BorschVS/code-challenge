import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from 'components';
import MixedThemeProvider from 'MixedThemeProvider';
import theme from 'theme';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <MixedThemeProvider theme={theme}>
      <App />
    </MixedThemeProvider>
  </React.StrictMode>
);
