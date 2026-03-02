import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AppProviders } from './app/providers/AppProviders';
import { AppRouter } from './app/router/AppRouter';

const theme = createTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </ThemeProvider>
  </React.StrictMode>,
);
