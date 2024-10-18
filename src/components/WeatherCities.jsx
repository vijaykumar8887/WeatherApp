import React from 'react';

const WeatherCities = ({ cities, weatherData }) => (
  <div className="grid grid-cols-3 gap-4 mt-8">
    {cities.map((city, idx) => (
      <div key={idx} className="border p-4 text-center">
        <h3>{city}</h3>
        <p>Temp: {weatherData[city]?.temp ?? 'Loading...'} °C</p>
        <p>Condition: {weatherData[city]?.weather ?? 'Loading...'}</p>
      </div>
    ))}
  </div>
);

export default WeatherCities;
