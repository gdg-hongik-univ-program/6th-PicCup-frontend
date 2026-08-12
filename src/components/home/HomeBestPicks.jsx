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
    <section className="mt-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-base font-bold">
          Best Picks
        </h2>

        {selectedDate && (
          <p className="text-[14px] text-text-primary">
            {formattedDate}
          </p>
        )}
      </div>

      {bestPicks.length > 0 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
          {bestPicks.map((photo) => (
            <button
              key={photo.id}
              type="button"
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
        <div className="mt-3 flex h-28 flex-col items-center justify-center gap-3 rounded-2xl bg-surface">
          <p className="text-sm text-text-secondary">
            {isToday
              ? '오늘 촬영된 베스트픽이 아직 없어요.'
              : '이 날짜에 기록된 베스트픽이 없어요.'}
          </p>

          {isToday && (
            <button
              type="button"
              onClick={() => navigate('/category')}
              className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white"
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