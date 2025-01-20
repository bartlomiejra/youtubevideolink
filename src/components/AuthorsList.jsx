import React, { useEffect, useState } from 'react';
import authorsData from '../assets/data/authors.json'; // Poprawna ścieżka do pliku authors.json
import youtubeVideosData from '../assets/data/youtube_videos.json'; // Importuj dane z YouTube
import rumbleVideosData from '../assets/data/rumble_videos.json'; // Importuj dane z Rumble
import podcastsData from '../assets/data/podcasts.json'; // Importuj dane z podcastów

const AuthorsList = ({ selectedPlatform }) => { // Dodano prop dla wybranej platformy
  const [authors, setAuthors] = useState([]);
  const [videoCounts, setVideoCounts] = useState({}); // Stan do przechowywania liczby filmów dla autorów
  const [loading, setLoading] = useState(true); // Stan ładowania

  useEffect(() => {
    setAuthors(authorsData);
    calculateVideoCounts(); // Wywołaj funkcję obliczającą liczbę filmów
  }, [selectedPlatform]); // Zmiana na liście autorów przy zmianie platformy

  const calculateVideoCounts = () => {
    const counts = {};

    const countVideosForAuthor = (author) => {
      const lastName = author.split(' ').pop(); // Pobieranie tylko nazwiska
      const authorRegex = new RegExp(`\\b${lastName}\\b`, 'i'); // Szuka nazwiska autora w tytule

      // Funkcja pomocnicza do zliczania filmów w różnych źródłach
      const countInSource = (videos) => {
        videos.forEach(video => {
          if (authorRegex.test(video.title)) {
            counts[lastName] = (counts[lastName] || 0) + 1; // Zlicz filmy
            // {console.log(counts)}
          }
        });
      };

      // Zliczanie filmów z wszystkich źródeł
      countInSource(youtubeVideosData); // Zlicz filmy z YouTube
      countInSource(rumbleVideosData); // Zlicz filmy z Rumble
      countInSource(podcastsData); // Zlicz filmy z podcastów
    };

    authors.forEach(author => {
      countVideosForAuthor(author);
    });

    setVideoCounts(counts); // Ustaw liczby filmów w stanie
    setLoading(false); // Ustaw stan ładowania na false po zakończeniu
  };

  return (
    <div className="h-[7000px] overflow-y-auto bg-gray-900 p-4 rounded-lg shadow-lg">
  <h3 className="text-xl font-semibold mb-2 text-gray-200">Autorzy(🚧 W budowie)</h3>
      <div className="flex flex-col gap-2 scroll">
        {loading ? (
          <div className="text-center">Ładowanie autorów...</div>
        ) : (
          authors.map((author, index) => {
            const lastName = author.split(' ').pop(); // Pobieranie tylko nazwiska
            const count = videoCounts[lastName] || 0; // Liczba filmów dla autora

            return (
              <div 
                key={index} 
                className="flex items-center justify-between p-2 border-b border-gray-700 whitespace-nowrap" // Dodano `whitespace-nowrap` aby zapobiec zawijaniu tekstu
              >
                <span className="text-sm font-bold"> {/* Mniejszy tekst */}
                  {author} {/* Nazwa autora */}
                </span>
                <span className="text-gray-400 ml-2 text-sm">
                  {count > 0 ? `(${count})` : '0'} {/* Wyświetlanie liczby filmów lub komunikatu o braku */}
                </span> 
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AuthorsList;
