import { ArrowRight, RefreshCw, Scan } from 'lucide-react';

const CameraActions = ({
  aspectRatio,
  isCameraOn,
  latestPhoto,
  photoCount,
  cameraError,
  captureError,
  onChangeAspectRatio,
  onCapture,
  onSwitchCamera,
  onComplete,
}) => {
  return (
    <>
      <section className="absolute inset-x-0 bottom-[calc(6rem+env(safe-area-inset-bottom))] z-20 grid h-24 grid-cols-3 items-center px-6">
        <button
          type="button"
          onClick={onChangeAspectRatio}
          className="relative flex size-12 items-center justify-center rounded-full bg-gray-100/90 ring-1 ring-text-primary/5"
        >
          <Scan
            size={28}
            strokeWidth={2.2}
            aria-hidden="true"
          />
          <span className="absolute text-xs font-semibold">
            {aspectRatio.replace('/', ':')}
          </span>
        </button>

        <button
          type="button"
          onClick={onCapture}
          disabled={!isCameraOn || photoCount >= 16}
          className="flex size-20 border-4 border-primary-muted bg-background items-center justify-center justify-self-center rounded-full shadow-lg"
          aria-label="사진 촬영 버튼"
        >
        </button>

        <button
          type="button"
          onClick={onSwitchCamera}
          className="flex size-12 items-center justify-center justify-self-end rounded-full bg-gray-100/90 ring-1 ring-text-primary/5"
          aria-label="카메라 방향 전환"
        >
          <RefreshCw
            size={24}
            strokeWidth={2}
            aria-hidden="true"
          />
        </button>
      </section>

      {(cameraError || captureError) && (
        <p>{cameraError || captureError}</p>
      )}

      <footer className="absolute inset-x-0 bottom-0 z-20 grid h-[calc(6rem+env(safe-area-inset-bottom))] grid-cols-3 items-center px-6 pb-[env(safe-area-inset-bottom)]">
        <div className="relative justify-self-start size-12 overflow-hidden rounded-xl bg-surface text-right">
          {latestPhoto && ( //latestPhoto가 없으면 렌더링 하지 않고
            <img //있으면 <img> 렌더링
              src={latestPhoto.previewUrl}
              alt="최근 촬영한 사진"
              className="h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-x-0 bottom-0 p-1 text-background/90 font-medium">
            <p>{photoCount}/16</p>
          </div>
        </div>

        <p className="self-end pb-6 text-center text-sm font-medium">
          {16-photoCount}장 남았어요.
        </p>

        <button
          type="button"
          onClick={onComplete}
          className="flex size-12 items-center justify-center justify-self-end rounded-xl bg-background/90 ring-2 ring-primary-muted"
          aria-label="촬영 완료"
        >
          <ArrowRight
            size={28}
            strokeWidth={2}
          />
        </button>
      </footer>
    </>
  );
};

export default CameraActions;
