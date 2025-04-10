import axios from 'axios';

const API_KEY = '150df017bf2d2d58fc16c5cd958a0711';

export const weatherApi = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  params: {
    appid: API_KEY,
    units: 'metric',
  },
});
