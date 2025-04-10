import { BrowserRouter, Link, useLocation } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { AppRouter } from './router';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Switch, Box, Button, ButtonGroup, useMediaQuery } from '@mui/material';
import { Home as HomeIcon, CloudSun as ForecastIcon } from 'lucide-react';

function AppContent() {
  const location = useLocation();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // 🌙 Load theme mode from localStorage or system preference
  const [mode, setMode] = useState<'light' | 'dark'>(
    localStorage.getItem('themeMode') as 'light' | 'dark' || (prefersDarkMode ? 'dark' : 'light')
  );

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  transform: 'translateY(-1px)',
                },
              },
            },
          },
        },
      }),
    [mode]
  );

  const handleThemeToggle = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Navigation */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          gap: 2,
        }}
      >
        <ButtonGroup variant="outlined" color="primary">
          <Button
            component={Link}
            to="/"
            startIcon={<HomeIcon size={18} />}
            variant={location.pathname === '/' ? 'contained' : 'outlined'}
          >
            Home
          </Button>
          <Button
            component={Link}
            to="/forecast"
            startIcon={<ForecastIcon size={18} />}
            variant={location.pathname === '/forecast' ? 'contained' : 'outlined'}
          >
            Forecast
          </Button>
        </ButtonGroup>

        {/* Theme switch */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Switch checked={mode === 'dark'} onChange={handleThemeToggle} />
        </Box>
      </Box>

      <AppRouter />
    </ThemeProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
