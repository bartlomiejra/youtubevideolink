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
		  alignItems: 'center'
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
