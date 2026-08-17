import {
  Share2,
  Trash2,
} from 'lucide-react';

const AlbumSelectionActionBar = ({
  selectedCount,
  isProcessing,
  onShare,
  onMove,
  onDelete,
}) => {
  const isDisabled =
    selectedCount === 0 ||
    isProcessing;

  return (
    <footer className="fixed inset-x-0 bottom-4 z-40 mx-auto w-full max-w-md bg-background px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2">

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onShare}
          disabled={isDisabled}
          className="flex size-14 items-center justify-center rounded-full bg-background/90 shadow-md disabled:opacity-40"
          aria-label="선택한 사진 공유"
        >
          <Share2 size={22} />
        </button>

        <button
            type="button"
            onClick={onMove}
            disabled={isDisabled}
            className="flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-full bg-background/90 px-7 py-2 shadow-md disabled:opacity-40"
        >
            {/* 선택된 사진 장수 */}
            <span className="text-xs font-normal text-text-secondary">
                선택한 {selectedCount}장
            </span>

            <span className="text-sm font-semibold">
                다른 앨범으로 이동
            </span>
        </button>

        <button
          type="button"
          onClick={onDelete}
          disabled={isDisabled}
          className="flex size-14 items-center justify-center rounded-full bg-background/90 shadow-md disabled:opacity-40"
          aria-label="선택한 사진 삭제"
        >
          <Trash2 size={22} />
        </button>
      </div>
    </footer>
  );
};

export default AlbumSelectionActionBar;