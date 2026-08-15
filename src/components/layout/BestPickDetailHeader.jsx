import {
  ChevronLeft,
  Ellipsis,
} from 'lucide-react';
import { formatCapturedDate } from '../../utils/date';

const BestPickDetailHeader = ({
  capturedDate,
  isMenuOpen,
  onBack,
  onToggleMenu,
  onCloseMenu,
  onMove,
  onDelete,
}) => {
  return (
    <>
      <header className="flex items-center justify-between px-4 py-5">
        <button
          type="button"
          onClick={onBack}
          className="flex size-11 items-center justify-center rounded-full bg-white shadow-md"
          aria-label="앨범으로 돌아가기"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="rounded-full bg-white px-6 py-3 text-sm font-semibold shadow-md">
          {formatCapturedDate(capturedDate)}
        </div>

        <div className="relative z-50">
          <button
            type="button"
            onClick={onToggleMenu}
            className="flex size-11 items-center justify-center rounded-full bg-white shadow-md"
            aria-label="사진 메뉴"
            aria-expanded={isMenuOpen}
          >
            <Ellipsis size={22} />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-14 w-36 overflow-hidden rounded-2xl border border-border bg-white shadow-lg">
              <button
                type="button"
                onClick={onMove}
                className="w-full px-4 py-3 text-left text-sm active:bg-gray-100"
              >
                다른 앨범으로 이동
              </button>

              <div className="border-t border-border" />

              <button
                type="button"
                onClick={onDelete}
                className="w-full px-4 py-3 text-left text-sm text-error active:bg-gray-100"
              >
                삭제하기
              </button>
            </div>
          )}
        </div>
      </header>

      {isMenuOpen && (
        <button
          type="button"
          onClick={onCloseMenu}
          className="fixed inset-0 z-40"
          aria-label="사진 메뉴 닫기"
        />
      )}
    </>
  );
};

export default BestPickDetailHeader;
