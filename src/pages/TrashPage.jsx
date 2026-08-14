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



const TrashPage = () => {
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
    handleAddToAlbum,
    handleRestoreBestPicks,
    handlePermanentDeleteOpen,
    handlePermanentDeleteConfirm,
    closePermanentDelete,
    clearActionNotice,
  } = useTrashActions({
    activeTab,
    selectedPhotos,
    removeRejectedPhotos,
    removeServerDeletedBestPicks,
    clearSelection,
  });

  const handleTabChange = (nextTab) => {
    clearActionNotice();
    changeTab(nextTab);
  }; //탭 변경 시 이전 메시지도 지우기

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
            isSelectionMode ? 'pb-24' : ''
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

      {actionMessage && (
        <p
          className="mt-4 text-center text-xs text-primary"
          role="status"
        >
          {actionMessage}
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
          activeTab={activeTab}
          photos={visiblePhotos}
          isSelectionMode={isSelectionMode}
          getPhotoKey={getPhotoKey}
          isPhotoSelected={isPhotoSelected}
          onTogglePhoto={togglePhoto}
        />
      )}

      {isSelectionMode &&
        visiblePhotos.length > 0 && (
          <TrashActionBar
            activeTab={activeTab}
            selectedCount={selectedPhotos.length}
            isProcessing={isProcessing}
            onPrimaryAction={
              activeTab === 'rejected'
                ? handleAddToAlbum
                : handleRestoreBestPicks
            }
            onPermanentDelete={handlePermanentDeleteOpen}
          />
        )}
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
    </main>
  );
};

export default TrashPage;
