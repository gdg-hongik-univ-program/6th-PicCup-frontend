import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getCalendarDays } from '../../utils/date';

const WEEKDAYS = ['월', '화', '수', '목', '금', '토', '일'];

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

const HomeCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(() => { //현재 보고 있는 달
    const today = new Date();

    return new Date(today.getFullYear(), today.getMonth(), 1); //현재 시간이 포함된 달의 1일
  });
  const year = currentMonth.getFullYear();
  const monthIndex = currentMonth.getMonth();
  const calendarDays = getCalendarDays(year, monthIndex);

  const handlePreviousMonth = () => {
    setCurrentMonth(
      (previous) =>
        new Date(previous.getFullYear(), previous.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      (previous) =>
        new Date(previous.getFullYear(), previous.getMonth() + 1, 1),
    );
  };

  return (
    <section className="mt-6 rounded-2xl ring-2 ring-gray-100 bg-background p-1 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-end gap-2 px-3 pt-3">
          <h2 className="text-2xl font-bold">
            {monthIndex + 1}월
          </h2>
          <p className="pb-1 text-sm text-text-primary">
            {year}년
          </p>
        </div>

        <div className="flex items-center gap-1 px-2">
          <button
            type="button"
            onClick={handlePreviousMonth}
            className="flex size-8 items-center justify-center rounded-lg active:bg-primary-soft"
            aria-label="이전 달"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            onClick={handleNextMonth}
            className="flex size-8 items-center justify-center rounded-lg active:bg-primary-soft"
            aria-label="다음 달"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div className="mt-2 px-1">
        <div className="grid grid-cols-7 gap-0.5">
          {WEEKDAYS.map((weekday) => (
            <p
              key={weekday}
              className="py-1 text-center text-sm font-semibold text-text-secondary"
            >
              {weekday}
            </p>
          ))}

          {calendarDays.map((day, index) => {
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
  );
};

export default HomeCalendar;
