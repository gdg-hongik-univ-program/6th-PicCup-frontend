import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { getCalendarDays } from '../../utils/date';

const WEEKDAYS = [
  '일',
  '월',
  '화',
  '수',
  '목',
  '금',
  '토',
];

const HomeCalendar = ({
  currentMonth,
  calendarPhotoByDate,
  selectedDate,
  recordedDayCount,
  isLoading,
  calendarError,
  onPreviousMonth,
  onNextMonth,
  onDateSelect,
}) => {
  const year = currentMonth.getFullYear();
  const monthIndex = currentMonth.getMonth();

  const calendarDays = getCalendarDays(
    year,
    monthIndex,
  );

  const month = String(
    monthIndex + 1,
  ).padStart(2, '0'); //08월

  return (
    <section className="mt-6 rounded-2xl bg-background p-1 shadow-lg ring-2 ring-gray-100">
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
            onClick={onPreviousMonth}
            className="flex size-8 items-center justify-center rounded-lg active:bg-primary-soft"
            aria-label="이전 달"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            onClick={onNextMonth}
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
            if (!day) {
              return (
                <div
                  key={`empty-${index}`}
                  className="aspect-[3/4]"
                />
              );
            }

            const dayString = String(day).padStart(
              2,
              '0',
            ); //03일

            const dateKey = //달력날짜와 사진 데이터 연결
              `${year}-${month}-${dayString}`;

            const photo = calendarPhotoByDate[dateKey]; //이 날짜에 사진있는가?
            const isSelected = selectedDate === dateKey; //현재 선택한 날짜인지 확인

            return (
              <button
                key={dateKey}
                type="button"
                disabled={!photo}
                onClick={() =>
                  onDateSelect(dateKey)
                }
                aria-label={
                  photo
                    ? `${monthIndex + 1}월 ${day}일 베스트픽 보기`
                    : `${monthIndex + 1}월 ${day}일`
                }
                aria-pressed={isSelected}
                className={`relative aspect-[4/5] overflow-hidden rounded-lg bg-surface ${
                  isSelected
                    ? 'ring-2 ring-primary'
                    : ''
                }`}
              >
                {photo && (
                  <>
                    <img
                      src={photo.imageUrl}
                      alt={`${day}일 베스트픽`}
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/10" />
                  </>
                )}

                <span
                  className={`absolute bottom-1 right-1.5 text-[14px] font-normal ${
                    photo
                      ? 'text-white/90'
                      : 'text-text-disabled'
                  }`}
                >
                  {day}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <p
        className={`flex p-2 items-center overflow-hidden px-2 text-[14px] font-medium ${
          calendarError
            ? 'text-error'
            : 'text-text-secondary'
        }`}
      >
        {calendarError
          ? calendarError
          : isLoading
            ? '사진을 불러오는 중이에요.'
            : `이번 달에 총 ${recordedDayCount}일 기록했어요.`}
      </p>
    </section>
  );
};

export default HomeCalendar;