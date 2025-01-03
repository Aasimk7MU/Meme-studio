import React, { useState, useEffect } from 'react';
import MemeGenerator from './Components/MemeGenerator';

function App() {
  const [themeColor, setThemeColor] = useState('#FFFFFF'); // Default color
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Dynamically set background color using inline styles
  const appStyle = {
    backgroundColor: isDarkMode ? '#121212' : themeColor, // Override theme color in dark mode
    color: isDarkMode ? '#FFFFFF' : themeColor === '#FFFFFF' ? '#000000' : 'black', // Adjust text color
  };



  return (
    <>
      <div className="App" style={appStyle}>

        {/* Theme Color Picker */}
        <label className="flex justify-end items-center text-lg m-4">
          <span className="mr-2">Theme Color:</span>
          <input
            className="p-1 rounded-md border border-gray-500"
            type="color"
            value={themeColor}
            onChange={(e) => setThemeColor(e.target.value)}
            disabled={isDarkMode} // Disable color picker when dark mode is active
          />
        </label>

        <MemeGenerator themeColor={appStyle.themeColor} />
      </div>
    </>
  );
};

export default App;
