import { Link } from 'react-router';
import { House, Menu, Camera, Image } from 'lucide-react';

const HomePage = () => {
  
  return (
    <main className="flex min-h-dvh flex-col">
        <div className="flex-1 px-4 pt-6">
            <header className="flex items-center justify-between px-2">
                <h1 className="text-3xl font-logo tracking-tight">
                PicCup
                </h1>

                <button
                type="button"
                className="flex size-10 items-center justify-center"
                aria-label="메뉴 열기"
                >
                <Menu size={24} />
                </button>
            </header>
            
            <nav className="pointer-events-none fixed inset-x-0 bottom-8 z-50 mx-auto flex w-full max-w-md items-center justify-between px-10">
              <button
                type="button"
                className="pointer-events-auto flex size-14 items-center justify-center rounded-full bg-white/95 shadow-lg ring-1 ring-black/5"
                aria-label="앨범"
              >
                <Image size={24} />
              </button>

              <Link
                to="/"
                className="pointer-events-auto flex h-14 w-28 items-center justify-center rounded-full bg-primary/95 text-white shadow-lg ring-1 ring-black/5"
                aria-label="홈"
              >
                <House size={24} />
              </Link>

              <Link
                to="/category"
                className="pointer-events-auto flex size-14 items-center justify-center rounded-full bg-white/95 shadow-lg ring-1 ring-black/5"
                aria-label="카메라 촬영 플로우"
              >
                  <Camera size={24}/>
              </Link>
            </nav>
        </div>
    </main>
  );
};

export default HomePage;