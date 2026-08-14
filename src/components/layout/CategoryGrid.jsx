import {
  Check,
  EllipsisVertical,
  Plus,
} from 'lucide-react';

const CategoryGrid = ({
  categories,
  leadingType,
  showBestPickCount = false,
  selectedCategoryId = null,
  className='',
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
    <section className={`mt-4 grid grid-cols-3 gap-1 ${className}`}>
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
            {showBestPickCount && (
                <p className="text-xs opacity-80">
                    {totalBestPickCount}장
                </p>
            )}

            <p className="text-lg font-semibold">
              전체
            </p>
          </div>
        </button>
      )}

      {categories.map((category) => {
        const isSelected =
          String(selectedCategoryId) === String(category.id);

        return (
          <div
            key={category.id}
            className="relative aspect-square overflow-hidden rounded-2xl bg-white"
          >
            <button
              type="button"
              onClick={() => onCategoryClick(category)}
              className="h-full w-full text-left"
              aria-pressed={isSelected}
            >
              {category.coverImageUrl && (
                <img
                  src={category.coverImageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              )}

              <div className="absolute inset-0 bg-black/30" />

              {isSelected && (
                <div className="absolute inset-0 bg-background/40" />
              )}

              <div className="absolute inset-x-0 bottom-0 z-10 p-3 text-background">
                {showBestPickCount &&
                  category.bestPickCount != null && (
                    <p className="text-xs opacity-80">
                      {category.bestPickCount}장
                    </p>
                  )}

                <p className="truncate text-lg font-semibold">
                  {category.name}
                </p>
              </div>

              {isSelected && (
                <span className="absolute right-2.5 top-2.5 z-20 flex size-5 items-center justify-center rounded-full bg-primary text-white">
                  <Check
                    size={12}
                    strokeWidth={4}
                  />
                </span>
              )}
            </button>

            {!category.isDefault && onCategoryMenuClick && (
              <button
                type="button"
                onClick={() =>
                  onCategoryMenuClick(category)
                }
                className="absolute right-1.5 top-3 z-10 flex size-8 items-center justify-center rounded-full text-white active:bg-gray-500/50"
                aria-label={`${category.name} 메뉴`}
              >
                <EllipsisVertical size={20} />
              </button>
            )}
          </div>
        );
      })}
    </section>
  );
};

export default CategoryGrid;
