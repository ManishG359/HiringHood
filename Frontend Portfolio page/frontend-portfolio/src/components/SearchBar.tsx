
import { TextField, Box } from '@mui/material';
import type { ChangeEvent } from 'react';
import {useTheme}  from '@mui/material/styles';

type SearchBarProps = {
  query: string;
 
  onChange: (value: string) => void;
};

const SearchBar = ({ query, onChange }: SearchBarProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <Box sx={{ my: 2, display: 'flex', justifyContent: 'center' }}>
      <TextField
        fullWidth
        label="🔍 Search projects..."
        value={query}
        onChange={handleChange}
        variant="outlined"
        InputLabelProps={{
          sx: {
            color: isDark ? '#64b5f6' : '#64b5f6',
            '&.Mui-focused': {
              color: useTheme().palette.primary.main,
            },
          },
        }}
        sx={{
          mt: 2,
          maxWidth: 800,
          borderRadius: 2,
          boxShadow: isDark
            ? '0 2px 6px rgba(255, 255, 255, 0.1)'
            : '0 2px 6px rgba(0, 0, 0, 0.1)',
          backgroundColor: theme.palette.background.paper,
          '& .MuiOutlinedInput-root': {
            color: theme.palette.text.primary,
            '& fieldset': {
              borderColor: isDark ? '#aaa' : '#000',
              borderWidth: 2,
            },
            '&:hover fieldset': {
              borderColor: theme.palette.primary.main,
            },
            '&.Mui-focused fieldset': {
              borderColor: theme.palette.primary.main,
            },
          },
        }}
      />
    </Box>
  );
};

export default SearchBar;
