# 🌤️ Weather Forecast App

A modern, responsive weather application built with React, TypeScript, Redux Toolkit, and Material UI that provides real-time weather updates and a 5-day forecast based on your location or city search.

![Weather App Banner](https://via.placeholder.com/1200x300)

## 🚀 Features

- **Current Weather Display**: Get real-time weather data based on your location
- **City Search**: Look up weather for any city worldwide
- **5-Day Forecast**: Plan ahead with detailed weather predictions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Theme Toggle**: Switch between Light 🌞 and Dark 🌙 modes with persistence
- **Dynamic Weather Icons**: Visual indicators change based on weather conditions
- **Clean Navigation**: Easy movement between Home and Forecast views
- **User-Friendly Experience**: Smooth loading indicators and intuitive interface

## 🧩 Tech Stack

- **React + TypeScript** - Core framework with type safety
- **Redux Toolkit** - State management
- **React Router** - Navigation system
- **Axios** - API request handling
- **Material UI (MUI)** - Component library and theming
- **Styled Components** - Enhanced styling capabilities
- **React Icons / Lucide React** - Icon library
- **OpenWeather API** - Weather data source

## 📁 Project Structure

```
src/
├── api/                # API configuration (Axios instances)
├── assets/             # Static assets (icons, images)
├── components/         # Reusable components
│   ├── Layout/         # Layout components
│   ├── WeatherCard/    # Weather display components
│   ├── SearchBar/      # Search functionality
│   └── UI/             # Generic UI components
├── hooks/              # Custom React hooks
├── pages/              # Page components
│   ├── Home/           # Main weather view
│   └── Forecast/       # 5-day forecast view
├── redux/              # Redux store configuration
│   ├── slices/         # Feature-specific reducers
│   └── store.ts        # Global store setup
├── router/             # Route definitions
├── theme/              # MUI theme configuration
├── utils/              # Helper functions
└── App.tsx             # Main application component
```

## 🌦️ API Reference

### OpenWeather API

- **Current Weather**:
  ```
  https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
  ```

- **Forecast**:
  ```
  https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
  ```

- **Geo Coding (City Search)**:
  ```
  https://api.openweathermap.org/geo/1.0/direct?q={city name}&limit=1&appid={API key}
  ```

> **Note:** You need to create a free account and get your API key from [OpenWeatherMap](https://openweathermap.org/api)

## 🛠️ Getting Started

### Prerequisites

- Node.js >= 16.x
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
    git clone ""
   cd weather-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Add your OpenWeather API key**:
   
   Create a `.env` file in the root directory:
   ```
   VITE_WEATHER_API_KEY=your_api_key_here
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open in browser**:
   The app should be running at [http://localhost:5173](http://localhost:5173)

## 🧪 Testing

Run the test suite with:
```bash
npm test
# or
yarn test
```

## 📦 Deployment

Build the production version:
```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## 📈 Future Enhancements

- ⏳ Add loading indicator on search button
- 📦 Persist selected city in localStorage
- 🔥 Smooth animations using Framer Motion
- 📨 Toast notifications for errors and success
- 📈 Temperature chart for forecast (using Recharts)
- 🌍 Multi-language support
- 🌟 PWA Support for offline use

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 💡 Credits

- Weather data powered by [OpenWeather API](https://openweathermap.org/)
- Icons from [Lucide React](https://lucide.dev/) and [React Icons](https://react-icons.github.io/react-icons/)
- Built with 💙 by Manish Chandra

Check file permissions and reinstall Dependencies such as node_modules and 
package-lock.json and then npm install to run this app in your system
