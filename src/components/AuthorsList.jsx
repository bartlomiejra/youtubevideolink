import React, { useMemo } from 'react';
import authorsData from '../assets/data/authors.json';
import youtubeVideosData from '../assets/data/youtube_videos.json';
import rumbleVideosData from '../assets/data/rumble_videos.json';
import podcastsData from '../assets/data/podcasts.json';

const platformMap = {
  youtube: youtubeVideosData,
  rumble: rumbleVideosData,
  playlist: podcastsData,
};

const colorClasses = [
  "text-blue-200",
  "text-pink-200",
  "text-green-200",
  "text-yellow-200",
  "text-purple-200",
  "text-cyan-200",
  "text-orange-200",
  "text-lime-200",
  "text-emerald-200",
  "text-fuchsia-200",
  "text-sky-200",
  "text-rose-200",
];

function getColorClass(author) {
  let hash = 0;
  for (let i = 0; i < author.length; i++) {
    hash = author.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colorClasses[Math.abs(hash) % colorClasses.length];
}

const AuthorsList = ({ selectedPlatform, onAuthorClick }) => {
  const videos = platformMap[selectedPlatform] || [];

  const videoCounts = useMemo(() => {
    const counts = {};
    authorsData.forEach(author => {
      const lastName = author.split(' ').pop();
      const authorRegex = new RegExp(`\\b${lastName}\\b`, 'i');
      counts[lastName] = videos.filter(video => authorRegex.test(video.title)).length;
    });
    return counts;
  }, [selectedPlatform, videos]);

  return (
    <div className="md:w-64    h-auto flex-1 flex flex-col gap-3 overflow-y-auto">
      <h3 className="text-xl font-semibold mb-4 text-gray-200 text-left w-full ">Autorzy</h3>
      <div className="">
        {authorsData.map((author, index) => {
          const lastName = author.split(' ').pop();
          const count = videoCounts[lastName] || 0;
          const colorClass = colorClasses[(getColorClass(author) + index) % colorClasses.length];
          return (
            <button
              key={index}
              className={`w-full px-4 py-2 truncate rounded-xl text-base font-semibold shadow-sm border border-gray-700 bg-gray-800 hover:bg-gray-700 hover:scale-101 transition-all duration-150 cursor-pointer flex justify-between items-center text-left ${colorClass}`}
              onClick={() => onAuthorClick(author)} // <-- to jest OK, jeśli searchTerm ma być pełnym imieniem i nazwiskiem
              title={author}
              style={{ scrollbarWidth: 'auto' }}
            >
              <span className="break-words">{author}</span>
              {count > 0 && <span className="ml-2 text-xs text-gray-400">{count}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const MainComponent = () => {
  const [selectedPlatform, setSelectedPlatform] = React.useState('youtube');
  const [searchTerm, setSearchTerm] = React.useState('');

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full max-w-7xl mx-auto">
      <div className="w-full md:w-1/4 mb-4 md:mb-0">
        <AuthorsList
          selectedPlatform={selectedPlatform}
          onAuthorClick={setSearchTerm}
        />
      </div>
      <div className="flex-grow min-w-0 w-full md:w-3/4 p-4">
        {/* ...główna część... */}
      </div>
    </div>
  );
};

export default MainComponent;