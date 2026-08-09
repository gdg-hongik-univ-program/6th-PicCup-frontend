import { Menu, Trash2 } from 'lucide-react';

const AppHeader = ({
  onMenuClick,
  showTrash = false,
  onTrashClick,
}) => {
  return (
    <header className="flex items-center justify-between px-2">
      <h1 className="font-logo text-3xl tracking-tight">
        PicCup
      </h1>

      <div className="flex items-center gap-1">
        {showTrash && (
          <button
            type="button"
            onClick={onTrashClick}
            className="flex size-10 items-center justify-center"
            aria-label="휴지통"
          >
            <Trash2 size={21} />
          </button>
        )}

        <button
          type="button"
          onClick={onMenuClick}
          className="flex size-10 items-center justify-center"
          aria-label="메뉴 열기"
        >
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
};

export default AppHeader;