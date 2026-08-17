import { useState } from 'react';

import {
  deleteBestPicks,
} from '../../api/bestPickApi';
import {
  shareImages,
} from '../../libs/imageActions';

const useAlbumSelection = ({
  photos = [],
  categoryId,
  navigate,
  removePhotos,
}) => {
  const [
    isSelectionMode,
    setIsSelectionMode,
  ] = useState(false);

  const [
    selectedPhotoIds,
    setSelectedPhotoIds,
  ] = useState([]);

  const [
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,
  ] = useState(false);

  const [
    isProcessing,
    setIsProcessing,
  ] = useState(false);

  const [actionError, setActionError] =
    useState('');

  // 선택된 사진인지 확인
  const isPhotoSelected = (photoId) =>
    selectedPhotoIds.includes(photoId);

  // 사진 선택 및 해제
  const togglePhoto = (photoId) => {
    setSelectedPhotoIds(
      (previousIds) =>
        previousIds.includes(photoId)
          ? previousIds.filter(
              (id) => id !== photoId,
            )
          : [
              ...previousIds,
              photoId,
            ],
    );
  };

  // 선택 상태 초기화
  const clearSelection = () => {
    setSelectedPhotoIds([]);
    setIsSelectionMode(false);
    setActionError('');
  };

  // 선택 모드 시작 및 종료
  const toggleSelectionMode = () => {
    if (isSelectionMode) {
      clearSelection();
      return;
    }

    setIsSelectionMode(true);
  };

  // 선택된 사진 객체 목록
  const selectedPhotos =
    photos.filter((photo) =>
      selectedPhotoIds.includes(
        photo.id,
      ),
    );

  // 기존 이동 화면 재사용
  const handleMoveSelected = () => {
    if (selectedPhotoIds.length === 0) {
      return;
    }

    navigate('/album/move', {
      state: {
        ids: selectedPhotoIds,
        sourceCategoryId:
          categoryId === 'all'
            ? null
            : categoryId,
      },
    });
  };

  // 선택 사진 다중 공유
  const handleShareSelected =
    async () => {
      if (
        selectedPhotos.length === 0 ||
        isProcessing
      ) {
        return;
      }

      try {
        setIsProcessing(true);
        setActionError('');

        await shareImages({
          photos: selectedPhotos,
        });
      } catch (error) {
        if (
          error.name === 'AbortError'
        ) {
          return;
        }

        console.error(
          '선택 사진 공유 실패:',
          error,
        );

        setActionError(
          '선택한 사진을 공유하지 못했습니다.',
        );
      } finally {
        setIsProcessing(false);
      }
    };

  // 삭제 확인 모달 열기
  const handleDeleteOpen = () => {
    if (
      selectedPhotoIds.length === 0
    ) {
      return;
    }

    setActionError('');
    setIsDeleteConfirmOpen(true);
  };

  // 선택 사진 다중 삭제
  const handleDeleteConfirm =
    async () => {
      if (isProcessing) return;

      try {
        setIsProcessing(true);
        setActionError('');

        await deleteBestPicks(
          selectedPhotoIds,
        );

        // 서버 삭제 성공 후 화면에서도 제거
        removePhotos(
          selectedPhotoIds,
        );

        setIsDeleteConfirmOpen(false);
        clearSelection();
      } catch (error) {
        console.error(
          '선택 사진 삭제 실패:',
          error,
        );

        setActionError(
          error.response?.data?.message ??
            '선택한 사진을 삭제하지 못했습니다.',
        );
      } finally {
        setIsProcessing(false);
      }
    };

  const closeDeleteConfirm = () => {
    if (isProcessing) return;

    setIsDeleteConfirmOpen(false);
    setActionError('');
  };

  return {
    isSelectionMode,
    selectedPhotoIds,
    selectedPhotos,
    isPhotoSelected,
    isDeleteConfirmOpen,
    isProcessing,
    actionError,

    togglePhoto,
    toggleSelectionMode,
    clearSelection,
    handleMoveSelected,
    handleShareSelected,
    handleDeleteOpen,
    handleDeleteConfirm,
    closeDeleteConfirm,
  };
};

export default useAlbumSelection;