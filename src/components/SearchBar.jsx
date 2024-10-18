import React, { useState } from 'react';

const SearchBar = ({ onSearch, history, onDelete, isNightMode }) => {
  const [city, setCity] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (city) {
      onSearch(city);
      setCity('');
    }
  };

  return (
    <div className={`mb-4 p-4 rounded shadow ${isNightMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <form onSubmit={handleSearch} className="flex items-center">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search for a city..."
          className={`flex-grow p-2 rounded ${isNightMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
        />
        <button type="submit" className="ml-2 p-2 rounded bg-blue-500 text-white">Search</button>
      </form>
      <div className="mt-2">
        {history.map((item, index) => (
          <div key={index} className={`flex justify-between items-center ${isNightMode ? 'text-white' : 'text-black'}`}>
            <span>{item}</span>
            <button onClick={() => onDelete(item)} className="ml-2 text-red-500">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
