import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';

const DraggableModal = () => {
  const [selectedVideo, setSelectedVideo] = useState(null); // ID wybranego wideo
  const [isDragging, setIsDragging] = useState(false); // Flaga, czy modal jest przeciągany
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // Przesunięcie kursora
  const [modalPosition, setModalPosition] = useState({ top: 50, left: 50 }); // Pozycja modalu

  const videos = [
    { id: 'abcdefg', title: 'Film 1' },
   
  ];

  // Funkcja do ustawienia wybranego filmu
  const handlePlayVideo = (videoId) => {
    setSelectedVideo(videoId); // Ustawienie ID filmu
  };

  // Funkcja do zamknięcia odtwarzacza
  const handleClosePlayer = () => {
    setSelectedVideo(null); // Zamknięcie modalu
  };

  // Funkcja do rozpoczęcia przeciągania
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setOffset({ x: e.clientX - modalPosition.left, y: e.clientY - modalPosition.top });
  };

  // Funkcja do aktualizacji pozycji modalu podczas przeciągania
  const handleMouseMove = (e) => {
    if (isDragging) {
      setModalPosition({
        left: e.clientX - offset.x,
        top: e.clientY - offset.y,
      });
    }
  };

  // Funkcja do zakończenia przeciągania
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Dodajemy nasłuchiwanie na zdarzenia `mousemove` i `mouseup` poza komponentem
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div>
      {/* Wyświetlamy tylko listę przycisków do wyboru filmu */}
      <div>
        {videos.map((video) => (
          <button key={video.id} onClick={() => handlePlayVideo(video.id)}>
            {video.title}
          </button>
        ))}
      </div>

      {/* Modal z odtwarzaczem YouTube */}
      {selectedVideo && (
        <div
          className="modal"
          style={{
            top: `${modalPosition.top}px`,
            left: `${modalPosition.left}px`,
            cursor: 'move',
          }}
          onMouseDown={handleMouseDown}
        >
          <div className="modal-content">
            <span className="close" onClick={handleClosePlayer}>
              &times;
            </span>
            <YouTube videoId={selectedVideo} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DraggableModal;
