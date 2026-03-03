import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider, alpha, createTheme } from '@mui/material';
import { AppProviders } from './app/providers/AppProviders';
import { AppRouter } from './app/router/AppRouter';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0E2442' },
    secondary: { main: '#00A8A8' },
    background: { default: '#F1F5FB' },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0px 10px 30px rgba(14, 36, 66, 0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          backgroundColor: alpha('#0E2442', 0.08),
        },
      },
    },
  },
});

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
