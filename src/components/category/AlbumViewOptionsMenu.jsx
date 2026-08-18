import { Check } from 'lucide-react';

import {
  ALBUM_VIEW_OPTIONS,
} from '../../constants/album';

const AlbumViewOptionsMenu = ({
  selectedOption,
  onSelect,
  onClose,
}) => {
  return (
    <>
      {/* 메뉴 외부를 누르면 닫기 */}
      <div
        className="fixed inset-0 z-20"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="menu"
        className="absolute right-0 top-0 z-30 w-24 overflow-hidden rounded-xl border border-border bg-background py-2 shadow-lg"
      >
        <p className="px-3 pb-1 text-xs font-semibold">
          뷰 옵션
        </p>

        {ALBUM_VIEW_OPTIONS.map((option) => {
          const isSelected =
            option.value === selectedOption;

          return (
            <button
              key={option.value}
              type="button"
              role="menuitem"
              onClick={() =>
                onSelect(option.value)
              }
              className="flex w-full items-center justify-between px-3 py-2 text-sm active:bg-gray-100"
            >
              <span>{option.label}</span>

              {isSelected && (
                <Check
                  size={14}
                  strokeWidth={2.5}
                />
              )}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default AlbumViewOptionsMenu;
