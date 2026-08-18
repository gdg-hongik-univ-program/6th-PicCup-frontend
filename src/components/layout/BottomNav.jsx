import { Camera, House, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router';
import clsx from 'clsx';

const NAV_ITEMS = [
  { key: 'album', to: '/album', icon: ImageIcon, label: '앨범', wide: false },
  { key: 'home', to: '/', icon: House, label: '홈', wide: true },
  { key: 'camera', to: '/category', icon: Camera, label: '카메라 촬영', wide: false },
];

const BottomNav = ({ activeTab = 'default' }) => {
  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-8 z-50 mx-auto flex w-full max-w-md items-center justify-between px-10">
      {NAV_ITEMS.map(({ key, to, icon: Icon, label, wide }) => (
        <Link
          key={key}
          to={to}
          aria-label={label}
          className={clsx(
            'pointer-events-auto flex items-center justify-center rounded-full shadow-lg ring-1 ring-text-primary/5 transition active:scale-95',
            wide ? 'h-14 w-28' : 'size-14',
            activeTab === key
              ? 'bg-primary/95 text-background active:bg-primary-pressed'
              : 'bg-background/95 active:bg-gray-100'
          )}
        >
          <Icon size={24} />
        </Link>
      ))}
    </nav>
  );
};
export default BottomNav;
