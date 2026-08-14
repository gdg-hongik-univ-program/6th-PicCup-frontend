import { useState } from 'react';

import {
  permanentlyDeleteBestPicks,
  restoreDeletedBestPicks,
  uploadBestPick,
} from '../../api/bestPickApi';
import { deletePhotosByIds } from '../../libs/photoDB';
import useMockBestPickStore from '../../store/useMockBestPickStore';

const useTrashActions = ({
  activeTab,
  selectedPhotos,
  removeRejectedPhotos,
  removeServerDeletedBestPicks,
  clearSelection,
}) => {
  const [isProcessing, setIsProcessing] =
    useState(false);

  const [
    isPermanentDeleteOpen,
    setIsPermanentDeleteOpen,
  ] = useState(false);

  const [actionError, setActionError] =
    useState('');

  const [actionMessage, setActionMessage] =
    useState('');

  const restoreMockPhotos = useMockBestPickStore(
    (state) => state.restoreFromTrash,
  );

  const permanentlyDeleteMockPhotos =
    useMockBestPickStore(
      (state) => state.permanentlyDelete,
    );

  const clearActionNotice = () => {
    setActionError('');
    setActionMessage('');
  };

  const handleAddToAlbum = async () => {
    if (
      selectedPhotos.length === 0 ||
      isProcessing
    ) {
      return;
    }

    setIsProcessing(true);
    clearActionNotice();

    try {
      const uploadResults =
        await Promise.allSettled( //한 장의 업로드가 실패해도 나머지 업로드는 계속하기 위해서
          selectedPhotos.map((photo) =>
            uploadBestPick({
              file: photo.blob,
              categoryId: photo.categoryId,
              capturedDate:
                photo.capturedDate,
              candidateCount:
                photo.candidateCount,
            }),
          ),
        );

      const uploadedPhotoIds =
        uploadResults
          .map((result, index) =>
            result.status === 'fulfilled'
              ? selectedPhotos[index].id
              : null,
          )
          .filter(
            (photoId) => photoId !== null,
          );

      const failedCount =
        selectedPhotos.length -
        uploadedPhotoIds.length;

      if (uploadedPhotoIds.length > 0) {
        await deletePhotosByIds(
          uploadedPhotoIds, 
        ); // 업로드 성공한 사진 indexedDB에서 삭제

        removeRejectedPhotos(
          uploadedPhotoIds,
        );
      }

      if (failedCount === 0) {
        setActionMessage(
          `${uploadedPhotoIds.length}장을 앨범에 추가했어요.`,
        );

        clearSelection();
      } else if (uploadedPhotoIds.length > 0) {
        setActionError(
          `${uploadedPhotoIds.length}장은 추가됐지만 ${failedCount}장은 추가하지 못했어요.`,
        );

        clearSelection();
      } else {
        setActionError(
          '선택한 사진을 앨범에 추가하지 못했어요.',
        );
      }
    } catch (error) {
      console.error(
        '탈락 사진 앨범 추가 실패:',
        error,
      );

      setActionError(
        '사진을 앨범에 추가하지 못했어요.',
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestoreBestPicks = async () => {
    if (
      selectedPhotos.length === 0 ||
      isProcessing
    ) {
      return;
    }

    setIsProcessing(true);
    clearActionNotice();

    const mockPhotoIds = selectedPhotos
      .filter((photo) => photo.isMock)
      .map((photo) => photo.id);

    const serverPhotoIds = selectedPhotos
      .filter((photo) => !photo.isMock)
      .map((photo) => photo.id);

    try {
      let restoredCount = 0;
      let skippedCount = 0;

      if (serverPhotoIds.length > 0) {
        const result =
          await restoreDeletedBestPicks(
            serverPhotoIds,
          );

        const restored = Array.isArray(
          result.restored,
        )
          ? result.restored
          : [];

        const skipped = Array.isArray(
          result.skipped,
        ) //S3 객체가 없어 복구하지 못한 사진, 휴지통에서도 삭제
          ? result.skipped
          : [];

        const restoredIds = restored.map(
          (photo) => photo.id,
        );

        const skippedIds = skipped;

        removeServerDeletedBestPicks([
          ...restoredIds,
          ...skippedIds,
        ]);

        restoredCount += restoredIds.length;
        skippedCount += skippedIds.length;
      }

      if (mockPhotoIds.length > 0) {
        restoreMockPhotos(mockPhotoIds);
        restoredCount += mockPhotoIds.length;
      }

      clearSelection();

      if (restoredCount > 0) {
        setActionMessage(
          `${restoredCount}장을 복구했어요.`,
        );
      }

      if (skippedCount > 0) {
        setActionError(
          `${skippedCount}장은 원본 파일이 없어 복구하지 못했어요.`,
        );
      }
    } catch (error) {
      console.error(
        '베스트픽 복구 실패:',
        error,
      );

      setActionError(
        error.response?.data?.message ??
          '선택한 베스트픽을 복구하지 못했어요.',
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePermanentDeleteOpen = () => {
    if (selectedPhotos.length === 0) return;

    clearActionNotice();
    setIsPermanentDeleteOpen(true);
  };

  const closePermanentDelete = () => {
    if (isProcessing) return;

    setIsPermanentDeleteOpen(false);
    setActionError('');
  };

  const handlePermanentDeleteConfirm =
    async () => {
      if (
        selectedPhotos.length === 0 ||
        isProcessing
      ) {
        return;
      }

      setIsProcessing(true);
      setActionError('');

      try {
        let deletedCount = 0;

        if (activeTab === 'rejected') {
          const rejectedPhotoIds =
            selectedPhotos.map(
              (photo) => photo.id,
            );

          await deletePhotosByIds(
            rejectedPhotoIds,
          );

          removeRejectedPhotos(
            rejectedPhotoIds,
          );

          deletedCount =
            rejectedPhotoIds.length;
        } else {
          const mockPhotoIds =
            selectedPhotos
              .filter((photo) => photo.isMock)
              .map((photo) => photo.id);

          const serverPhotoIds =
            selectedPhotos
              .filter((photo) => !photo.isMock)
              .map((photo) => photo.id);

          if (serverPhotoIds.length > 0) {
            const result =
              await permanentlyDeleteBestPicks(
                serverPhotoIds,
              );

            const purgedIds = Array.isArray(
              result.purged,
            )
              ? result.purged
              : [];

            removeServerDeletedBestPicks(
              purgedIds,
            ); //서버가 실제 삭제한 ID

            deletedCount += purgedIds.length;
          }

          if (mockPhotoIds.length > 0) {
            permanentlyDeleteMockPhotos(
              mockPhotoIds,
            );

            deletedCount += mockPhotoIds.length;
          }
        }

        setIsPermanentDeleteOpen(false);
        clearSelection();

        setActionMessage(
          `${deletedCount}장을 영구 삭제했어요.`,
        );
      } catch (error) {
        console.error(
          '휴지통 영구삭제 실패:',
          error,
        );

        setActionError(
          error.response?.data?.message ??
            '선택한 사진을 영구 삭제하지 못했어요.',
        );
      } finally {
        setIsProcessing(false);
      }
    };

  return {
    isProcessing,
    isPermanentDeleteOpen,
    actionError,
    actionMessage,
    handleAddToAlbum,
    handleRestoreBestPicks,
    handlePermanentDeleteOpen,
    handlePermanentDeleteConfirm,
    closePermanentDelete,
    clearActionNotice,
  };
};

export default useTrashActions;