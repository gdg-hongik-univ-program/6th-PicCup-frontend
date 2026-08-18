const TrashActionBar = ({
  activeTab,
  selectedCount,
  isProcessing,
  onPrimaryAction,
  onPermanentDelete,
}) => {
  return (
    <footer className="fixed inset-x-0 bottom-5 z-50 mx-auto flex w-full max-w-md flex-col items-center gap-2 px-4">
      {/* 선택된 사진이 있을 때만 장수 표시 */}
      {selectedCount > 0 && (
        <p className="rounded-full bg-background px-4 py-2 mb-2 text-xs font-medium text-text-secondary shadow-md ring-1 ring-border">
          {selectedCount}장 선택됨
        </p>
      )}
      <div className="grid w-full grid-cols-2 gap-2">
        <button
          type="button"
          disabled={
            selectedCount === 0 ||
            isProcessing
          }
          aria-busy={isProcessing}
          onClick={onPrimaryAction}
          className="h-12 rounded-xl bg-primary font-medium text-background shadow-lg"
        >
          {activeTab === 'rejected'
            ? '앨범에 추가'
            : '복구하기'}
        </button>

        <button
          type="button"
          disabled={
            selectedCount === 0 ||
            isProcessing
          }
          aria-busy={isProcessing}
          onClick={onPermanentDelete}
          className="h-12 rounded-xl bg-gray-50 font-medium text-error shadow-lg ring-1 ring-border disabled:text-error/40"
        >
          영구 삭제
        </button>
      </div>
    </footer>
  );
};

export default TrashActionBar;
