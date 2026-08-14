import { useState } from 'react';

import useBestPicks from './useBestPicks';

const useAlbumPhotos = (categoryId) => {
  const [showLikedOnly, setShowLikedOnly] = useState(false);

  const {
    bestPicks: albumPhotos,
  } = useBestPicks(categoryId);

  const visiblePhotos = showLikedOnly
    ? albumPhotos.filter((photo) => photo.isLiked)
    : albumPhotos;

  return {
    albumPhotos,
    visiblePhotos,
    showLikedOnly,
    setShowLikedOnly,
  };
};

export default useAlbumPhotos;
