import React, { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCities from "./components/WeatherCities";
import Summary from "./components/Summary";
import VisualAnalysis from "./components/VisualAnalysis";
import { fetchWeatherData } from "./utils/weatherAPI";
import { alertConfig } from "./utils/alertConfig";

function App() {
  const [cities, setCities] = useState([
    "Delhi",
    "Mumbai",
    "Chennai",
    "Bangalore",
    "Kolkata",
  ]);
  const [weatherData, setWeatherData] = useState({});
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState({});
  const [isNightMode, setIsNightMode] = useState(false);
  const [temperatureAlerts, setTemperatureAlerts] = useState([]);
  const [currentLocationWeather, setCurrentLocationWeather] = useState(null);
  const [currentDate, setCurrentDate] = useState("");
  const [tempUnit, setTempUnit] = useState("C"); // Default to Celsius

  // Function to convert temperature from Kelvin to Celsius or keep it in Kelvin
  const convertTemperature = (tempInKelvin, unit) => {
    if (typeof tempInKelvin !== "number" || isNaN(tempInKelvin)) {
      return "N/A"; // Return a default message if the temperature is invalid
    }
    return unit === "K"
      ? (tempInKelvin - 273.15).toFixed(2)
      : tempInKelvin.toFixed(2);
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const results = await Promise.all(
          cities.map((city) => fetchWeatherData(city))
        );
        const data = results.reduce((acc, weather, index) => {
          acc[cities[index]] = weather;
          return acc;
        }, {});

        setWeatherData(data);
        calculateSummary(data);
        checkForAlerts(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    const intervalId = setInterval(fetchWeather, 300000); // 5 minutes
    fetchWeather();
    return () => clearInterval(intervalId);
  }, [cities]);

  const fetchCurrentLocationWeather = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const weather = await fetchWeatherData({
            lat: latitude,
            lon: longitude,
          });
          setCurrentLocationWeather(weather);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Unable to retrieve your location. Please check your location settings."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    const date = new Date().toLocaleDateString();
    setCurrentDate(date);
  }, []);

  const calculateSummary = (data) => {
    const temps = Object.values(data)
      .map((cityData) => parseFloat(cityData.temp))
      .filter((temp) => !isNaN(temp));

    if (temps.length > 0) {
      const summaryData = {
        maxTemp: Math.max(...temps), // Keep in Kelvin for internal use
        averageTemp: (
          temps.reduce((sum, temp) => sum + temp, 0) / temps.length
        ).toFixed(2), // Keep in Kelvin for internal use
        minTemp: Math.min(...temps), // Keep in Kelvin for internal use
        dominantWeather: findDominantWeather(Object.values(data)),
      };
      setSummary(summaryData);
    } else {
      setSummary({});
    }
  };

  const findDominantWeather = (cityWeatherData) => {
    const weatherCounts = cityWeatherData.reduce((counts, data) => {
      counts[data.weather] = (counts[data.weather] || 0) + 1;
      return counts;
    }, {});
    return Object.keys(weatherCounts).reduce((a, b) =>
      weatherCounts[a] > weatherCounts[b] ? a : b
    );
  };

  const checkForAlerts = (data) => {
    const alerts = [];
    const tempThreshold = alertConfig.temperature.threshold;

    Object.keys(data).forEach((city) => {
      const cityData = data[city];
      const temp = parseFloat(cityData.temp);

      if (temp > tempThreshold) {
        alerts.push(
          `${city} has exceeded the temperature threshold of ${tempThreshold}°C.`
        );
      }
    });

    if (alerts.length > 0) {
      setTemperatureAlerts((prevAlerts) => {
        const uniqueAlerts = [...new Set([...prevAlerts, ...alerts])];
        return uniqueAlerts;
      });
    }
  };

  const handleSearch = async (city) => {
    if (city && !cities.includes(city)) {
      setCities((prevCities) => [...prevCities, city]);
      setHistory((prevHistory) => [...prevHistory, city]);

      const newWeatherData = await fetchWeatherData(city);
      setWeatherData((prevData) => ({
        ...prevData,
        [city]: newWeatherData,
      }));

      calculateSummary({ ...weatherData, [city]: newWeatherData });
    }
  };

  const handleDelete = (city) => {
    if (window.confirm(`Are you sure you want to delete ${city}?`)) {
      setHistory(history.filter((item) => item !== city));
      setCities(cities.filter((item) => item !== city));
      setWeatherData((prevData) => {
        const { [city]: _, ...rest } = prevData;
        return rest;
      });
      setTemperatureAlerts((prevAlerts) =>
        prevAlerts.filter((alert) => !alert.includes(city))
      );
    }
  };

  const toggleNightMode = () => {
    setIsNightMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    fetchCurrentLocationWeather();
  }, []);

  return (
    <div
      className={`container mx-auto p-4 ${
        isNightMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}>
      <div className="flex justify-between items-center ml-[125px] mb-4">
        <h1 className="text-3xl font-bold  text-center w-full">Weather App</h1>
        <button
          onClick={toggleNightMode}
          className={`p-2 rounded focus:outline-none ${
            isNightMode ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
          }`}
        >
          {isNightMode ? "🌞 Light Mode" : "🌙 Night Mode"}
        </button>
      </div>
      <div className="mb-4">
        <p className="text-center">Current Date: {currentDate}</p>
      </div>

      {/* Temperature unit selection */}
      <div className="mb-4">
        <label className="mr-2">Temperature Unit:</label>
        <select
          value={tempUnit}
          onChange={(e) => {
            setTempUnit(e.target.value);
            // Update summary when temperature unit changes
            calculateSummary(weatherData);
          }}
          className={`p-2 border rounded ${
            isNightMode ? "bg-gray-700 text-white" : "bg-white text-black"
          }`}
        >
          <option value="C">Celsius (°C)</option>
          <option value="K">Kelvin (K)</option>
        </select>
      </div>

      <SearchBar
        onSearch={handleSearch}
        history={history}
        onDelete={handleDelete}
        isNightMode={isNightMode}
      />
      <WeatherCities
        cities={cities}
        weatherData={weatherData}
        tempUnit={tempUnit}
      />

      {currentLocationWeather && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-lg font-bold">
            Current Location: {currentLocationWeather.name}
          </h2>
          <p>
            Temperature:{" "}
            {currentLocationWeather &&
              convertTemperature(
                parseFloat(currentLocationWeather.temp),
                tempUnit
              )}
            °{tempUnit}
          </p>
          <p>Weather: {currentLocationWeather.weather}</p>
        </div>
      )}

      <Summary
        weatherSummary={{ ...summary, alerts: temperatureAlerts }}
        tempUnit={tempUnit}
      />
      <VisualAnalysis data={weatherData} tempUnit={tempUnit} />
      {temperatureAlerts.length > 0 && (
        <div className="mt-4 p-4 bg-red-500 text-white rounded">
          <h2 className="font-bold">Alerts:</h2>
          <ul>
            {temperatureAlerts.map((alert, index) => (
              <li key={index}>{alert}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
