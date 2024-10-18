export const fetchWeatherData = async (location) => {
  const apiKey = '2d5574132e0721b063565596af29fe9e';
  
  try {
      let url;

      // Check if location is an object with lat and lon
      if (typeof location === 'object' && location.lat && location.lon) {
          // Fetch weather data using latitude and longitude
          url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}`;
      } else {
          // Otherwise, assume it's a city name
          url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
      }

      const response = await fetch(url);
      
      // Check if the API response is OK
      if (!response.ok) {
          throw new Error(`City "${location}" not found`);
      }

      const data = await response.json();
    
      // Ensure the data has the expected structure
      if (!data.main || !data.weather || data.weather.length === 0) {
          throw new Error('Invalid data structure received from the API');
      }

      // Convert temperature from Kelvin to Celsius
      const temp = data.main.temp - 273.15;

      return {
          temp: temp.toFixed(2),
          weather: data.weather[0].main,
      };
    
  } catch (error) {
      console.error('Error fetching weather data:', error.message);
      
      // Return a fallback error response
      return {
          temp: 'N/A',
          weather: 'Unavailable',
      };
  }
};
