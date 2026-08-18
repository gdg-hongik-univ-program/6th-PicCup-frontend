import { useState } from 'react';

import {
  permanentlyDeleteBestPicks,
  restoreDeletedBestPicks,
  uploadBestPick,
} from '../../api/bestPickApi';
import { deletePhotosByIds } from '../../libs/photoDB';
import { trackEvent } from '../../libs/analytics';

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

  const [
    isRestoreConfirmOpen,
    setIsRestoreConfirmOpen,
  ] = useState(false);

  const [actionError, setActionError] =
    useState('');

  const [actionMessage, setActionMessage] = useState('');

  // 복구 후 이동할 앨범
  const [restoredAlbum, setRestoredAlbum] = useState(null);

  // 영구 삭제 완료 여부
  const [didPermanentlyDelete, setDidPermanentlyDelete] = useState(false);

  const clearActionNotice = () => {
    setActionError('');
    setActionMessage('');
    setRestoredAlbum(null);
    setDidPermanentlyDelete(false);
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

    let uploadedAlbumName = '';

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
        //ga4 이벤트: 서버 업로드에 성공한 사진마다 이벤트 전송
        uploadedPhotoIds.forEach(() => {
          trackEvent('best_pick_saved', {
            feature_source: 'trash_recovery',
          });
        });
        // 업로드에 성공한 사진만 구하기
        const uploadedPhotos = selectedPhotos.filter(
          (photo) => uploadedPhotoIds.includes(photo.id),
        );

        // 업로드된 사진들의 카테고리 목록
        const uploadedCategories = [
          ...new Map(
            uploadedPhotos.map((photo) => [
              String(photo.categoryId),
              {
                id: photo.categoryId,
                name: photo.categoryName,
              },
            ]),
          ).values(),
        ];

        // 한 카테고리면 해당 앨범 정보 저장
        if (uploadedCategories.length === 1) {
          const targetAlbum = uploadedCategories[0];

          setRestoredAlbum(targetAlbum);
          uploadedAlbumName = targetAlbum.name;
        } else {
          setRestoredAlbum({
            id: null,
            name: null,
          });
        }

        await deletePhotosByIds(uploadedPhotoIds);
        //업로드 성공한 사진 indexedDB에서 삭제

        removeRejectedPhotos(uploadedPhotoIds);
      }

      if (failedCount === 0) {
        setActionMessage(
          uploadedAlbumName
            ? `사진 ${uploadedPhotoIds.length}장을 '${uploadedAlbumName}' 앨범에 추가했어요.`
            : `사진 ${uploadedPhotoIds.length}장을 각각 앨범에 추가했어요.`,
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

    const serverPhotoIds = selectedPhotos.map(
      (photo) => photo.id,
    );

    try {
      let restoredCount = 0;
      let skippedCount = 0;
      let restoredPhotos = [];

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

        restoredPhotos = restored;

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

      clearSelection();

      if (restoredCount > 0) {
        // 복구 목적지 카테고리 확인
        const restoredCategories = [
          ...new Map(
            restoredPhotos.map((photo) => [
              String(photo.categoryId),
              {
                id: photo.categoryId,
                name: photo.categoryName,
              },
            ]),
          ).values(),
        ];

        if (restoredCategories.length === 1) {
          const targetAlbum =
            restoredCategories[0];

          setRestoredAlbum(targetAlbum);

          setActionMessage(
            `사진 ${restoredCount}장을 '${targetAlbum.name}' 카테고리로 복구했어요.`,
          );
        } else {
          // 여러 카테고리로 복구된 경우
          setRestoredAlbum({
            id: null,
            name: null,
          });

          setActionMessage(
            `사진 ${restoredCount}장을 각각 카테고리로 복구했어요.`,
          );
        }
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

  // 복구 확인 모달 열기
  const handleRestoreOpen = () => {
    if (selectedPhotos.length === 0) return;

    clearActionNotice();
    setIsRestoreConfirmOpen(true);
  };

  // 복구 확인 모달 닫기
  const closeRestoreConfirm = () => {
    if (isProcessing) return;

    setIsRestoreConfirmOpen(false);
    setActionError('');
  };

  // 확인 후 기존 복구 로직 실행
  // 탭에 맞는 복구 로직 실행
  const handleRestoreConfirm = async () => {
    if (activeTab === 'rejected') {
      await handleAddToAlbum();
    } else {
      await handleRestoreBestPicks();
    }

    setIsRestoreConfirmOpen(false);
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
          const serverPhotoIds = selectedPhotos.map(
            (photo) => photo.id,
          );

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

        }

        setIsPermanentDeleteOpen(false);
        clearSelection();

        setDidPermanentlyDelete(true);
        setActionMessage(
          `사진 ${deletedCount}장을 영구 삭제했어요.`,
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
    isRestoreConfirmOpen,
    restoredAlbum,
    didPermanentlyDelete,
    handleAddToAlbum,
    handleRestoreBestPicks,
    handlePermanentDeleteOpen,
    handlePermanentDeleteConfirm,
    closePermanentDelete,
    clearActionNotice,
    handleRestoreOpen,
    handleRestoreConfirm,
    closeRestoreConfirm,
  };
};

export default useTrashActions;
