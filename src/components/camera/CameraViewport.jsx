import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const CameraViewport = ({
  selectedCategory,
  cameraPositionClass,
  aspectRatioClass,
  videoRef,
  facingMode,
}) => {
  const [isSettingsNoticeOpen, setIsSettingsNoticeOpen] =
    useState(false);

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
          onClick={() =>
            setIsSettingsNoticeOpen(
              (previous) => !previous,
            )
          }
          className="flex size-9 items-center justify-center rounded-xl bg-gray-100/90 text-lg"
          aria-label="카메라 설정 열기"
          aria-expanded={isSettingsNoticeOpen}
          aria-controls="camera-settings-notice"
        >
          <ChevronDown
            size={20}
            strokeWidth={2.3}
            className={`transition-transform ${
              isSettingsNoticeOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </header>

      {isSettingsNoticeOpen && (
        <aside
          id="camera-settings-notice"
          role="dialog"
          aria-label="카메라 상세 설정 안내"
          className="absolute right-4 top-16 z-30 w-full max-w-[calc(100%_-_2rem)] rounded-2xl bg-text-primary/50 p-4 shadow-xl"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-background font-semibold">
                카메라 상세 설정
              </p>

              <p className="mt-2 text-xs text-background/90 leading-5">
                추후 카메라 상세 설정 기능을 넣을 예정이에요!
              </p>
            </div>
            <button
            type="button"
            onClick={() =>
              setIsSettingsNoticeOpen(false)
            }
            className="mt-1 h-10 rounded-xl px-4 bg-primary text-sm font-semibold text-background"
          >
            닫기
          </button>
          </div>

        </aside>
      )}

      <section
        className={`absolute left-0 z-0 ${cameraPositionClass} w-full overflow-hidden bg-text-primary ${aspectRatioClass}`}
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
