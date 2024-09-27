import React, { useEffect, useState } from 'react';
import rumbleVideosData from './assets/data/rumble_videos.json';
import youtubeVideosData from './assets/data/youtube_videos.json';
import podcastsData from './assets/data/podcasts.json';
import VideoCount from './VideoCount';
import rumbleLogo from './assets/rumble.png'; 
import './index.css';

function App() {
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideoId, setSelectedVideoId] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('youtube'); // Domyślnie ustawione na YouTube
  const [loading, setLoading] = useState(true); // Stan ładowania

  useEffect(() => {
    // Łączymy dane z wszystkich plików
    const combinedVideos = [
      ...rumbleVideosData,
      ...youtubeVideosData,
      ...podcastsData,
    ];
    setVideos(combinedVideos);
    setLoading(false); // Zakończono ładowanie
  }, []);

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
    const matchesSearchTerm = video.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = selectedPlatform === 'all' || video.platform === selectedPlatform;
    return matchesSearchTerm && matchesPlatform;
  });

  const handleVideoSelect = (link) => {
    const videoId = getVideoId(link);
    setSelectedVideoId(videoId);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 text-gray-200 flex flex-col items-center justify-center">
      {/* Komunikat ładowania */}
      {loading ? (
        <p className="text-lg text-gray-400">Ładowanie linków z YouTube i Rumble...</p>
      ) : (
        <>
          {/* Komponent VideoCount wyświetlany po załadowaniu */}
          <VideoCount count={videos.length} />

          {/* Przyciski do wyboru platformy */}
          <div className="mb-4 flex justify-center">
            <button
              onClick={() => setSelectedPlatform('youtube')}
              className={`mx-2 p-2 rounded ${selectedPlatform === 'youtube' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              YouTube
            </button>
            <button
              onClick={() => setSelectedPlatform('rumble')}
              className={`mx-2 p-2 rounded ${selectedPlatform === 'rumble' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Rumble
            </button>
            <button
              onClick={() => setSelectedPlatform('podcast')}
              className={`mx-2 p-2 rounded ${selectedPlatform === 'podcast' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Podcast
            </button>
          </div>

          {/* Pole wyszukiwania */}
          <div className="mb-4 flex justify-center">
            <input
              type="text"
              placeholder="Szukaj filmów..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-2/2 lg:w-2/3 p-3 border border-gray-700 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Siatka filmów */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 flex-grow no-underline">
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
                    : 'https://via.placeholder.com/560x315?text=Podcast'; // Placeholder dla podcastów

                return (
                  <div key={index} className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
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
                          <a href={video.link} target="_blank" rel="noopener noreferrer">
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
