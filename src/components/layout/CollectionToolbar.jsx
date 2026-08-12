import {
  Plus,
  Search,
  SlidersHorizontal,
} from 'lucide-react';

const CollectionToolbar = ({
  selectLabel = '선택',
  onSelectClick,
  onSortClick,
  onSearchClick,
}) => {
  return (
    <div className="mt-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button
            type="button"
            onClick={onSelectClick}
            className={`flex items-center justify-center rounded-full border border-border ${
                selectLabel === '+'
                ? 'px-4 py-2'
                : 'px-3.5 py-1.5 text-sm'
            }`}
            aria-label={
                selectLabel === '+'
                ? '앨범 추가'
                : selectLabel
            }
            >
            {selectLabel === '+' ? (
                <Plus
                size={16}
                />
            ) : (
                selectLabel
            )}
        </button>

        <button
          type="button"
          onClick={onSortClick}
          className="flex px-4 py-2 items-center justify-center rounded-full border border-border"
          aria-label="정렬 기준"
        >
          <SlidersHorizontal size={16} />
        </button>
      </div>

      <button
        type="button"
        onClick={onSearchClick}
        className="flex size-10 items-center justify-center rounded-full border border-border text-primary"
        aria-label="검색"
      >
        <Search size={19} />
      </button>
    </div>
  );
};

export default CollectionToolbar;
