import { useNavigate } from 'react-router';

import { getLocalDateString } from '../../utils/date';

const HomeBestPicks = ({
  selectedDate,
  bestPicks,
}) => {
  const navigate = useNavigate();

  const formattedDate = selectedDate
    ? selectedDate
        .split('-')
        .slice(1) //1번 인덱스부터(월부터)
        .map(Number) //문자열을 숫자로 ->0제거 
        .join('/')
    : '';

  const isToday = selectedDate === getLocalDateString();

  return (
    <section className="mt-3">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-base font-bold">
          Best Picks
        </h2>

        {selectedDate && (
          <p className="text-[14px] font-medium text-text-primary">
            {formattedDate}
          </p>
        )}
      </div>

      {bestPicks.length > 0 ? (
        <div className="mt-3 flex gap-1 overflow-x-auto pb-2">
          {bestPicks.map((photo) => (
            <button
              key={photo.id}
              type="button"
              data-thumbnail="true"
              onClick={() =>
                navigate(
                  `/album/photo/${photo.id}`,
                  {
                    state: {
                      photo,
                    },
                  },
                )
              }
              className="aspect-square w-24 shrink-0 overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-border"
            >
              <img
                src={photo.imageUrl}
                alt={`${photo.categoryName} 베스트픽`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-3 flex p-5 items-center justify-between gap-4 rounded-2xl bg-surface px-5">
          <div className={isToday ? 'text-left' : 'w-full text-center'}>
            <p className="text-sm font-semibold text-text-primary">
              {isToday
                ? '오늘의 Best Pick이 아직 없어요.'
                : '이 날짜에 기록된 Best Pick이 없어요.'}
            </p>

            {isToday && (
              <p className="mt-2 text-xs text-text-secondary">
                오늘을 기록해보세요!
              </p>
            )}
          </div>

          {isToday && (
            <button
              type="button"
              onClick={() => navigate('/category')}
              className="shrink-0 whitespace-nowrap rounded-2xl bg-primary px-3 py-3 text-sm font-semibold text-background"
            >
              사진 촬영하기
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default HomeBestPicks;
