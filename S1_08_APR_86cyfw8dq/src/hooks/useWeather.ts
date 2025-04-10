import { useDispatch, useSelector } from 'react-redux';
import { fetchWeatherData, fetchForecastData, setSelectedCity } from '../redux/weatherSlice';
import { RootState, AppDispatch } from '../redux/store';

export const useWeather = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { data, forecast, loading, error, selectedCity } = useSelector(
      (state: RootState) => state.weather
    );
  
    const getWeatherData = (
      lat: number,
      lon: number,
      cityName?: string,
      state?: string,
      country?: string
    ) => {
      if (
        cityName &&
        (!selectedCity ||
          selectedCity.name !== cityName ||
          selectedCity.lat !== lat ||
          selectedCity.lon !== lon)
      ) {
        dispatch(setSelectedCity({ name: cityName, state, country, lat, lon }));
      }
  
      dispatch(fetchWeatherData({ lat, lon }));
      dispatch(fetchForecastData({ lat, lon }));
    };
  
    return {
      data,
      forecast,
      loading,
      error,
      selectedCity,
      getWeatherData,
    };
  };
  