import { useMemo } from "react";
export function useFilteredVideos(videos, searchTerm, platform, sortNewest, parseDate) {
  return useMemo(() => {
    return videos
      .filter(video => {
        const matchesSearchTerm = video.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPlatform = video.platform === platform;
        return matchesSearchTerm && matchesPlatform;
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