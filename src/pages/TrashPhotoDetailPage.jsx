import {
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import {
  useLocation,
  useNavigate,
  useParams,
} from 'react-router';

import BackHeader from '../components/layout/BackHeader';
import ConfirmModal from '../components/layout/ConfirmModal';
import TrashPhotoDetailActionBar from '../components/trash/TrashPhotoDetailActionBar';
import useTrashActions from '../hooks/trash/useTrashActions';

const noop = () => {};

const TrashPhotoDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { trashType } = useParams();

  const activeTab =
    trashType === 'rejected'
      ? 'rejected'
      : 'best-pick';

  const photo = location.state?.photo;
  // 사진 종류에 맞는 상세 이미지 URL 생성
  const imageUrl = useMemo(() => {
    if (!photo) return '';

    if (
        activeTab === 'rejected' &&
        photo.blob
    ) {
        return URL.createObjectURL(photo.blob);
    }

    return photo.imageUrl ?? '';
    }, [
    activeTab,
    photo,
  ]);

    // IndexedDB 사진의 임시 URL 정리
  useEffect(() => {
    if (!imageUrl.startsWith('blob:')) {
        return undefined;
    }

    return () => {
        URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  const {
    isProcessing,
    isPermanentDeleteOpen,
    actionError,
    actionMessage,
    isRestoreConfirmOpen,
    restoredAlbum,
    didPermanentlyDelete,
    handlePermanentDeleteOpen,
    handlePermanentDeleteConfirm,
    closePermanentDelete,
    handleRestoreOpen,
    handleRestoreConfirm,
    closeRestoreConfirm,
  } = useTrashActions({
    activeTab,
    // 기존 다중 처리 훅에 한 장만 전달
    selectedPhotos: photo ? [photo] : [],
    removeRejectedPhotos: noop,
    removeServerDeletedBestPicks: noop,
    clearSelection: noop,
  });

  const handleBack = useCallback(() => {
    navigate('/album/trash', {
        replace: true,
        state: {
        activeTab,
        },
    });
  }, [
    activeTab,
    navigate,
  ]);

  // 작업 성공 후 기존 탭으로 돌아가기
  useEffect(() => {
    if (!actionMessage) return;

    navigate('/album/trash', {
        replace: true,
        state: {
            activeTab,
            snackbarMessage: actionMessage,
            snackbarAlbum: restoredAlbum,
            snackbarHomeAction: didPermanentlyDelete,
        },
    });
  }, [
    actionMessage,
    activeTab,
    restoredAlbum,
    didPermanentlyDelete,
    navigate,
  ]);

  if (!photo) {
    return (
      <main className="min-h-dvh px-4 py-4">
        <BackHeader
          title="휴지통"
          onBack={handleBack}
        />

        <p className="py-20 text-center text-sm text-text-secondary">
          사진 정보를 불러올 수 없어요.
        </p>
      </main>
    );
  }

  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-background pb-20">
      <div className="px-4 pt-4">
        <BackHeader
          title=""
          onBack={handleBack}
        />
      </div>

      <section className="flex min-h-0 flex-1 items-center justify-center bg-background">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="휴지통 사진"
            className="h-full w-full object-contain"
          />
        )}
      </section>

      {actionError && (
        <p
          role="alert"
          className="px-4 py-2 text-center text-xs text-error"
        >
          {actionError}
        </p>
      )}

      <TrashPhotoDetailActionBar
        activeTab={activeTab}
        isProcessing={isProcessing}
        onRestore={handleRestoreOpen}
        onDelete={handlePermanentDeleteOpen}
      />

      <ConfirmModal
        isOpen={isRestoreConfirmOpen}
        title={
            activeTab === 'rejected'
            ? '이 사진을 앨범에 추가할까요?'
            : '이 사진을 복구할까요?'
        }
        description={
            activeTab === 'rejected'
            ? '사진은 원래 카테고리의 앨범에 추가돼요.'
            : '복구한 사진은 앨범에서 다시 확인할 수 있어요.'
        }
        error={actionError}
        variant="primary"
        confirmLabel={
            activeTab === 'rejected'
            ? '추가'
            : '복구'
        }
        confirmingLabel={
            activeTab === 'rejected'
            ? '추가 중...'
            : '복구 중...'
        }
        isConfirming={isProcessing}
        onClose={closeRestoreConfirm}
        onConfirm={handleRestoreConfirm}
      />

      <ConfirmModal
        isOpen={isPermanentDeleteOpen}
        title="이 사진을 영구 삭제할까요?"
        description="영구 삭제한 사진은 다시 복구할 수 없어요."
        error={actionError}
        confirmLabel="영구 삭제"
        confirmingLabel="삭제 중..."
        isConfirming={isProcessing}
        onClose={closePermanentDelete}
        onConfirm={handlePermanentDeleteConfirm}
      />
    </main>
  );
};

export default TrashPhotoDetailPage;