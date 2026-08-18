import { Check, ChevronLeft, Heart, SlidersHorizontal } from 'lucide-react';
import {
  useLocation,
  useNavigate,
  useParams,
} from 'react-router';

import { useState } from 'react';

import AlbumViewOptionsMenu from '../components/category/AlbumViewOptionsMenu';
import {
  ALBUM_VIEW,
  ALBUM_VIEW_GRID_CLASS,
} from '../constants/album';

import BottomNav from '../components/layout/BottomNav';
import useAlbumPhotos from '../hooks/album/useAlbumPhotos';
import useAlbumSelection from '../hooks/album/useAlbumSelection';

import AlbumSelectionActionBar from '../components/layout/AlbumSelectionActionBar';
import ConfirmModal from '../components/layout/ConfirmModal';
import { TRASH_RETENTION_DAYS } from '../constants/trash';

const AlbumDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); //이전 페이지에서 전달된 상태를 가져오기 위해 useLocation 사용
  const { categoryId } = useParams();

  // 현재 사진 뷰 크기
  const [viewOption, setViewOption] = useState(ALBUM_VIEW.DEFAULT);
  // 뷰 옵션 메뉴 표시 여부
  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);
  // 작게 뷰에서는 사진을 정사각형으로 표시
  const isSmallView = viewOption === ALBUM_VIEW.SMALL;
  
  const albumName =
    categoryId === 'all'
      ? '전체'
      : location.state?.albumName ?? '앨범';

  const {
    albumPhotos,
    visiblePhotos,
    showLikedOnly,
    setShowLikedOnly,
    removeBestPicks,
  } = useAlbumPhotos(categoryId);

  const {
    isSelectionMode,
    selectedPhotoIds,
    isPhotoSelected,
    isDeleteConfirmOpen,
    isProcessing,
    actionError,
    togglePhoto,
    toggleSelectionMode,
    handleMoveSelected,
    handleShareSelected,
    handleDeleteOpen,
    handleDeleteConfirm,
    closeDeleteConfirm,
  } = useAlbumSelection({
    photos: albumPhotos,
    categoryId,
    navigate,
    removePhotos: removeBestPicks,
  });

  const handlePhotoClick = (
    photo,
    ) => {
    // 선택 모드에서는 상세 화면 대신 선택 처리
    if (isSelectionMode) {
        togglePhoto(photo.id);
        return;
    }

    // 일반 모드에서는 사진 상세로 이동
    navigate(
        `/album/photo/${photo.id}`,
        {
        state: {
            photo,
        },
        },
    );
  };

  return (
    <main className="flex h-dvh min-h-0 flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col px-4 pt-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex size-10 shrink-0 items-center justify-center"
          aria-label="앨범 목록으로 돌아가기"
        >
          <ChevronLeft size={24} />
        </button>

        <section className="mt-4 shrink-0">
            <div className="flex items-baseline gap-2">
                <h1 className=" px-2 text-3xl font-semibold">
                {albumName}
                </h1>

                <span className="text-sm text-text-secondary">
                {albumPhotos.length}장
                </span>
            </div>
        </section>

        <div className="mt-4 flex shrink-0 items-center justify-between">
            <button
                type="button"
                onClick={() =>
                setShowLikedOnly((previous) => !previous)
                }
                aria-pressed={showLikedOnly}
                className={`flex px-4 py-2 items-center justify-center rounded-full border border-border ${
                showLikedOnly
                    ? 'bg-primary text-background'
                    : 'bg-background text-text-primary'
                }`}
            >
                <Heart
                size={16}
                />
            </button>

            <div className="flex items-center gap-2">
                <div className="relative">
                    <button
                        type="button"
                        onClick={() =>
                        setIsViewMenuOpen(
                            (previous) => !previous,
                        )
                        }
                        className="flex items-center justify-center rounded-full border border-border px-4 py-2"
                        aria-label="뷰 옵션"
                        aria-expanded={isViewMenuOpen}
                    >
                        <SlidersHorizontal size={17} />
                    </button>

                    {isViewMenuOpen && (
                        <AlbumViewOptionsMenu
                        selectedOption={viewOption}
                        onSelect={(option) => {
                            // 사진 크기 변경 후 메뉴 닫기
                            setViewOption(option);
                            setIsViewMenuOpen(false);
                        }}
                        onClose={() =>
                            setIsViewMenuOpen(false)
                        }
                        />
                    )}
                </div>

                <button
                    type="button"
                    onClick={toggleSelectionMode}
                    aria-pressed={isSelectionMode}
                    className={`rounded-full border border-border px-3.5 py-1.5 text-sm ${
                    isSelectionMode
                        ? 'bg-primary text-background'
                        : 'bg-background'
                    }`}
                >
                    {isSelectionMode
                        ? '선택 해제'
                        : '선택'}
                </button>
            </div>
        </div>
    
        {/* 사진 카드 영역만 스크롤 */}
        <div className="mt-5 min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain pb-28">
          <section
            className={ALBUM_VIEW_GRID_CLASS[viewOption]}
          >
            {visiblePhotos.map((photo) => {
                const isSelected =
                isPhotoSelected(photo.id);

                return (
                <button
                    key={photo.id}
                    type="button"
                    data-thumbnail="true"
                    onClick={() =>
                    handlePhotoClick(photo)
                    }
                    aria-pressed={
                    isSelectionMode
                        ? isSelected
                        : undefined
                    }
                    className={`relative block w-full break-inside-avoid overflow-hidden ${
                        isSmallView
                            ? 'mb-0.5 aspect-square rounded-lg'
                            : 'mb-1 rounded-xl'
                    }`}
                >
                    <img
                    src={photo.imageUrl}
                    crossOrigin="anonymous"
                    alt={`${photo.categoryName} 베스트픽`}
                    className={
                        isSmallView
                            ? 'absolute inset-0 h-full w-full object-cover'
                            : 'block h-auto w-full object-cover'
                    }
                    />

                    {/* 선택된 사진에 흰색 배경 표시 */}
                    {isSelected && (
                    <span className="pointer-events-none absolute inset-0 bg-background/50" />
                    )}

                    {/* 선택된 사진에 체크 표시 */}
                    {isSelected && (
                    <span className="pointer-events-none absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-primary text-background">
                        <Check
                        size={12}
                        strokeWidth={4}
                        />
                    </span>
                    )}

                    {/* 좋아요 표시 */}
                    {photo.isLiked && (
                    <span className={`pointer-events-none absolute text-background/90 ${
                        isSmallView
                            ? 'bottom-1.5 left-1.5'
                            : 'bottom-3 left-3'
                    }`}>
                        <Heart
                        size={17}
                        fill="currentColor"
                        />
                    </span>
                    )}
                </button>
                );
            })}
          </section>
        </div>
      </div>

      {isSelectionMode ? (
        <AlbumSelectionActionBar
            selectedCount={
            selectedPhotoIds.length
            }
            isProcessing={isProcessing}
            onShare={handleShareSelected}
            onMove={handleMoveSelected}
            onDelete={handleDeleteOpen}
        />
      ) : (
        <BottomNav activeTab="album" />
      )}

      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        title={`${selectedPhotoIds.length}장을 삭제할까요?`}
        description={`삭제한 사진은 휴지통에서 ${TRASH_RETENTION_DAYS.bestPick}일 동안 보관돼요.`}
        error={actionError}
        confirmLabel="삭제하기"
        isConfirming={isProcessing}
        onClose={closeDeleteConfirm}
        onConfirm={handleDeleteConfirm}
      />

      {actionError &&
        !isDeleteConfirmOpen && (
            <p
            role="alert"
            className="mt-3 text-center text-xs text-error"
            >
            {actionError}
            </p>
      )}
    </main>
  );
};

export default AlbumDetailPage;
