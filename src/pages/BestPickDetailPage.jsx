import {
  useLocation,
  useNavigate,
  useParams,
} from 'react-router';

import BestPickDetailFooter from '../components/layout/BestPickDetailFooter';
import BestPickDetailHeader from '../components/layout/BestPickDetailHeader';
import ConfirmModal from '../components/layout/ConfirmModal';
import { TRASH_RETENTION_DAYS } from '../constants/trash';
import useBestPickActions from '../hooks/album/useBestPickActions';
import useBestPickDetail from '../hooks/album/useBestPickDetail';
import useMockBestPickStore from '../store/useMockBestPickStore';

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

  const {
    isUpdatingLike,
    likeError,
    actionError,
    isMenuOpen,
    isDeleteConfirmOpen,
    isDeleting,
    deleteError,
    handleToggleLike,
    handleDownload,
    handleShare,
    handleDeleteOpen,
    handleDeleteConfirm,
    toggleMenu,
    closeMenu,
    closeDeleteConfirm,
  } = useBestPickActions({
    photo,
    setPhoto,
    navigate,
  });

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
      <BestPickDetailHeader
        capturedDate={photo.capturedDate}
        isMenuOpen={isMenuOpen}
        onBack={() => navigate(-1)}
        onToggleMenu={toggleMenu}
        onCloseMenu={closeMenu}
        onDelete={handleDeleteOpen}
      />

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

      <BestPickDetailFooter
        isLiked={photo.isLiked}
        isUpdatingLike={isUpdatingLike}
        onDownload={handleDownload}
        onToggleLike={handleToggleLike}
        onShare={handleShare}
        onDelete={handleDeleteOpen}
      />

      {isDeleteConfirmOpen && (
        <ConfirmModal
          isOpen={isDeleteConfirmOpen}
          title="이 사진을 삭제할까요?"
          description={`삭제한 사진은 휴지통에서 ${TRASH_RETENTION_DAYS.bestPick}일간 보관됩니다.`}
          error={deleteError}
          confirmLabel="삭제하기"
          confirmingLabel="삭제 중..."
          isConfirming={isDeleting}
          onClose={closeDeleteConfirm}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </main>
  );
};

export default BestPickDetailPage;
