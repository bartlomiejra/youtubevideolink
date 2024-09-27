import React, { useEffect, useState } from 'react';
import rumbleVideosData from './assets/data/rumble_videos.json';
import youtubeVideosData from './assets/data/youtube_videos.json';
import podcastsData from './assets/data/podcasts.json';
import rumbleLogo from './assets/rumble.png';
import podcastImage from './assets/podcast.png';
import './index.css';
import Header from './Header';
import ContentCount from './ContentCount';

function App() {
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedVideoId, setSelectedVideoId] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('youtube');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const combinedVideos = [
      ...rumbleVideosData,
      ...youtubeVideosData,
      ...podcastsData,
    ];
    setVideos(combinedVideos);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setLoading(false);
    }, 2000);
    setLoading(true);

    return () => {
      clearTimeout(timer);
      setLoading(false);
    };
  }, [searchTerm]);

  useEffect(() => {
    setLoading(false);
  }, [selectedPlatform]);

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

  const filteredVideos = videos.filter(video => {
    const matchesSearchTerm = video.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    const matchesPlatform = selectedPlatform === 'all' || video.platform === selectedPlatform;
    return matchesSearchTerm && matchesPlatform;
  });

  const handlePlatformChange = (platform) => {
    setLoading(true);
    setSelectedPlatform(platform);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleVideoClick = (videoId) => {
    setSelectedVideoId(videoId);
  };

  return (
    <div className="min-h-screen bg-gray-180000 p-4 text-gray-200 flex flex-col items-center justify-center">
      <Header />

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

      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Szukaj filmów..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          className="w-full md:w-2/2 lg:w-2/3 p-3 border border-gray-700 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <ContentCount count={filteredVideos.length} platform={selectedPlatform} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 flex-grow no-underline">
        {loading && (
          <div className="col-span-full text-center py-6">
            <p className="text-lg text-gray-400">Ładowanie...</p>
          </div>
        )}

        {!loading && filteredVideos.length > 0 ? (
          filteredVideos.map((video, index) => {
            const videoId = getVideoId(video.link);
            const isYouTube = video.platform === 'youtube';
            const isRumble = video.platform === 'rumble';
            const isPodcast = video.platform === 'podcast';
            const thumbnailUrl = isYouTube
              ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
              : isRumble
                ? rumbleLogo
                : podcastImage;

            return (
              <div key={index} className="shadow-lg rounded-lg overflow-hidden no-underline text-green-500">
                <>
                  <a
                    href={video.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={thumbnailUrl}
                      alt={video.title}
                      className="w-full h-48 object-cover cursor-pointer"
                    />
                  </a>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2 text-gray-200 no-underline">
                      <a
                        href={video.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-200"
                      >
                        {video.title}
                      </a>
                    </h2>
                    <button
                      onClick={() => handleVideoClick(videoId)}
                      className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                      Otwórz na stronie
                    </button>
                  </div>
                </>
              </div>
            );
          })
        ) : (
          !loading && (
            <div className="col-span-full text-center py-6">
              <p className="text-lg text-gray-500">Brak wyników do wyświetlenia.</p>
            </div>
          )
        )}
      </div>

      {selectedVideoId && (
        <div className="fixed bottom-4 right-4 bg-gray-800 p-4 rounded-lg shadow-lg z-50 w-96 h-56">
          <div className="flex justify-end">
            <button
              onClick={() => setSelectedVideoId('')}
              className="text-white hover:text-red-500"
            >
              &times;
            </button>
          </div>
          <div className="relative w-full h-full">
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded"
              src={`https://www.youtube.com/embed/${selectedVideoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
