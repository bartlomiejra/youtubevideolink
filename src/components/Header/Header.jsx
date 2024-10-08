// components/Header.js
import React from 'react';
import logo from '../../assets/logo.png'; // Upewnij się, że ścieżka do logo jest poprawna

const Header = ({ selectedPlatform, handlePlatformChange }) => {
  return (
    <header className="bg-neutral-900	sticky top-0 z-50 bg-brown-900 text-gray-200 w-full flex items-center justify-between p-4 shadow-lg">
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-8 w-auto " />
        <h1 className="text-m  font-bold">Bart audiobooki</h1>
      </div>
      {/* Przyciski do wyboru platformy */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => handlePlatformChange('youtube')}
          className={`mx-2 p-2 rounded transition duration-200 ${
            selectedPlatform === 'youtube'
              ? 'bg-red-600 text-white border border-red-600'
              : 'text-red-600 hover:text-red-800 hover:bg-red-200'
          }`}
        >
          YouTube
        </button>
        <button
          onClick={() => handlePlatformChange('rumble')}
          className={`mx-2 p-2 rounded transition duration-200 ${
            selectedPlatform === 'rumble'
              ? 'bg-green-600 text-white border border-green-600'
              : 'text-green-600 hover:text-green-800 hover:bg-green-200'
          }`}
        >
          Rumble
        </button>
        <button
          onClick={() => handlePlatformChange('playlist')}
          className={`mx-2 p-2 rounded transition duration-200 ${
            selectedPlatform === 'playlist'
              ? 'bg-blue-600 text-white border border-blue-600'
              : 'text-blue-600 hover:text-blue-800 hover:bg-blue-200'
          }`}
        >
          Playlisty
        </button>
      </div>
    </header>
  );
};

export default Header;
