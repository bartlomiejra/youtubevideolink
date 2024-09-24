import React, { useEffect, useState } from 'react';
import videosData from './assets/data/videos_data.json';
import VideoCount from './VideoCount'; // Importujemy komponent VideoCount
import './index.css'; // Upewnij się, że CSS jest importowany

function App() {
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setVideos(videosData);
  }, []);

  const getVideoId = (link) => {
    const url = new URL(link);
    return url.searchParams.get('v');
  };

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 p-4 text-gray-200">
      <VideoCount count={videos.length} />

      {/* Pole wyszukiwania */}
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Szukaj filmów..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 lg:w-1/3 p-3 border border-gray-700 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Siatka filmów */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video, index) => {
            const videoId = getVideoId(video.link);
            const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

            return (
              <div key={index} className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                <a href={video.link} target="_blank" rel="noopener noreferrer">
                  <img 
                    src={thumbnailUrl} 
                    alt={video.title} 
                    className="w-full h-48 object-cover" 
                  />
                </a>
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{video.title}</h2>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-6">
            <p className="text-lg text-gray-500">Brak wyników do wyświetlenia.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
