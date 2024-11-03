import React, { useEffect, useState, useMemo } from 'react';
import rumbleVideosData from './assets/data/rumble_videos.json';
import authorsData from './assets/data/authors.json'; // Importuj dane autorów
import AuthorsList from './components/AuthorsList'; // Importuj komponent AuthorsList

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
  const [selectedPlatform, setSelectedPlatform] = useState('youtube');
  const [loading, setLoading] = useState(true);
  const [sortNewest, setSortNewest] = useState(true);
  const [authors, setAuthors] = useState([]); // Stan do przechowywania autorów
   useEffect(() => {
    setAuthors(authorsData);
  }, []);

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

    // Przygotowanie listy autorów
    const authorSet = new Set();
    combinedVideos.forEach(video => {
      if (video.author) {
        authorSet.add(video.author);
      }
    });
    setAuthors(Array.from(authorSet)); // Przechowuj unikalnych autorów
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
    setVideos(randomVideos);
    setSortNewest(false);
  };

  const handlePlatformChange = (platform) => {
    setLoading(true);
    setSelectedPlatform(platform);
    setSortNewest(true);
    const combinedVideos = [
      ...rumbleVideosData,
      ...youtubeVideosData,
      ...podcastsData,
    ];
    setInitialVideos(combinedVideos);
    setVideos(combinedVideos);
    setTimeout(() => setLoading(false), 1000);
  };
  const renderVideo = (video, index) => {
    const videoId = getVideoId(video.link);
    const channelName = (video.channel_name);
    const channelLink = (video.Link);
    const channelImage = (video.channel_image);
    const isYouTube = video.platform === 'youtube';
    const isRumble = video.platform === 'rumble';
    const isPodcast = video.platform === 'playlist';
    const thumbnailUrl = isYouTube 
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` 
      : isRumble 
        ? rumbleLogo 
        : (video.image_url || podcastImage);
    return (
    <div
      key={video.index}
      className=" bg-gray-900 text-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 ease-in-out duration-300"
    >
      <div className= "relative flex-auto ">
      {/* Link do filmu z miniaturą */}
        
        <p className=" absolute top-0 text-xs text-gray-400">
           {video.date}
        </p>
      <a href={video.link} target="_blank" rel="noopener noreferrer">
        <img
          src={thumbnailUrl}
          alt={video.title}
          className="w-full h-48 object-cover cursor-pointer"
          >
          </img>
      </a>

      {/* Sekcja z tytułem filmu */}
      <div className=" flex absolute bottom-0 pb-1  bg-black bg-opacity-90">
        <a href={video.link} target="_blank" rel="noopener noreferrer">
          <p className="text-sm font-semibold text-gray-100  text-left hover:underline">
            {video.title}
          </p>
        </a>

      </div>
              {/* <div className="absolute bottom-0 right-0 flex items-center space-x-2 p-2 bg-black bg-opacity-50 rounded-tl-lg"> */}
  </div>
<div className="flex justify-end items-center p-2 bg-black bg-opacity-50">

        <a
          href={channelLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2"
        >
          {/* Nazwa kanału */}
          <p className="text-xs font-light text-gray-300 hover:underline">
            {channelName}
          </p>

          {/* Zdjęcie kanału */}
          <img
            src={`/youtube/${channelImage}`} // Ścieżka obrazu w folderze public
            alt={`Avatar for ${channelName}`}
            className="w-9 h-9 rounded-full border-1 border-black shadow-md"
          />
        </a>
      </div>
    </div>
  );
};



  const renderAuthors = () => (
    <div className="mb-4">
      <h3 className="text-xl font-semibold mb-2 text-gray-200">Autorzy:</h3>
      <ul>
        {authors.map((author, index) => (
          <li key={index} className="text-gray-400">
            {author.name} ({author.video_count} wideo)
          </li>
        ))}
      </ul>
    </div>
  );
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
     <div className="flex flex-col md:flex-row gap-4"> {/* Flexbox dla układu obok siebie */}
 <div className="hidden md:block w-full md:w-1/4 bg-gray-900 p-4"> {/* Pasek autorów */}
  <AuthorsList /> {/* Wyświetlenie listy autorów */}
</div>
  <div className="flex-grow p-4"> {/* Kontener dla reszty */}
    <ContentCount count={filteredVideos.length} platform={selectedPlatform} />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 flex-grow mt-4 min-h-[200px]"> {/* Minimalna wysokość */}
      {filteredVideos.length > 0 ? (
        filteredVideos.map(renderVideo)
      ) : (
        <p className="col-span-full text-center text-gray-400">Brak wyników do wyświetlenia.</p>
      )}
    </div>
  </div>
</div>

        </>
      )}

      <KoFiWidget />
      <Footer />
    </div>
  );
}
export default App;
