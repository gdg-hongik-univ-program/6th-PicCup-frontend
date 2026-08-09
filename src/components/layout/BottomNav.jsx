import { Camera, House, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router';

const defaultButtonClass =
  'pointer-events-auto flex size-14 items-center justify-center rounded-full bg-white/95 shadow-lg ring-1 ring-black/5';

const activeButtonClass =
  'pointer-events-auto flex size-14 items-center justify-center rounded-full bg-primary/95 text-white shadow-lg ring-1 ring-black/5';

const defaultHomeClass =
  'pointer-events-auto flex h-14 w-28 items-center justify-center rounded-full bg-white/95 shadow-lg ring-1 ring-black/5 ';

const activeHomeClass =
  'pointer-events-auto flex h-14 w-28 items-center justify-center rounded-full bg-primary/95 text-white shadow-lg ring-1 ring-black/5';

const BottomNav = ({ activeTab = null }) => {
  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-8 z-50 mx-auto flex w-full max-w-md items-center justify-between px-10">
      <Link
        to="/album"
        className={
          activeTab === 'album'
            ? activeButtonClass
            : defaultButtonClass
        }
        aria-label="앨범"
      >
        <ImageIcon size={24} />
      </Link>

      <Link
        to="/"
        className={
          activeTab === 'home'
            ? activeHomeClass
            : defaultHomeClass
        }
        aria-label="홈"
      >
        <House size={24} />
      </Link>

      <Link
        to="/category"
        className={
          activeTab === 'camera'
            ? activeButtonClass
            : defaultButtonClass
        }
        aria-label="카메라 촬영"
      >
        <Camera size={24} />
      </Link>
    </nav>
  );
};

export default BottomNav;