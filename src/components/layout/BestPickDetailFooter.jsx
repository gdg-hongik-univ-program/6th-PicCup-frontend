import {
  Download,
  Heart,
  Info,
  Share2,
  Trash2,
} from 'lucide-react';

const BestPickDetailFooter = ({
  isLiked,
  isUpdatingLike,
  isDownloading,
  isSharing,
  onDownload,
  onToggleLike,
  onInfo,
  onShare,
  onDelete,
}) => {
  return (
    <footer className="flex items-center justify-between px-5 mb-8">
      <button
        type="button"
        onClick={onDownload}
        disabled={isDownloading}
        aria-busy={isDownloading}
        className="flex size-12 items-center justify-center rounded-full bg-background shadow-md"
        aria-label="사진 다운로드"
      >
        <Download size={20} />
      </button>

      <div className="flex items-center gap-5 rounded-full bg-background px-6 py-3 shadow-md">
        <button
          type="button"
          onClick={onToggleLike}
          disabled={isUpdatingLike}
          aria-busy={isUpdatingLike}
          aria-label={
            isLiked
              ? '좋아요 취소'
              : '좋아요'
          }
        >
          <Heart
            size={21}
            fill={
              isLiked
                ? 'currentColor'
                : 'none'
            }
          />
        </button>

        <button
          type="button"
          onClick={onInfo}
          aria-label="사진 정보"
          className="rounded-xl"
        >
          <Info size={21} />
        </button>

        <button
          type="button"
          onClick={onShare}
          disabled={isSharing}
          aria-busy={isSharing}
          aria-label="사진 공유"
          className="rounded-xl"
        >
          <Share2 size={21} />
        </button>
      </div>

      <button
        type="button"
        onClick={onDelete}
        className="flex size-12 items-center justify-center rounded-full bg-background shadow-md"
        aria-label="사진 삭제"
      >
        <Trash2 size={20} />
      </button>
    </footer>
  );
};

export default BestPickDetailFooter;
