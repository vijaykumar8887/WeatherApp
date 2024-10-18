# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

src/
|-- components/
|   |-- Search.jsx      // Search city and add to watch list  
|   |-- Weather.jsx     // Fetch and display weather for selected cities  
|   |-- Summary.jsx     // Daily summary (Avg/Max/Min temp + dominant weather)
|   |-- Alert.jsx       // Check threshold breaches and display alerts
|   |-- Chart.jsx       // Visual section for trends (using Chart.js)
|-- hooks/
|   |-- useWeatherData.js  // Custom hook for fetching weather data periodically  
|-- utils/
|   |-- storage.js        // Manage persistent storage (local storage for now)  
|-- App.jsx
|-- index.css
# WeatherApp
