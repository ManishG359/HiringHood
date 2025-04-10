import { useEffect } from 'react';
import { useWeather } from '../hooks/useWeather';
import { Typography, CircularProgress, Card, CardContent, Box, Stack } from '@mui/material';
import { WiHumidity, WiStrongWind } from 'react-icons/wi';
import { FaTemperatureHigh } from 'react-icons/fa';

const Forecast = () => {
  const { forecast, loading, error, selectedCity, getWeatherData } = useWeather();

  useEffect(() => {
    if (!selectedCity) {
      getWeatherData(51.5074, -0.1278, 'London');
    } else {
      getWeatherData(selectedCity.lat, selectedCity.lon, selectedCity.name);
    }
  }, [selectedCity]);

  const groupForecastByDate = (list: any[]) => {
    const grouped: { [date: string]: any[] } = {};
    list.forEach((item) => {
      const date = item.dt_txt.split(' ')[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(item);
    });
    return grouped;
  };

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;
  if (error) return <Typography color="error" align="center">{error}</Typography>;

  const groupedForecast = forecast ? groupForecastByDate(forecast.list) : {};

  return (
    <Box sx={{ mt: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom align="center">
        5-Day Forecast for{' '}
        {selectedCity
          ? `${selectedCity.name}${selectedCity.state ? ', ' + selectedCity.state : ''}${
              selectedCity.country ? ', ' + selectedCity.country : ''
            }`
          : 'Your City'}
      </Typography>

      {Object.keys(groupedForecast).map((date) => {
        const dayData = groupedForecast[date];
        const middayForecast =
          dayData.find((item) => item.dt_txt.includes('12:00:00')) || dayData[0];

        const temps = dayData.map((item) => item.main.temp);
        const minTemp = Math.min(...temps);
        const maxTemp = Math.max(...temps);

        return (
          <Card key={date} sx={{ mb: 2, borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom align="center">
                {new Date(date).toDateString()}
              </Typography>

              <Stack spacing={2} mt={2}>
                {/* Temperature */}
                <Stack direction="row" alignItems="center" spacing={1}>
                  <FaTemperatureHigh size={24} />
                  <Typography>
                    Temperature: {middayForecast.main.temp} °C (Min: {minTemp}°C / Max: {maxTemp}°C)
                  </Typography>
                </Stack>

                {/* Humidity */}
                <Stack direction="row" alignItems="center" spacing={1}>
                  <WiHumidity size={28} />
                  <Typography>Humidity: {middayForecast.main.humidity}%</Typography>
                </Stack>

                {/* Wind */}
                <Stack direction="row" alignItems="center" spacing={1}>
                  <WiStrongWind size={28} />
                  <Typography>Wind Speed: {middayForecast.wind.speed} m/s</Typography>
                </Stack>

                {/* Weather Icon */}
                <Stack direction="row" alignItems="center" spacing={1}>
                  <img
                    src={`https://openweathermap.org/img/wn/${middayForecast.weather[0].icon}@2x.png`}
                    alt={middayForecast.weather[0].description}
                    style={{ width: 40, height: 40 }}
                  />
                  <Typography>{middayForecast.weather[0].description}</Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};

export default Forecast;
