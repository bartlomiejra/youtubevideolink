// ContentCount.js
import React from 'react';

const ContentCount = ({ count, platform }) => {
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
    <h2 className="text-1xl sm:text-2xl font-bold text-white">
      {count} {displayText}
    </h2>

  );
};

export default ContentCount;
