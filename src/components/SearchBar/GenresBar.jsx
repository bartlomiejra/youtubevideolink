import React, { useState, useEffect } from 'react';
import genresData from '../../assets/data/genres.json';

const MarqueeGenres = () => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setOffset((prevOffset) => (prevOffset + 1) % window.innerWidth);
    }, 30); // Adjust the speed by changing the interval

    return () => clearInterval(intervalId);
  }, []);

  return (
	  <div
  style={{
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    maxWidth: '100%', // Set max width to 100% to prevent horizontal scroll
  }}
>
  <h1>elo</h1>
  <div
    style={{
      transform: `translateX(-${offset}px)`,
      display: 'inline-block',
    }}
  >
    {genresData.map((genre, index) => (
      <span key={index} style={{ paddingRight: '1rem' }}>
        {genre}
      </span>
    ))}
  </div>
</div>
  );
};

export default MarqueeGenres;
/*************  ✨ Windsurf Command ⭐  *************/


  /*******  2177c7e5-f40b-4da2-ae65-3b1d0cbbb6e0  *******/