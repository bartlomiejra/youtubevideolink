import { useMemo } from "react";
export function useFilteredVideos(videos, searchTerm, platform, sortNewest, parseDate) {
  return useMemo(() => {
    return videos
      .filter(video => {
        const term = searchTerm.toLowerCase();
        const matchesTitle = video.title.toLowerCase().includes(term);
        const matchesGenres =
          video.genres && video.genres.some(genre => genre.toLowerCase().includes(term));
        const matchesPlatform = video.platform === platform;
        return (matchesTitle || matchesGenres) && matchesPlatform;
      })
      .sort((a, b) => {
        if (sortNewest) {
          const dateA = a.date ? parseDate(a.date) : new Date(0);
          const dateB = b.date ? parseDate(b.date) : new Date(0);
          return dateB - dateA;
        }
        return 0;
      });
  }, [videos, searchTerm, platform, sortNewest, parseDate]);
}