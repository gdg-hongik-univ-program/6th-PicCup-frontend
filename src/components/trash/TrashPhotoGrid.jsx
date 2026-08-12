import { Check } from 'lucide-react';

const TrashPhotoGrid = ({
  activeTab,
  photos,
  isSelectionMode,
  getPhotoKey,
  isPhotoSelected,
  onTogglePhoto,
}) => {
  return (
    <section className="mt-4 grid grid-cols-3 gap-1">
      {photos.map((photo) => {
        const photoKey = getPhotoKey(photo);

        const isSelected =
          isPhotoSelected(photo);

        return (
          <button
            key={photoKey}
            type="button"
            onClick={() => {
              if (!isSelectionMode) return;

              onTogglePhoto(photo);
            }}
            aria-pressed={
              isSelectionMode
                ? isSelected
                : undefined
            }
            className="relative aspect-square overflow-hidden rounded-xl bg-gray-200"
          >
            <img
              src={
                activeTab === 'rejected'
                  ? photo.previewUrl
                  : photo.imageUrl
              }
              alt=""
              className="h-full w-full object-cover"
            />

            {isSelectionMode && isSelected && (
              <>
                <div className="absolute inset-0 bg-background/50" />

                <span className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-primary text-white">
                  <Check
                    size={12}
                    strokeWidth={4}
                  />
                </span>
              </>
            )}

            <span className="absolute bottom-2 left-2 rounded-xl bg-text-primary/60 px-2 py-1 text-[10px] text-background">
              {photo.daysLeft}일 남음
            </span>
          </button>
        );
      })}
    </section>
  );
};

export default TrashPhotoGrid;
