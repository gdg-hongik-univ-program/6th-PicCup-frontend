import { Menu } from 'lucide-react';

const AppHeader = ({ onMenuClick }) => {
  return (
    <header className="flex items-center justify-between px-2">
      <h1 className="text-3xl font-logo tracking-tight">
        PicCup
      </h1>

      <button
        type="button"
        onClick={onMenuClick}
        className="flex size-10 items-center justify-center"
        aria-label="메뉴 열기"
      >
        <Menu size={24} />
      </button>
    </header>
  );
};

export default AppHeader;