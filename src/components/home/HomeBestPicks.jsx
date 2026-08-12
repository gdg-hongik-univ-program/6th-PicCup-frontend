const BEST_PICKS = [
  '/images/dokyo.webp',
  '/images/landscape.jpg',
  '/images/friend.webp',
  '/images/friends.jpg',
];

const HomeBestPicks = () => {
  return (
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
  );
};

export default HomeBestPicks;
