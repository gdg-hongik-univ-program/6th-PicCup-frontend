import { TRASH_RETENTION_DAYS } from '../../constants/trash';

const TrashToolbar = ({
  activeTab,
  isSelectionMode,
  selectedCount,
  photoCount,
  onToggleSelectionMode,
}) => {
  return (
    <div className="mt-4 flex items-center justify-between px-1">
      <div>
        <p className="text-xs text-text-secondary">
          {activeTab === 'rejected'
            ? `${TRASH_RETENTION_DAYS.rejected}일 이내 자동 삭제`
            : `${TRASH_RETENTION_DAYS.bestPick}일 이내 자동 삭제`}
        </p>

        {isSelectionMode && (
          <p className="mt-1 text-xs font-semibold text-primary">
            {selectedCount}장 선택
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onToggleSelectionMode}
        disabled={photoCount === 0}
        className="rounded-full border border-border px-3 py-1.5 text-xs disabled:opacity-40"
      >
        {isSelectionMode
          ? '선택 해제'
          : '선택'}
      </button>
    </div>
  );
};

export default TrashToolbar;
