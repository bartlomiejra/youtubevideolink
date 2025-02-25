import React, { useEffect, useState, useMemo } from 'react';
import rumbleVideosData from './assets/data/rumble_videos.json';
import authorsData from './assets/data/authors.json'; // Importuj dane autorów
import AuthorsList from './components/AuthorsList'; // Importuj komponent AuthorsList
import VideoCard from './components/VideoCard/VideoCard';
import Pagination from './components/Pagination/Pagination';  // Dostosuj ścieżkę do komponentu


import youtubeVideosData from './assets/data/youtube_videos.json';
import podcastsData from './assets/data/podcasts.json';

import './index.css';
import Header from './components/Header/Header';
import ContentCount from './ContentCount';
import Footer from './components/Footer/Footer';
import SearchBar from './components/SearchBar/SearchBar';
import KoFiWidget from './components/Widgets/KoFiWidget';

function App() {
    const [selectedVideo, setSelectedVideo] = useState(null);

  const [videos, setVideos] = useState([]);
  const [initialVideos, setInitialVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('youtube');
  const [loading, setLoading] = useState(true);
  const [sortNewest, setSortNewest] = useState(true);
  const [authors, setAuthors] = useState([]); // Stan do przechowywania autorów
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100; // Liczba filmów na stronę
   useEffect(() => {
    setAuthors(authorsData);
  }, []);

const handleSearchChange = (event) => {
  setSearchTerm(event.target.value);
  setCurrentPage(1);  // Zresetowanie strony do 1
};
  const handlePlayVideo = (video) => {
    setSelectedVideo(video);
  };
   
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
const paginatedVideos = useMemo(() => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredVideos.slice(startIndex, endIndex);
}, [filteredVideos, currentPage, itemsPerPage]);
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
    setCurrentPage(1);  // Zresetowanie strony do 1
    setTimeout(() => setLoading(false), 1000);
  };

  const handleNextPage = () => {
  if (currentPage < Math.ceil(filteredVideos.length / itemsPerPage)) {
    setCurrentPage(currentPage + 1);
  }
};

const handlePrevPage = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }

  
};


 const renderVideo = (video, index) => (
        <VideoCard
            key={index}
            video={video}
            handlePlayVideo={handlePlayVideo}
            selectedVideo={selectedVideo}
            index={index}
        />
    );
  // const renderAuthors = () => (
  //   <div className="mb-4">
  //     <h3 className="text-xl font-semibold mb-2 text-gray-200">Autorzy:</h3>
  //     <ul>
  //       {authors.map((author, index) => (
  //         <li key={index} className="text-gray-400">
  //           {author.name} ({author.video_count} wideo)
  //         </li>
  //       ))}
  //     </ul>
  //   </div>
  // );

        // {/* <VideoCard/> */}
  
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
  <AuthorsList /> 
  
</div>
  <div className="flex-grow p-4"> {/* Kontener dla reszty */}
    <ContentCount count={filteredVideos.length} platform={selectedPlatform} />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 flex-grow mt-4 min-h-[200px]"> {/* Minimalna wysokość */}
       {paginatedVideos.length > 0 ? (
      paginatedVideos.map(renderVideo)
      ) : (
        <p className="col-span-full text-center text-gray-400">Brak wyników do wyświetlenia.</p>
      )}
 </div>


   <div className="flex justify-center items-center space-x-4 my-4">
   <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredVideos.length / itemsPerPage)}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
        />
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
