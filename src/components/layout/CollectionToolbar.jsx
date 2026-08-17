import {
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';

import { useState } from 'react';

import CategorySortMenu from '../category/CategorySortMenu';

const CollectionToolbar = ({
  selectLabel = '선택',
  searchQuery = '',
  searchPlaceholder = '카테고리를 검색해 보세요!',
  isSearchOpen = false,
  sortOption,
  onSelectClick,
  onSortChange,
  onSearchClick,
  onSearchChange,
  onSearchClose,
}) => {
  // 정렬 팝오버 표시 여부
  const [isSortOpen, setIsSortOpen] = useState(false);
  // 검색 버튼을 누르면 툴바 대신 검색창 표시
  if (isSearchOpen) {
    return (
      <div className="relative mt-4 -mb-1">
        <input
          autoFocus
          type="text"
          inputMode="search"
          value={searchQuery}
          onChange={(event) =>
            onSearchChange?.(event.target.value)
          }
          onKeyDown={(event) => {
            // Esc 키로 검색 종료
            if (event.key === 'Escape') {
              onSearchClose?.();
            }
          }}
          placeholder={searchPlaceholder}
          className="h-11 w-full rounded-2xl border border-border bg-white px-4 pr-20 text-sm outline-none placeholder:text-gray-300 focus:border-primary"
        />

        {/* 검색 종료 및 검색어 초기화 */}
        <button
          type="button"
          onClick={onSearchClose}
          className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-text-secondary active:bg-gray-100"
          aria-label="검색 닫기"
        >
          <X size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 mb-1 flex items-center justify-between">
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
            <Plus size={16} />
          ) : (
            selectLabel
          )}
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setIsSortOpen((previous) => !previous)
            }
            className="flex items-center justify-center rounded-full border border-border px-4 py-2"
            aria-label="정렬 기준"
            aria-expanded={isSortOpen}
          >
            <SlidersHorizontal size={16} />
          </button>

          {isSortOpen && (
            <CategorySortMenu
              selectedOption={sortOption}
              onSelect={(option) => {
                // 선택한 정렬 기준 적용
                onSortChange?.(option);
                setIsSortOpen(false);
              }}
              onClose={() => setIsSortOpen(false)}
            />
          )}
        </div>
      </div>

      {/* 카테고리 검색 열기 */}
      <button
        type="button"
        onClick={()=>{
          setIsSortOpen(false);
          onSearchClick?.();
        }}
        className="flex size-10 items-center justify-center rounded-full border border-border text-primary"
        aria-label="검색"
      >
        <Search size={19} />
      </button>
    </div>
  );
};

export default CollectionToolbar;