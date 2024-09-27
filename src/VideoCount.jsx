import React from 'react';

const VideoCount = ({ count, platform }) => {
  // Determine the display text based on the platform
  const displayText =
    platform === 'podcast'
      ? count === 1
        ? ' dostępny podcast'
        : ' dostępne podcasty'
      : platform === 'rumble'
      ? count === 1
        ? 'dostępny film na Rumble'
        : 'dostępne filmy na Rumble'
      : platform === 'youtube'
      ? count === 1
        ? 'dostępny film na YouTube'
        : 'dostępne filmy na YouTube'
      : platform === 'playlist'
      ? count === 1
        ? 'dostępną playlistę'
        : ' dostępne playlisty'
      : count === 1
      ? 'film'
      : 'filmy';

  return (
    <div className="p-6  text-center mb-4">
      <h1 className="text-4xl font-extrabold text-red-700 mb-2">Biblioteka Bart Audiobooki</h1>
      <h2 className="text-3xl font-bold text-white"> 
        {count} {displayText} 
      </h2>
      <p className="text-gray-400 text-sm">Przeglądaj audiobooki z kanałów Bart Audiobooki na YouTube oraz Rumble!</p>
    </div>
  );
};

export default VideoCount;
