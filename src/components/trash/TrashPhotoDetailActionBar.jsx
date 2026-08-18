import {
  RotateCcw,
  Trash2,
} from 'lucide-react';

const TrashPhotoDetailActionBar = ({
  activeTab,
  isProcessing,
  onRestore,
  onDelete,
}) => {
  const restoreLabel =
    activeTab === 'rejected'
      ? '앨범에 추가'
      : '복구하기';

  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 mx-auto flex w-full max-w-md items-center justify-between bg-background px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
      <button
        type="button"
        onClick={onDelete}
        disabled={isProcessing}
        aria-busy={isProcessing}
        className="flex size-12 items-center justify-center rounded-full bg-background text-text-primary shadow-md disabled:opacity-40"
        aria-label="영구 삭제"
      >
        <Trash2 size={20} />
      </button>

      <button
        type="button"
        onClick={onRestore}
        disabled={isProcessing}
        aria-busy={isProcessing}
        className="flex size-12 items-center justify-center rounded-full bg-background text-text-primary shadow-md disabled:opacity-40"
        aria-label={restoreLabel}
      >
        <RotateCcw size={20} />
      </button>
    </footer>
  );
};

export default TrashPhotoDetailActionBar;
