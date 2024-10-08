import React, { useEffect, useState, useMemo } from 'react';
import rumbleVideosData from './assets/data/rumble_videos.json';
import youtubeVideosData from './assets/data/youtube_videos.json';
import podcastsData from './assets/data/podcasts.json';
import rumbleLogo from './assets/rumble.png';
import podcastImage from './assets/podcast.png';
import './index.css';
import Header from './components/Header/Header';
import ContentCount from './ContentCount';
import Footer from './components/Footer/Footer';
import SearchBar from './components/SearchBar/SearchBar';
import KoFiWidget from './components/Widgets/KoFiWidget';

function App() {
  const [videos, setVideos] = useState([]);
  const [initialVideos, setInitialVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('youtube'); // Domyślnie ustawione na YouTube
  const [loading, setLoading] = useState(true);
  const [sortNewest, setSortNewest] = useState(false);

  // Funkcja do konwersji daty z formatu DD.MM.YYYY na obiekt Date
  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('.').map(Number);
    return new Date(year, month - 1, day);
  };

  useEffect(() => {
    const combinedVideos = [
      ...rumbleVideosData,
      ...youtubeVideosData,
      ...podcastsData,
    ];

    setVideos(combinedVideos);
    setInitialVideos(combinedVideos);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 2000);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const getVideoId = (link) => {
    try {
      const url = new URL(link);
      const isYouTube = url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be');
      const isRumble = url.hostname.includes('rumble.com');

      if (isYouTube) {
        const videoId = url.searchParams.get('v');
        return videoId ? videoId : link.split('list=')[1];
      } else if (isRumble) {
        const pathParts = url.pathname.split('/');
        return pathParts[2];
      }
      return null;
    } catch (error) {
      console.error(`Invalid URL: ${link}`, error);
      return null;
    }
  };

  // Użycie useMemo dla wydajności
  const filteredVideos = useMemo(() => {
    return videos
      .filter(video => {
        const matchesSearchTerm = video.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
        const matchesPlatform = video.platform === selectedPlatform;
        return matchesSearchTerm && matchesPlatform;
      })
      .sort((a, b) => {
        if (sortNewest) {
          const dateA = a.date ? parseDate(a.date) : new Date(0);
          const dateB = b.date ? parseDate(b.date) : new Date(0);
          return dateB - dateA; // Sortuj od najnowszego do najstarszego
        }
        return 0; // Bez sortowania
      });
  }, [videos, debouncedSearchTerm, selectedPlatform, sortNewest]);

  const handleSortNewest = () => {
    setSortNewest(true);
  };

  const handleSortRandom = () => {
    const randomVideos = [...initialVideos].sort(() => Math.random() - 0.5);
    setVideos(randomVideos); // Ustaw losowo posortowane wideo
    setSortNewest(false); // Resetowanie sortowania
  };

  const handlePlatformChange = (platform) => {
    setLoading(true);
    setSelectedPlatform(platform);
    setSortNewest(false); // Resetowanie sortowania na false przy zmianie platformy
    const combinedVideos = [
      ...rumbleVideosData,
      ...youtubeVideosData,
      ...podcastsData,
    ];
    setInitialVideos(combinedVideos); // Ustawia wideo na zaktualizowane
    setVideos(combinedVideos); // Ustawia wideo na zaktualizowane
    setTimeout(() => setLoading(false), 1000);
  };

  const renderVideo = (video, index) => {
    const videoId = getVideoId(video.link);
    const isYouTube = video.platform === 'youtube';
    const isRumble = video.platform === 'rumble';
    const isPodcast = video.platform === 'playlist'; // Zmieniono na 'playlist'
    const thumbnailUrl = isYouTube 
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` 
      : isRumble 
        ? rumbleLogo 
        : (video.image_url || podcastImage); // Użyj video.image_url lub podcastImage

        

    return (
      <div key={index} className="bg-gray-950 shadow-lg rounded-lg overflow-hidden no-underline text-green-500">
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
            {video.description && (
              <p className="text-gray-400">{video.description}</p>
            )}
            <p className="text-red-900 mt-2">{video.date}</p>
          </div>
        </>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-180000 text-gray-200 flex flex-col items-center">
      <Header 
        selectedPlatform={selectedPlatform} 
        handlePlatformChange={handlePlatformChange} 
      />
      <SearchBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSortNewest={handleSortNewest}
        handleSortRandom={handleSortRandom}
      />

      {loading && (
        <div className="col-span-full text-center py-6 h-screen">
          <p className="text-lg text-gray-400">Ładowanie...</p>
        </div>
      )}

      {!loading && (
        <>
          <ContentCount count={filteredVideos.length} platform={selectedPlatform} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 flex-grow no-underline mt-4">
            {filteredVideos.length > 0 ? (
              filteredVideos.map(renderVideo)
            ) : (
              <p className="col-span-full text-center text-gray-400">Brak wyników do wyświetlenia.</p>
            )}
          </div>
        </>
      )}

      <KoFiWidget />
      <Footer />
    </div>
  );
}

export default App;
