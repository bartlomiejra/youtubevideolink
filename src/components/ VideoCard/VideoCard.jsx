import React from 'react';
import rumbleLogo from '../../assets/rumble.png';
import podcastImage from '../../assets/podcast.png';
import Player from '../Player/Player';  // Dostosuj ścieżkę do komponentu
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
const VideoCard = ({ video, handlePlayVideo, selectedVideo, index }) => {

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
      : isPodcast
      ? "/public/bartplay.png"
      : video.image_url || podcastImage;
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
          <button key={video.id} onClick={() => handlePlayVideo(video)}>
          {video.title}
        </button>
              {selectedVideo && <Player video={selectedVideo} />}
      <a href={video.link} target="_blank" rel="noopener noreferrer">
        <img
          src={thumbnailUrl}
          alt={video.title}
          className="w-full himport VideoCard from './components/VideoCard/VideoCard'; cover cursor-pointer"
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

export default VideoCard;

