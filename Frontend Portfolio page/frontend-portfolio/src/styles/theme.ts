// src/styles/theme.ts
import type { ThemeOptions } from '@mui/material/styles';

export const lightTheme: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: { main: '#1565c0' }, // A deeper blue for better contrast
    secondary: { main: '#ff9800' }, // Orange for accents
    background: { default: '#f9fafc', paper: '#ffffff' }, // Softer white tones
    text: { primary: '#212121', secondary: '#757575' } // Darker text for readability
  }
};

export const darkTheme: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: { main: '#64b5f6' }, // Softer blue for dark mode
    secondary: { main: '#ffb74d' }, // Warm orange for accents
    background: { default: '#121212', paper: '#1e1e1e' }, // Slightly lighter dark tones
    text: { primary: '#e0e0e0', secondary: '#bdbdbd' } // Softer text for dark mode
  }
};
