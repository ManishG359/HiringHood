import { useEffect } from 'react';
import { useWeather } from '../hooks/useWeather';
import SearchBar from '../components/SearchBar';
import { Card, CardContent, Typography, CircularProgress, Box, Stack } from '@mui/material';
import { WiHumidity, WiStrongWind, WiSunrise, WiSunset } from 'react-icons/wi';
import { FaTemperatureHigh } from 'react-icons/fa';

const Home = () => {
  const { data, loading, error, selectedCity, getWeatherData } = useWeather();

  useEffect(() => {
    if (!selectedCity) {
      getWeatherData(51.5074, -0.1278, 'London');
    } else {
      getWeatherData(selectedCity.lat, selectedCity.lon, selectedCity.name);
    }
  }, [selectedCity]);

  return (
    <Box sx={{ maxWidth: 450, mx: 'auto', mt: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom align="center">
        Current Weather
      </Typography>

      <SearchBar onSearch={getWeatherData} />

      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />}
      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}

      {data && (
        <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom align="center">
              {selectedCity
                ? `${selectedCity.name}${selectedCity.state ? ', ' + selectedCity.state : ''}${
                    selectedCity.country ? ', ' + selectedCity.country : ''
                  }`
                : 'Your City'}
            </Typography>

            <Stack spacing={2} mt={2}>
              {/* Temperature */}
              <Stack direction="row" alignItems="center" spacing={1}>
                <FaTemperatureHigh size={24} />
                <Typography>Temperature: {data.main.temp} °C</Typography>
              </Stack>

              {/* Humidity */}
              <Stack direction="row" alignItems="center" spacing={1}>
                <WiHumidity size={28} />
                <Typography>Humidity: {data.main.humidity}%</Typography>
              </Stack>

              {/* Wind Speed */}
              <Stack direction="row" alignItems="center" spacing={1}>
                <WiStrongWind size={28} />
                <Typography>Wind Speed: {data.wind.speed} m/s</Typography>
              </Stack>

              {/* Weather Icon */}
              <Stack direction="row" alignItems="center" spacing={1}>
                <img
                  src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                  alt={data.weather[0].description}
                  style={{ width: 40, height: 40 }}
                />
                <Typography>{data.weather[0].description}</Typography>
              </Stack>

              {/* Sunrise */}
              <Stack direction="row" alignItems="center" spacing={1}>
                <WiSunrise size={28} />
                <Typography>
                  Sunrise: {new Date(data.sys.sunrise * 1000).toLocaleTimeString()}
                </Typography>
              </Stack>

              {/* Sunset */}
              <Stack direction="row" alignItems="center" spacing={1}>
                <WiSunset size={28} />
                <Typography>
                  Sunset: {new Date(data.sys.sunset * 1000).toLocaleTimeString()}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Home;
