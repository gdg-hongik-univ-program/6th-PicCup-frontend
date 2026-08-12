import { Trash2 } from 'lucide-react';

import useTrashPhotos from '../hooks/trash/useTrashPhotos';
import useTrashSelection from '../hooks/trash/useTrashSelection';

import BackHeader from '../components/layout/BackHeader';
import TrashActionBar from '../components/trash/TrashActionBar';
import TrashPhotoGrid from '../components/trash/TrashPhotoGrid';
import TrashTabs from '../components/trash/TrashTabs';
import TrashToolbar from '../components/trash/TrashToolbar';
import { TRASH_RETENTION_DAYS } from '../constants/trash';

const TrashPage = () => {
  const {
    rejectedPhotos,
    deletedBestPicks,
    isRejectedLoading,
    isServerLoading,
    rejectedError,
    serverError,
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
    } = useTrashSelection({
    rejectedPhotos,
    deletedBestPicks,
  });
  const isLoading =
    activeTab === 'rejected'
      ? isRejectedLoading
      : isServerLoading;

  const currentError =
    activeTab === 'rejected'
      ? rejectedError
      : serverError;

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
        onChange={changeTab}
      />

      <TrashToolbar
        activeTab={activeTab}
        isSelectionMode={isSelectionMode}
        selectedCount={selectedPhotos.length}
        photoCount={visiblePhotos.length}
        onToggleSelectionMode={toggleSelectionMode}
      />

      {currentError && (
        <p
          className="mt-4 text-center text-xs text-error"
          role="alert"
        >
          {currentError}
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
          />
        )}
    </main>
  );
};

export default TrashPage;
