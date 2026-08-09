import {
  EllipsisVertical,
  Plus,
} from 'lucide-react';

const CategoryGrid = ({
  categories,
  leadingType,
  onLeadingClick,
  onCategoryClick,
  onCategoryMenuClick,
}) => {
  const totalBestPickCount = categories.reduce(
    (total, category) =>
      total + (category.bestPickCount ?? 0),
    0,
  ); //카테고리별 bestPickCount 합계

  const allAlbumCover = categories.find(
    (category) => category.coverImageUrl,
  )?.coverImageUrl;

  return (
    <section className="mt-4 grid grid-cols-3 gap-1">
      {leadingType === 'add' ? (
        <button
          type="button"
          onClick={onLeadingClick}
          className="flex aspect-square items-center justify-center rounded-2xl border-2 border-border bg-gray-50 text-text-secondary"
          aria-label="카테고리 추가"
        >
          <Plus size={24} />
        </button>
      ) : (
        <button
          type="button"
          onClick={onLeadingClick}
          className="relative aspect-square overflow-hidden rounded-2xl bg-gray-200 text-left"
        >
          {allAlbumCover && (
            <img
              src={allAlbumCover}
              alt=""
              className="h-full w-full object-cover"
            />
          )}

          <div className="absolute inset-0 bg-black/30" />

          <div className="absolute inset-x-0 bottom-0 p-3 text-white">
            <p className="text-xs opacity-80">
              {totalBestPickCount}장
            </p>

            <p className="text-lg font-semibold">
              전체
            </p>
          </div>
        </button>
      )}

      {categories.map((category) => (
        <div
          key={category.id}
          className="relative aspect-square overflow-hidden rounded-2xl bg-gray-200"
        >
          <button
            type="button"
            onClick={() => onCategoryClick(category)}
            className="h-full w-full text-left"
          >
            {category.coverImageUrl && (
              <img
                src={category.coverImageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            )}

            <div className="absolute inset-0 bg-black/30" />

            <div className="absolute inset-x-0 bottom-0 p-3 text-white">
              {category.bestPickCount != null && (
                <p className="text-xs opacity-80">
                  {category.bestPickCount}장
                </p>
              )}

              <p className="truncate text-lg font-semibold">
                {category.name}
              </p>
            </div>
          </button>

          {!category.isDefault && (
            <button
              type="button"
              onClick={() =>
                onCategoryMenuClick?.(category)
              }
              className="absolute right-1.5 top-3 z-10 flex size-8 items-center justify-center rounded-full text-white active:bg-gray-500/50"
              aria-label={`${category.name} 메뉴`}
            >
              <EllipsisVertical size={20} />
            </button>
          )}
        </div>
      ))}
    </section>
  );
};

export default CategoryGrid;