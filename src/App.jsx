import React, { useEffect, useState } from 'react';
import rumbleVideosData from './assets/data/rumble_videos.json';
import youtubeVideosData from './assets/data/youtube_videos.json';
import podcastsData from './assets/data/podcasts.json';
import rumbleLogo from './assets/rumble.png';
import podcastImage from './assets/podcast.png'; // Import the podcast image
import './index.css';
import Header from './Header';
import ContentCount from './ContentCount';

function App() {
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedVideoId, setSelectedVideoId] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('youtube'); // Domyślnie ustawione na YouTube
  const [loading, setLoading] = useState(true); // Ustawiono na true na początku

  useEffect(() => {
    // Łączymy dane z wszystkich plików
    const combinedVideos = [
      ...rumbleVideosData,
      ...youtubeVideosData,
      ...podcastsData,
    ];

    const shuffledVideos = combinedVideos.sort(() => Math.random() - 0.5);

    setVideos(combinedVideos);
    setLoading(false); // Ustaw loading na false po załadowaniu
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 2000); // 2-sekundowe opóźnienie

    return () => clearTimeout(timer); // Wyczyść timeout, gdy komponent zostanie odmontowany lub gdy searchTerm się zmienia
  }, [searchTerm]);

  const getVideoId = (link) => {
    try {
      const url = new URL(link);
      const isYouTube = url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be');
      const isRumble = url.hostname.includes('rumble.com');

      if (isYouTube) {
        const videoId = url.searchParams.get('v'); // Wyciąganie ID wideo
        return videoId ? videoId : link.split('list=')[1]; // Obsługuje playlisty
      } else if (isRumble) {
        const pathParts = url.pathname.split('/');
        return pathParts[2]; // ID wideo to trzecia część ścieżki
      }
      return null; // Gdy link nie jest z YouTube ani Rumble
    } catch (error) {
      console.error(`Invalid URL: ${link}`, error);
      return null; // Zwracamy null, jeśli link jest nieprawidłowy
    }
  };

  // Filtrowanie filmów na podstawie wyszukiwania i wybranej platformy
  const filteredVideos = videos.filter(video => {
    const matchesSearchTerm = video.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    const matchesPlatform = selectedPlatform === 'all' || video.platform === selectedPlatform;
    return matchesSearchTerm && matchesPlatform;
  });

  const handlePlatformChange = (platform) => {
    setLoading(true); // Ustaw loading na true przy zmianie platformy
    setSelectedPlatform(platform);
    setTimeout(() => setLoading(false), 1000); // Dodaj krótki czas ładowania przy zmianie platformy
  };

  return (
    <div className="min-h-screen bg-gray-180000 p-4 text-gray-200 flex flex-col items-center justify-center">
      {/* Komponent Header */}
      <Header />

      {/* Przyciski do wyboru platformy */}
      <div className="mb-4 flex justify-center">
        <button
          onClick={() => handlePlatformChange('youtube')}
          className={`mx-2 p-2 rounded ${selectedPlatform === 'youtube' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'}`}
        >
          YouTube
        </button>
        <button
          onClick={() => handlePlatformChange('rumble')}
          className={`mx-2 p-2 rounded ${selectedPlatform === 'rumble' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}
        >
          Rumble
        </button>
        <button
          onClick={() => handlePlatformChange('podcast')}
          className={`mx-2 p-2 rounded ${selectedPlatform === 'podcast' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
        >
          Podcast
        </button>
      </div>

      {/* Pole wyszukiwania */}
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Szukaj audiobooków..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          className="w-full md:w-2/2 lg:w-4/4 p-3 border border-gray-700 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
        />
      </div>

      {/* Komunikat ładowania */}
      {loading && (
        <div className="col-span-full text-center py-6">
          <p className="text-lg text-gray-400">Ładowanie...</p>
        </div>
      )}

      {/* Komponent ContentCount wyświetlany po załadowaniu */}
      {!loading && (
        <>
          <ContentCount count={filteredVideos.length} platform={selectedPlatform} />
          {/* Siatka filmów */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 flex-grow no-underline"> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 flex-grow no-underline mt-4">

            {filteredVideos.length > 0 ? (
              filteredVideos.map((video, index) => {
                const videoId = getVideoId(video.link);
                const isYouTube = video.platform === 'youtube';
                const isRumble = video.platform === 'rumble';
                const isPodcast = video.platform === 'podcast';
                const thumbnailUrl = isYouTube 
                  ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` 
                  : isRumble 
                    ? rumbleLogo // Użyj lokalnego logo Rumble
                    : podcastImage; // Użyj lokalnego podcastu

                return (
                  <div key={index} className="shadow-lg rounded-lg overflow-hidden no-underline text-green-500">
                    <>
                      <a href={video.link} target="_blank" rel="noopener noreferrer">
                        <img 
                          src={thumbnailUrl} 
                          alt={video.title} 
                          className="w-full h-48 object-cover cursor-pointer" 
                        />
                      </a>
                      <div className="p-4">
                        <h2 className="text-xl font-semibold mb-2 text-gray-200 no-underline"> {/* Zmieniono kolor na jasny */}
                          <a className="text-gray-200" href={video.link} target="_blank" rel="noopener noreferrer">
                            {video.title}
                          </a>
                        </h2>
                      </div>
                    </>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-6">
                <p className="text-lg text-gray-500">Brak wyników do wyświetlenia.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Placeholder do siatki filmów w przypadku ładowania */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8 flex-grow no-underline">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-gray-700 h-48 rounded-lg animate-pulse"></div> // Placeholder
          ))}
        </div>
      )}

      {/* Odtwarzacz na dole ekranu */}
      {selectedVideoId && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4">
          <div className="flex justify-center">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${selectedVideoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
