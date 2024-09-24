import React from 'react';

const VideoCount = ({ count }) => {
  return (
    <div className="p-6 rounded-lg shadow-lg text-center mb-4 bg-gray-900">
      <h1 className="text-4xl font-extrabold text-blue-300 mb-2">Biblioteka Bart - Audiobooki</h1>
      <h2 className="text-3xl font-bold text-white"> {/* Zmniejszony rozmiar h2 */}
        {count} {count === 1 ? 'film' : 'filmy'} dostępne
      </h2>
      <p className="text-gray-400 text-sm">Ciesz się swoimi ulubionymi audiobookami!</p>
    </div>
  );
};

export default VideoCount;

