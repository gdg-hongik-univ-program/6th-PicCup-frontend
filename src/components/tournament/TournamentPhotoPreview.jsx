import { X } from 'lucide-react';

const TournamentPhotoPreview = ({
  photo,
  onClose,
}) => {
  if (!photo) return null;

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-label="사진 전체 보기"
      className="fixed inset-y-0 left-1/2 z-[80] flex w-full max-w-md -translate-x-1/2 flex-col bg-background"
    >
      {/* 전체 사진 영역 */}
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <img
          src={photo.previewUrl}
          alt="촬영 사진 전체 보기"
          draggable={false}
          className="max-h-full w-full object-contain"
        />
      </div>

      {/* 하단 닫기 버튼 영역 */}
      <footer className="flex h-28 shrink-0 items-center px-6 pb-[env(safe-area-inset-bottom)]">
        <button
          type="button"
          onClick={onClose}
          className="flex size-12 items-center justify-center rounded-full bg-background shadow-lg ring-1 ring-text-primary/5"
          aria-label="전체 사진 닫기"
        >
          <X size={25} />
        </button>
      </footer>
    </section>
  );
};

export default TournamentPhotoPreview;
