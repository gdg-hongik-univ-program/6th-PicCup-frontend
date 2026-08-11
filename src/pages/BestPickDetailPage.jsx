import {
  ChevronLeft,
  Download,
  Ellipsis,
  Heart,
  Info,
  Share2,
  Trash2,
} from 'lucide-react';
import {
  useLocation,
  useNavigate,
  useParams,
} from 'react-router';
import { useState } from 'react';

import { 
  deleteBestPicks,
  updateBestPickLike,
 } from '../api/bestPickApi';
import useMockBestPickStore from '../store/useMockBestPickStore';
import useBestPickDetail from '../hooks/useBestPickDetail';
import ConfirmModal from '../components/layout/ConfirmModal';

import {
  downloadImage,
  shareImage,
} from '../libs/imageActions';

const formatCapturedDate = (capturedDate) => {
  if (!capturedDate) return '';

  const [year, month, day] =
    capturedDate.split('-');

  return `${year}년 ${month}월 ${day}일`;
};

const BestPickDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bestPickId } = useParams();

  const storedMockPhoto = useMockBestPickStore(
    (state) =>
      state.photos.find(
        (item) =>
          String(item.id) === bestPickId,
      ),
  );
  const toggleMockLike = useMockBestPickStore(
    (state) => state.toggleLike,
  );

  const moveMockPhotoToTrash =
    useMockBestPickStore(
      (state) => state.moveToTrash,
  );

  const isMockPhotoId =
    String(bestPickId).startsWith('mock-');

  const initialPhoto =
    location.state?.photo ??
    storedMockPhoto ??
    null;

  const {
    photo,
    setPhoto,
    isLoading,
    fetchError,
  } = useBestPickDetail(
    bestPickId,
    initialPhoto,
    !isMockPhotoId,
  );

  const [isUpdatingLike, setIsUpdatingLike] = useState(false);
  const [likeError, setLikeError] = useState('');
  const [actionError, setActionError] = useState('');

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,
  ] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleToggleLike = async () => {
    if (!photo || isUpdatingLike) return;

    const nextIsLiked = !photo.isLiked;
    const isMockPhoto =
      String(photo.id).startsWith('mock-');

    if (isMockPhoto) {
    toggleMockLike(photo.id);

    setPhoto((previousPhoto) => ({
      ...previousPhoto,
      isLiked: nextIsLiked,
    }));

    return;
  }

    try {
      setIsUpdatingLike(true);
      setLikeError('');

      const updatedBestPick =
        await updateBestPickLike(
          photo.id,
          nextIsLiked,
        );

      setPhoto((previousPhoto) => ({
        ...previousPhoto,
        ...updatedBestPick,
      }));
    } catch (error) {
      console.error('베스트픽 좋아요 변경 실패:', error);

      setLikeError(
        error.response?.data?.message ??
          '좋아요 상태를 변경하지 못했습니다.',
      );
    } finally {
      setIsUpdatingLike(false);
    }
  };

  const handleDownload = async () => {
    if (!photo) return;

    try {
      setActionError('');

      await downloadImage({
        imageUrl: photo.imageUrl,
        fileName:
          `piccup-${photo.capturedDate}-${photo.id}.jpg`,
      });
    } catch (error) {
      console.error('사진 다운로드 실패:', error);

      setActionError(
        '사진을 다운로드하지 못했습니다.',
      );
    }
  };

  const handleShare = async () => {
    if (!photo) return;

    try {
      setActionError('');

      await shareImage({
        imageUrl: photo.imageUrl,
        fileName:
          `piccup-${photo.capturedDate}-${photo.id}.jpg`,
      });
    } catch (error) {
      if (error.name === 'AbortError') return;

      console.error('사진 공유 실패:', error);

      setActionError(
        '사진을 공유하지 못했습니다.',
      );
    }
  };

  const handleDeleteOpen = () => {
    setIsMenuOpen(false);
    setDeleteError('');
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!photo || isDeleting) return;

    const isMockPhoto =
      String(photo.id).startsWith('mock-');

    if (isMockPhoto) {
      moveMockPhotoToTrash(photo.id);
      setIsDeleteConfirmOpen(false);
      navigate(-1);

      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError('');

      await deleteBestPicks([photo.id]);

      setIsDeleteConfirmOpen(false);
      navigate(-1);
    } catch (error) {
      console.error('베스트픽 삭제 실패:', error);

      setDeleteError(
        error.response?.data?.message ??
          '사진을 삭제하지 못했습니다.',
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading && !photo) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <p className="text-text-secondary">
          사진을 불러오는 중입니다.
        </p>
      </main>
    );
  }

  if (!photo) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center px-4">
        <p className="text-text-secondary">
          {fetchError ||
            '사진 정보를 불러오지 못했습니다.'}
        </p>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-4 rounded-full border border-border px-5 py-2"
        >
          돌아가기
        </button>
      </main>
    );
  }

  return (
    <main className="flex h-dvh flex-col overflow-hidden">
      <header className="flex items-center justify-between px-4 py-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex size-11 items-center justify-center rounded-full bg-white shadow-md"
          aria-label="앨범으로 돌아가기"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="rounded-full bg-white px-6 py-3 text-sm font-semibold shadow-md">
          {formatCapturedDate(photo.capturedDate)}
        </div>

        <div className="relative z-50">
          <button
            type="button"
            onClick={() =>
              setIsMenuOpen((previous) => !previous)
            }
            className="flex size-11 items-center justify-center rounded-full bg-white shadow-md"
            aria-label="사진 메뉴"
            aria-expanded={isMenuOpen}
          >
            <Ellipsis size={22} />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-14 w-32 overflow-hidden rounded-2xl border border-border bg-white shadow-lg">
              <button
                type="button"
                disabled
                className="w-full px-4 py-3 text-left text-sm"
              >
                다른 앨범으로 이동
              </button>

              <div className="border-t border-border" />

              <button
                type="button"
                onClick={handleDeleteOpen}
                className="w-full px-4 py-3 text-left text-sm text-error active:bg-gray-100"
              >
                삭제하기
              </button>
            </div>
          )}
        </div>
      </header>

      {isMenuOpen && (
        <button
          type="button"
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 z-40"
          aria-label="사진 메뉴 닫기"
        />
      )}

      <section className="min-h-0 flex-1">
        <img
          src={photo.imageUrl}
          alt={`${photo.categoryName} 베스트픽`}
          className="h-full w-full object-contain"
        />
      </section>

      <p
        role="alert"
        className="h-5 px-4 text-center text-xs text-error"
      >
        {likeError || fetchError || actionError}
      </p>

      <footer className="flex items-center justify-between px-5 py-5">
        <button
          type="button"
          onClick={handleDownload}
          className="flex size-12 items-center justify-center rounded-full bg-white shadow-md"
          aria-label="사진 다운로드"
        >
          <Download size={20} />
        </button>

        <div className="flex items-center gap-5 rounded-full bg-white px-6 py-3 shadow-md">
          <button
            type="button"
            onClick={handleToggleLike}
            disabled={isUpdatingLike}
            className="disabled:opacity-50"
            aria-label={
              photo.isLiked
                ? '좋아요 취소'
                : '좋아요'
            }
          >
            <Heart
              size={21}
              fill={
                photo.isLiked
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
            onClick={handleShare}
            aria-label="사진 공유"
          >
            <Share2 size={21} />
          </button>
        </div>

        <button
          type="button"
          onClick={handleDeleteOpen}
          className="flex size-12 items-center justify-center rounded-full bg-white shadow-md"
          aria-label="사진 삭제"
        >
          <Trash2 size={20} />
        </button>
      </footer>

      {isDeleteConfirmOpen && (
        <ConfirmModal
          isOpen={isDeleteConfirmOpen}
          title="이 사진을 삭제할까요?"
          description="삭제한 사진은 휴지통에서 30일간 보관됩니다."
          error={deleteError}
          confirmLabel="삭제하기"
          confirmingLabel="삭제 중..."
          isConfirming={isDeleting}
          onClose={() =>
            setIsDeleteConfirmOpen(false)
          }
          onConfirm={handleDeleteConfirm}
        />
      )}
    </main>
  );
};

export default BestPickDetailPage;