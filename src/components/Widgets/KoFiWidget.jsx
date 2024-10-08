import React from 'react';
import kofiLogo from '../../assets/data/kofi.svg'; // Upewnij się, że ścieżka jest poprawna
import './KoFiWidget.css';

const KoFiWidget = () => {
  return (
    <a 
      href="https://ko-fi.com/bartaudio" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="fixed bottom-4 right-4 flex justify-center items-center p-2 z-50" // Sticky positioning
    >
      <img 
          src={kofiLogo} 
          alt="Ko-fi" 
          className="w-full h-auto max-w-[150px]" // Responsive image
      />
    </a>
  );
}

export default KoFiWidget;
