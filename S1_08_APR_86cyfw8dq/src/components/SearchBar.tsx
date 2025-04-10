import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { TextField, Button, Box, Typography } from '@mui/material';

interface SearchBarProps {
    onSearch: (lat: number, lon: number, cityName?: string, state?: string, country?: string) => void;
  }

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchError, setSearchError] = useState('');

  const formik = useFormik({
    initialValues: {
      city: '',
    },
    validationSchema: Yup.object({
      city: Yup.string().required('City is required'),
    }),
    onSubmit: async (values) => {
      setSearchError('');
      try {
        const apiKey = '150df017bf2d2d58fc16c5cd958a0711';
        const response = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {
          params: {
            q: values.city,
            limit: 1,
            appid: apiKey,
          },
        });

        if (response.data.length === 0) {
          setSearchError('City not found');
          return;
        }

        const { lat, lon, name, state, country } = response.data[0];
        onSearch(lat, lon, name, state, country);
        formik.resetForm();
      } catch (error) {
        setSearchError('Error fetching location');
      }
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ display: 'flex', gap: 2, mb: 3 }}>
      <TextField
        name="city"
        label="Enter city name"
        variant="outlined"
        size="small"
        onChange={formik.handleChange}
        value={formik.values.city}
        error={formik.touched.city && Boolean(formik.errors.city)}
        helperText={formik.touched.city && formik.errors.city}
      />
      <Button type="submit" variant="contained" size="medium">
        Search
      </Button>
      {searchError && (
        <Typography color="error" variant="body2">
          {searchError}
        </Typography>
      )}
    </Box>
  );
};

export default SearchBar;
