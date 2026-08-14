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
      restoreFromTrash: (photoIds) => { //복구하기
        set((state) => ({
          photos: state.photos.map((photo) => {
            if (!photoIds.includes(photo.id)) {
              return photo;
            }

            const restoredPhoto = {
              ...photo,
            };

            delete restoredPhoto.deletedAt;

            return restoredPhoto;
          }),
        }));
      },

      permanentlyDelete: (photoIds) => { //영구삭제
        set((state) => ({
          photos: state.photos.filter(
            (photo) =>
              !photoIds.includes(photo.id),
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