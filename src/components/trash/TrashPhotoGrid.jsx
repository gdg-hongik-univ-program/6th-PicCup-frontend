import { Check } from 'lucide-react';
import { useRef } from 'react';

const TrashPhotoGrid = ({
  photos,
  isSelectionMode,
  getPhotoKey,
  onOpenPhoto,
  isPhotoSelected,
  onTogglePhoto,
  onLongPressPhoto,
}) => {
  const longPressTimerRef = useRef(null);
  const didLongPressRef = useRef(false);

  // 0.5초 이상 누르면 길게 누르기로 처리
  const startLongPress = (photo) => {
    didLongPressRef.current = false;

    longPressTimerRef.current = window.setTimeout(() => {
      didLongPressRef.current = true;
      onLongPressPhoto(photo);
    }, 500);
  };
  //길게 누르기로 판정하기 전에 손을 떼면 예약해둔 타이머를 취소
  const cancelLongPress = () => {
    if (!longPressTimerRef.current) return;

    window.clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = null;
  };

  return (
    <section className="mt-4 grid grid-cols-3 gap-1">
      {photos.map((photo) => {
        const photoKey = getPhotoKey(photo);

        const isSelected = isPhotoSelected(photo);

        const imageSource =
          photo.previewUrl ?? photo.imageUrl ?? '';

        return (
          <button
            key={photoKey}
            type="button"
            data-thumbnail="true"
            onPointerDown={() => startLongPress(photo)}
            onPointerUp={cancelLongPress}
            onPointerLeave={cancelLongPress}
            onPointerCancel={cancelLongPress}
            onContextMenu={(event) => event.preventDefault()}
            onClick={() => {
              // 길게 누른 뒤 발생하는 click은 무시
              if (didLongPressRef.current) {
                didLongPressRef.current = false;
                return;
              }

              if (isSelectionMode) {
                onTogglePhoto(photo);
                return;
              }
              //사진 상세 화면으로
              onOpenPhoto(photo);
            }}
            className="relative aspect-square select-none overflow-hidden rounded-xl touch-pan-y"
          >
            <img
              src={imageSource}
              alt=""
              draggable={false}
              className="h-full w-full object-cover"
            />

            {isSelectionMode && isSelected && (
              <>
                <div className="absolute inset-0 bg-background/50" />

                <span className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-primary text-background">
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
