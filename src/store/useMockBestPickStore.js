import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import mockBestPicks from '../constants/mockPhotos';

const useMockBestPickStore = create(
  persist(
    (set) => ({
      photos: mockBestPicks,

      toggleLike: (photoId) => {
        set((state) => ({
          photos: state.photos.map((photo) =>
            photo.id === photoId
              ? {
                  ...photo,
                  isLiked: !photo.isLiked,
                }
              : photo,
          ),
        }));
      },
      moveToTrash: (photoId) => {
        set((state) => ({
            photos: state.photos.map((photo) =>
            photo.id === photoId
                ? {
                    ...photo,
                    deletedAt: new Date().toISOString(),
                }
                : photo,
            ),
        }));
      },
    }),
    {
      name: 'piccup-mock-best-picks',
    },
  ),
);

export default useMockBestPickStore;