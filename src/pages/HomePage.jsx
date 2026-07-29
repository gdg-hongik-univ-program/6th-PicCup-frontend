import { Link } from 'react-router';
import { House, Menu, Camera, Image, ChevronLeft, ChevronRight } from 'lucide-react';

const WEEKDAYS = ['월', '화', '수', '목', '금', '토', '일'];

const CALENDAR_DAYS = [
  null,
  null,
  ...Array.from({ length: 31 }, (_, index) => index + 1),
];

const CALENDAR_PHOTOS = {
  3: '/images/cat.jpg',
  4: '/images/landscape.jpg',
  5: '/images/friend.webp',
  8: '/images/dokyo.webp',
  10: '/images/friends.jpg',
  12: '/images/friend.webp',
  15: '/images/landscape.jpg',
  16: '/images/dokyo.webp',
  18: '/images/cat.jpg',
  20: '/images/friends.jpg',
  22: '/images/landscape.jpg',
  24: '/images/friend.webp',
};

const BEST_PICKS = [
  '/images/dokyo.webp',
  '/images/landscape.jpg',
  '/images/friend.webp',
  '/images/friends.jpg',
];

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

            <section className="mt-7 rounded-2xl ring-2 ring-gray-100 bg-background p-1 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-end gap-2 px-3 pt-3">
                  <h2 className="text-2xl font-bold">
                    7월
                  </h2>
                  <p className="pb-1 text-sm text-text-primary">
                    2026년
                  </p>
                </div>

                <div className="flex items-center gap-1 px-2">
                  <button
                    type="button"
                    className="flex size-8 items-center justify-center rounded-lg active:bg-primary-soft"
                    aria-label="이전 달"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <button
                    type="button"
                    className="flex size-8 items-center justify-center rounded-lg active:bg-primary-soft"
                    aria-label="다음 달"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
              <div className="mt-3 px-1">
                <div className="grid grid-cols-7 gap-0.5">
                  {WEEKDAYS.map((weekday) => (
                    <p
                      key={weekday}
                      className="py-1 text-center text-sm font-semibold text-text-secondary"
                    >
                      {weekday}
                    </p>
                  ))}

                  {CALENDAR_DAYS.map((day, index) => {
                    const photoUrl = CALENDAR_PHOTOS[day];

                    return (
                      <div
                        key={`${day}-${index}`}
                        className={`relative aspect-[3/4] overflow-hidden rounded-lg ${
                          day ? 'bg-surface' : 'bg-transparent'
                        }`}
                      >
                        {photoUrl && (
                          <>
                            <img
                              src={photoUrl}
                              alt={`${day}일 베스트픽`}
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/10" />
                          </>
                        )}

                        {day && (
                          <span
                            className={`absolute bottom-1 right-1.5 text-[14px] font-normal ${
                              photoUrl
                                ? 'text-white/90'
                                : 'text-text-disabled'
                            }`}
                          >
                            {day}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <p className="px-2 pt-3 pb-2 text-[14px] font-medium text-text-secondary">
                이번 달에 총 12일 기록했어요.
              </p>
            </section>

            <section className="mt-4">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-base font-bold">
                  Best Pick
                </h2>
                <p className="text-[14px] text-text-primary">
                  7월 24일
                </p>
              </div>

              <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                {BEST_PICKS.map((photoUrl, index) => (
                  <button
                    key={photoUrl}
                    type="button"
                    className="aspect-square w-24 shrink-0 overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-border"
                  >
                    <img
                      src={photoUrl}
                      alt={`베스트픽 ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </section>
          </div>
            
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
    </main>
  );
};

export default HomePage;