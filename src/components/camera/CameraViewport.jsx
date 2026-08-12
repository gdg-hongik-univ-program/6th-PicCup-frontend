import { ChevronDown } from 'lucide-react';

const CameraViewport = ({
  selectedCategory,
  cameraPositionClass,
  aspectRatioClass,
  videoRef,
  facingMode,
}) => {
  return (
    <>
      <header className="absolute inset-x-0 top-0 z-20 flex h-14 items-end justify-between px-4 pb-3">
        <button
          type="button"
          className="flex h-8 max-w-[70%] items-center rounded-full border-2 border-primary-muted bg-background px-4 py-1.5 text-sm font-semibold text-text-primary"
        >
          <span className="truncate">
            {selectedCategory?.name ?? '카테고리'}
          </span>
        </button>

        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-xl bg-gray-100/90 text-lg"
          aria-label="카메라 설정 열기"
        >
          <ChevronDown
            size={20}
            strokeWidth={2.3}
          />
        </button>
      </header>

      <section
        className={`absolute left-0 z-0 ${cameraPositionClass} w-full overflow-hidden bg-black ${aspectRatioClass}`}
      >
        <video
          ref={videoRef} //videoRef 연결
          autoPlay
          playsInline //전체화면으로 열리는 것을 방지
          muted //음소거
          className="h-full w-full object-cover"
          style={{
            transform:
              facingMode === 'user' //전면 카메라일 경우
                ? 'scaleX(-1)' //좌우반전(거울처럼 보이게)
                : 'none',
          }}
        />
      </section>
    </>
  );
};

export default CameraViewport;
