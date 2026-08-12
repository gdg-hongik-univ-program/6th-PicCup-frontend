import { useState } from 'react';

import useMockBestPickStore from '../../store/useMockBestPickStore';
import useBestPicks from './useBestPicks';

const useAlbumPhotos = (categoryId) => {
  const [showLikedOnly, setShowLikedOnly] = useState(false);

  const allMockBestPicks =
    useMockBestPickStore(
      (state) => state.photos,
    );

  const mockBestPicks =
    allMockBestPicks.filter(
      (photo) => !photo.deletedAt,
    );

  const mockAlbumPhotos =
    categoryId === 'all'
      ? mockBestPicks
      : mockBestPicks.filter(
          (photo) =>
            String(photo.categoryId) === categoryId,
        );

  const isMockCategory =
    categoryId?.startsWith('mock-');

  const {
    bestPicks: serverBestPicks,
  } = useBestPicks(
    categoryId,
    !isMockCategory,
  );

  const albumPhotos = [
    ...mockAlbumPhotos,
    ...serverBestPicks,
  ];

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
