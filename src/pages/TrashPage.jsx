import { Trash2 } from 'lucide-react';

import useTrashPhotos from '../hooks/trash/useTrashPhotos';
import useTrashSelection from '../hooks/trash/useTrashSelection';
import useTrashActions from '../hooks/trash/useTrashActions';

import BackHeader from '../components/layout/BackHeader';
import TrashActionBar from '../components/trash/TrashActionBar';
import TrashPhotoGrid from '../components/trash/TrashPhotoGrid';
import TrashTabs from '../components/trash/TrashTabs';
import TrashToolbar from '../components/trash/TrashToolbar';
import { TRASH_RETENTION_DAYS } from '../constants/trash';
import ConfirmModal from '../components/layout/ConfirmModal';
import Snackbar from '../components/layout/Snackbar';

import { useNavigate, useLocation } from 'react-router';



const TrashPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    rejectedPhotos,
    deletedBestPicks,
    isRejectedLoading,
    isServerLoading,
    rejectedError,
    serverError,
    removeRejectedPhotos,
    removeServerDeletedBestPicks,
  } = useTrashPhotos();

  const {
    activeTab,
    visiblePhotos,
    selectedPhotos,
    isSelectionMode,

    getPhotoKey,
    isPhotoSelected,
    changeTab,
    toggleSelectionMode,
    togglePhoto,
    clearSelection,
    } = useTrashSelection({
    rejectedPhotos,
    deletedBestPicks,
  });

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
    clearActionNotice,
    handleRestoreOpen,
    handleRestoreConfirm,
    closeRestoreConfirm,
  } = useTrashActions({
    activeTab,
    selectedPhotos,
    removeRejectedPhotos,
    removeServerDeletedBestPicks,
    clearSelection,
  });

  const returnedSnackbarMessage =
    location.state?.snackbarMessage ?? '';

  const snackbarMessage =
    actionMessage || returnedSnackbarMessage;

  const returnedSnackbarAlbum =
    location.state?.snackbarAlbum ?? null;

  const snackbarAlbum =
    restoredAlbum || returnedSnackbarAlbum;

  const returnedHomeAction =
    location.state?.snackbarHomeAction ?? false;

  const showHomeAction =
    didPermanentlyDelete || returnedHomeAction;

  const handleTabChange = (nextTab) => {
    clearActionNotice();
    changeTab(nextTab);
  }; //탭 변경 시 이전 메시지도 지우기

  const handlePhotoOpen = (photo) => {
    navigate(
      `/album/trash/${activeTab}/${photo.id}`,
      {
        state: {
          photo,
        },
      },
    );
  };

  const handlePhotoLongPress = (photo) => {
    // 일반 모드라면 선택 모드로 전환
    if (!isSelectionMode) {
      toggleSelectionMode();
    }

    // 길게 누른 사진을 바로 선택
    if (!isPhotoSelected(photo)) {
      togglePhoto(photo);
    }
  };

  const isLoading =
    activeTab === 'rejected'
      ? isRejectedLoading
      : isServerLoading;

  const currentError =
    activeTab === 'rejected'
      ? rejectedError
      : serverError;
  const displayedError =
    actionError || currentError;

  const emptyMessage =
    activeTab === 'rejected'
      ? '탈락 사진이 없어요.'
      : '삭제한 베스트픽이 없어요.';

  const emptyDescription =
    activeTab === 'rejected'
      ? `토너먼트에서 탈락한 사진은 ${TRASH_RETENTION_DAYS.rejected}일간 보관돼요.`
      : `삭제한 베스트픽은 ${TRASH_RETENTION_DAYS.bestPick}일간 보관돼요.`;

  return (
    <main
      className={`min-h-dvh px-4 py-4 ${
        isSelectionMode ? 'pb-28' : ''
      }`}
    >
      <BackHeader title="휴지통" />

      <TrashTabs
        activeTab={activeTab}
        onChange={handleTabChange}
      />

      <TrashToolbar
        activeTab={activeTab}
        isSelectionMode={isSelectionMode}
        selectedCount={selectedPhotos.length}
        photoCount={visiblePhotos.length}
        onToggleSelectionMode={toggleSelectionMode}
      />

      {displayedError && (
        <p
          className="mt-4 text-center text-xs text-error"
          role="alert"
        >
          {displayedError}
        </p>
      )}

      {isLoading ? (
        <p className="py-16 text-center text-sm text-text-secondary">
          사진을 불러오는 중입니다.
        </p>
      ) : visiblePhotos.length === 0 ? (
        <section className="flex min-h-[55dvh] flex-col items-center justify-center text-center">
          <Trash2
            size={28}
            className="text-text-secondary"
          />

          <p className="mt-4 text-sm font-medium">
            {emptyMessage}
          </p>

          <p className="mt-2 text-xs leading-5 text-text-secondary">
            {emptyDescription}
          </p>
        </section>
      ) : (
        <TrashPhotoGrid
          photos={visiblePhotos}
          isSelectionMode={isSelectionMode}
          getPhotoKey={getPhotoKey}
          isPhotoSelected={isPhotoSelected}
          onTogglePhoto={togglePhoto}
          onOpenPhoto={handlePhotoOpen}
          onLongPressPhoto={handlePhotoLongPress}
        />
      )}

      {isSelectionMode && visiblePhotos.length > 0 && (
        <TrashActionBar
          activeTab={activeTab}
          selectedCount={selectedPhotos.length}
          isProcessing={isProcessing}
          onPrimaryAction={handleRestoreOpen}
          onPermanentDelete={handlePermanentDeleteOpen}
        />
      )}

      <ConfirmModal
          isOpen={isRestoreConfirmOpen}
          title={
            activeTab === 'rejected'
              ? `선택한 ${selectedPhotos.length}장을 앨범에 추가할까요?`
              : `선택한 ${selectedPhotos.length}장을 복구할까요?`
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
          title={`선택한 ${selectedPhotos.length}장을 영구 삭제할까요?`}
          description="영구 삭제한 사진은 다시 복구할 수 없어요."
          error={actionError}
          confirmLabel="영구 삭제"
          confirmingLabel="삭제 중..."
          isConfirming={isProcessing}
          onClose={closePermanentDelete}
          onConfirm={
            handlePermanentDeleteConfirm
          }
        />
        <Snackbar
          message={snackbarMessage}
          positionClassName={
            isSelectionMode ? 'bottom-28' : 'bottom-6'
          }
          actionLabel={
            showHomeAction
              ? '홈으로'
              : snackbarAlbum
                ? '앨범 가기'
                : ''
          }
          onAction={
            showHomeAction
              ? () => {
                  clearActionNotice();
                  navigate('/');
                }
              : snackbarAlbum
                ? () => {
                    clearActionNotice();
                    navigate('/album');
                  }
                : undefined
          }
          onClose={() => {
            clearActionNotice();

            // 상세 화면에서 전달된 문구 제거
            if (returnedSnackbarMessage) {
              navigate('/album/trash', {
                replace: true,
                state: {
                  activeTab,
                },
              });
            }
          }}
        />
    </main>
  );
};

export default TrashPage;
