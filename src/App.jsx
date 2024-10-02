// App.js
import React, { useEffect, useState } from 'react';
import rumbleVideosData from './assets/data/rumble_videos.json';
import youtubeVideosData from './assets/data/youtube_videos.json';
import podcastsData from './assets/data/podcasts.json';
import rumbleLogo from './assets/rumble.png';
import podcastImage from './assets/podcast.png'; // Import the podcast image
import './index.css';
import Header from './components/Header/Header'; // Importuj nowy komponent Header
import ContentCount from './ContentCount';
import Footer from './components/Footer/Footer';
import SearchBar from './components/SearchBar/SearchBar'; // Importuj nowy komponent
import KoFiWidget from './components/Widgets/KoFiWidget'; // Importuj nowy komponent


function App() {
  const [videos, setVideos] = useState([]);
  const [initialVideos, setInitialVideos] = useState([]); // Tablica do przechowywania pierwotnych danych
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('youtube'); // Domyślnie ustawione na YouTube
  const [loading, setLoading] = useState(true); // Ustawiono na true na początku

  useEffect(() => {
    // Łączymy dane z wszystkich plików
    const combinedVideos = [
      ...rumbleVideosData,
      ...youtubeVideosData,
      ...podcastsData,
    ];

    setVideos(combinedVideos);
    setInitialVideos(combinedVideos); // Ustaw pierwotne dane
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
    const matchesPlatform = video.platform === selectedPlatform;
    return matchesSearchTerm && matchesPlatform;
  });

  // Funkcja do konwersji daty z formatu DD.MM.YYYY na obiekt Date
  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('.').map(Number);
    return new Date(year, month - 1, day); // Miesiące w JavaScript zaczynają się od 0
  };

  const handleSortNewest = () => {
    const sortedVideos = [...filteredVideos].sort((a, b) => {
      return parseDate(b.date) - parseDate(a.date); // Sortowanie według daty
    });
    setVideos(sortedVideos); // Ustaw posortowane filmy
  };

  const handleSortRandom = () => {
    const randomVideos = [...initialVideos].sort(() => Math.random() - 0.5); // Losowe sortowanie z pierwotnej tablicy
    setVideos(randomVideos); // Ustaw losowe filmy
  };

  const handlePlatformChange = (platform) => {
    setLoading(true); // Ustaw loading na true przy zmianie platformy
    setSelectedPlatform(platform);
    setTimeout(() => setLoading(false), 1000); // Dodaj krótki czas ładowania przy zmianie platformy
  };

  return (
    <div className="min-h-screen bg-gray-180000 text-gray-200 flex flex-col items-center">
      {/* Komponent Header */}
      <Header 
        selectedPlatform={selectedPlatform} 
        handlePlatformChange={handlePlatformChange} 
      />
            {/* <KoFiWidget /> Dodaj komponent Ko-fi */}


      {/* Komponent SearchBar */}
      <SearchBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSortNewest={handleSortNewest}
        handleSortRandom={handleSortRandom}
      />

      {/* Komunikat ładowania */}
     {loading && (
    <div className="col-span-full text-center py-6 h-screen">
        <p className="text-lg text-gray-400">Ładowanie...</p>
    </div>
)}


      {/* Komponent ContentCount wyświetlany po załadowaniu */}
      {!loading && (
        <>
          <ContentCount count={filteredVideos.length} platform={selectedPlatform} />
          
          {/* Siatka filmów */}
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
                  <div key={index} className=" bg-gray-950 shadow-lg rounded-lg overflow-hidden no-underline text-green-500">
                    <>
                      <a href={video.link} target="_blank" rel="noopener noreferrer">
                        <img 
                          src={thumbnailUrl} 
                          alt={video.title} 
                          className="w-full h-48 object-cover cursor-pointer" 
                        />
                      </a>
                      <div className="p-4">
                        <h2 className="text-xl font-semibold mb-2 text-gray-200 no-underline">{video.title}</h2>
                        <p className="text-gray-400">{video.description}</p>
                        {/* Wyświetlenie daty pod tytułem */}
                        <p className="text-gray-500 mt-2">{video.date}</p>
                      </div>
                    </>
                  </div>
                );
              })
            ) : (
              <p className="col-span-full text-center text-gray-400">Brak wyników do wyświetlenia.</p>
            )}
          </div>
        </>
      )}
      {/* <KoFiframe />  */}
      <KoFiWidget />

      <Footer />
    </div>
  );
}

export default App;
