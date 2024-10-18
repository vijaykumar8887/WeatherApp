// src/components/Summary.js
import React from 'react';

const Summary = ({ weatherSummary, tempUnit }) => {
  // Convert temperature based on selected unit
  const convertTemp = (temp, unit) => {
    if (unit === 'C') {
      return temp; // Return temperature in Kelvin
    }
    return (temp - 273.15).toFixed(2); // Convert Kelvin to Celsius
  };

  return (
    <div className="mt-4 p-4 border rounded">
      <h2 className="text-lg font-bold">Weather Summary</h2>
      <p>Max Temperature: {convertTemp(weatherSummary.maxTemp, tempUnit)}°{tempUnit}</p>
      <p>Average Temperature: {convertTemp(weatherSummary.averageTemp, tempUnit)}°{tempUnit}</p>
      <p>Min Temperature: {convertTemp(weatherSummary.minTemp, tempUnit)}°{tempUnit}</p>
      <p>Dominant Weather: {weatherSummary.dominantWeather}</p>
      {weatherSummary.alerts && weatherSummary.alerts.length > 0 && (
        <div className="mt-2 text-red-600">
          <strong>Alerts:</strong> {weatherSummary.alerts.join(', ')}
        </div>
      )}
    </div>
  );
};

export default Summary;
