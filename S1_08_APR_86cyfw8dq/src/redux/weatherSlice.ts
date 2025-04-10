import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { weatherApi } from '../api/weatherApi';

interface WeatherState {
    data: any;
    forecast: any;
    loading: boolean;
    error: string | null;
    selectedCity: {
      name: string;
      state?: string;
      country?: string;
      lat: number;
      lon: number;
    } | null;
  }

const initialState: WeatherState = {
  data: null,
  forecast: null,
  loading: false,
  error: null,
  selectedCity: null,
};

// 🌤️ Fetch current weather data
export const fetchWeatherData = createAsyncThunk(
  'weather/fetchWeatherData',
  async ({ lat, lon }: { lat: number; lon: number }, { rejectWithValue }) => {
    try {
      const response = await weatherApi.get('/weather', {
        params: { lat, lon },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching weather data');
    }
  }
);

// 🌦️ Fetch forecast data
export const fetchForecastData = createAsyncThunk(
  'weather/fetchForecastData',
  async ({ lat, lon }: { lat: number; lon: number }, { rejectWithValue }) => {
    try {
      const response = await weatherApi.get('/forecast', {
        params: { lat, lon },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching forecast data');
    }
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    // ✅ Add reducer to set selected city globally
    setSelectedCity: (
        state,
        action: PayloadAction<{ name: string; state?: string; country?: string; lat: number; lon: number }>
      ) => {
        state.selectedCity = action.payload;
      },
  },
  extraReducers: (builder) => {
    builder
      // 🌤️ Current Weather
      .addCase(fetchWeatherData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🌦️ Forecast
      .addCase(fetchForecastData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchForecastData.fulfilled, (state, action) => {
        state.loading = false;
        state.forecast = action.payload;
      })
      .addCase(fetchForecastData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// ✅ Export the new action!
export const { setSelectedCity } = weatherSlice.actions;

export default weatherSlice.reducer;
