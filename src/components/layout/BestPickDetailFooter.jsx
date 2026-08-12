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
  onDownload,
  onToggleLike,
  onShare,
  onDelete,
}) => {
  return (
    <footer className="flex items-center justify-between px-5 py-5">
      <button
        type="button"
        onClick={onDownload}
        className="flex size-12 items-center justify-center rounded-full bg-white shadow-md"
        aria-label="사진 다운로드"
      >
        <Download size={20} />
      </button>

      <div className="flex items-center gap-5 rounded-full bg-white px-6 py-3 shadow-md">
        <button
          type="button"
          onClick={onToggleLike}
          disabled={isUpdatingLike}
          className="disabled:opacity-50"
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
          aria-label="사진 정보"
        >
          <Info size={21} />
        </button>

        <button
          type="button"
          onClick={onShare}
          aria-label="사진 공유"
        >
          <Share2 size={21} />
        </button>
      </div>

      <button
        type="button"
        onClick={onDelete}
        className="flex size-12 items-center justify-center rounded-full bg-white shadow-md"
        aria-label="사진 삭제"
      >
        <Trash2 size={20} />
      </button>
    </footer>
  );
};

export default BestPickDetailFooter;
