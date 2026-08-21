import {
  useLocation,
  useNavigate,
  useParams,
} from 'react-router';

import { useState, useEffect } from 'react';
import {
  AnimatePresence,
  motion,
} from 'motion/react';

import BestPickDetailFooter from '../components/layout/BestPickDetailFooter';
import BestPickDetailHeader from '../components/layout/BestPickDetailHeader';
import ConfirmModal from '../components/layout/ConfirmModal';
import { TRASH_RETENTION_DAYS } from '../constants/trash';
import useBestPickActions from '../hooks/album/useBestPickActions';
import useBestPickDetail from '../hooks/album/useBestPickDetail';
import { getBestPicks } from '../api/bestPickApi';
import BestPickInfoSheet from '../components/layout/BestPickInfoSheet';

const BestPickDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bestPickId } = useParams();

  // 이미지 정보 바텀시트 표시 여부
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  // 1이면 다음 사진, -1이면 이전 사진
  const [slideDirection, setSlideDirection] = useState(0);

  const initialPhoto =
    location.state?.photo ?? null;

  // 화면 이동으로 전달받은 사진 목록
  const routePhotoList =
    location.state?.photoList ?? [];

  const hasRoutePhotoList =
    Array.isArray(routePhotoList) &&
    routePhotoList.length > 0;

  const searchParams = new URLSearchParams(
    location.search,
  );

  const routeCategoryId =
    searchParams.get('categoryId');

  const isLikedOnlySource =
    searchParams.get('likedOnly') === 'true';

  const {
    photo,
    setPhoto,
    isLoading,
    fetchError,
  } = useBestPickDetail(
    bestPickId,
    initialPhoto,
  );

  // URL에 categoryId가 없으면 현재 사진의 카테고리를 사용
  const sourceCategoryId =
    routeCategoryId ??
    photo?.categoryId ??
    null;

  // 새로고침으로 목록이 사라졌을 때 사용할 목록
  const [
    recoveredPhotoList,
    setRecoveredPhotoList,
  ] = useState([]);

  const [
    photoListError,
    setPhotoListError,
  ] = useState('');

  useEffect(() => {
    // 화면 이동으로 목록을 받았으면 다시 조회하지 않음
    if (
      hasRoutePhotoList ||
      sourceCategoryId === null
    ) {
      return;
    }

    let isCancelled = false;

    getBestPicks(sourceCategoryId)
      .then((result) => {
        if (isCancelled) {
          return;
        }

        // 좋아요 필터에서 들어온 경우 좋아요 사진만 복구
        const restoredList = isLikedOnlySource
          ? result.filter((item) => item.isLiked)
          : result;

        setRecoveredPhotoList(restoredList);
        setPhotoListError('');
      })
      .catch((error) => {
        if (isCancelled) {
          return;
        }

        console.error(
          '앨범 사진 목록 조회 실패:',
          error,
        );

        setPhotoListError(
          '좌우로 이동할 사진 목록을 불러오지 못했습니다.',
        );
      });

    return () => {
      isCancelled = true;
    };
  }, [
    hasRoutePhotoList,
    sourceCategoryId,
    isLikedOnlySource,
  ]);

  const photoList = hasRoutePhotoList
    ? routePhotoList
    : recoveredPhotoList;

  const currentPhotoIndex = photoList.findIndex(
    (item) =>
      String(item.id) === String(bestPickId),
  );

  const hasPreviousPhoto =
    currentPhotoIndex > 0;

  const hasNextPhoto =
    currentPhotoIndex >= 0 &&
    currentPhotoIndex < photoList.length - 1;

  // 앞·뒤 사진으로 이동
  const moveToPhoto = (targetIndex) => {
    const targetPhoto = photoList[targetIndex];

    // 목록 범위를 벗어나면 이동하지 않음
    if (!targetPhoto) {
      return;
    }

    // API 응답을 기다리지 않고 선택한 사진을 먼저 표시
    setPhoto(targetPhoto);

    navigate(//현재 쿼리 문자열을 그대로 유지
      `/album/photo/${targetPhoto.id}${location.search}`,
      {
        // 스와이프할 때마다 브라우저 히스토리를 쌓지 않음
        replace: true,
        state: {
          ...location.state,
          photo: targetPhoto,
          photoList,
        },
      },
    );
};

const showPreviousPhoto = () => {
  if (!hasPreviousPhoto) {
    return;
  }
  // 이전 사진은 왼쪽에서 들어옴
  setSlideDirection(-1);
  moveToPhoto(currentPhotoIndex - 1);
};

const showNextPhoto = () => {
  if (!hasNextPhoto) {
    return;
  }
  // 다음 사진은 오른쪽에서 들어옴
  setSlideDirection(1);
  moveToPhoto(currentPhotoIndex + 1);
};

  const {
    isUpdatingLike,
    isDownloading,
    isSharing,
    likeError,
    actionError,
    isMenuOpen,
    isDeleteConfirmOpen,
    isDeleting,
    deleteError,
    handleToggleLike,
    handleDownload,
    handleShare,
    handleMoveOpen,
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
        onMove={handleMoveOpen}
        onDelete={handleDeleteOpen}
      />

      <section className="relative min-h-0 flex-1 overflow-hidden">
        {/*빠져나가는 애니메이션을 끝낸 다음 제거*/}
        <AnimatePresence
          initial={false}
          custom={slideDirection}
        >
          <motion.img
            key={photo.id}
            src={photo.imageUrl}
            alt={`${photo.categoryName} 베스트픽`}
            draggable={false}
            custom={slideDirection}
            variants={{ /*실제 사진 이동 방향을 결정*/
              enter: (direction) => ({
                x: direction > 0 ? '100%' : '-100%',
                opacity: 0.7,
              }),
              center: {
                x: 0,
                opacity: 1,
              },
              exit: (direction) => ({
                x: direction > 0 ? '-100%' : '100%',
                opacity: 0.7,
              }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              type: 'spring',
              stiffness: 320,
              damping: 32,
            }}
            drag="x"
            dragConstraints={{
              left: 0,
              right: 0,
            }}
            dragElastic={0.18}
            whileDrag={{
              scale: 0.985,
            }}
            onDragEnd={(_, info) => {
              const movedLeft =
                info.offset.x < -70 ||
                info.velocity.x < -500;

              const movedRight =
                info.offset.x > 70 ||
                info.velocity.x > 500;

              // 왼쪽으로 밀면 다음 사진
              if (movedLeft) {
                showNextPhoto();
                return;
              }

              // 오른쪽으로 밀면 이전 사진
              if (movedRight) {
                showPreviousPhoto();
              }
            }}
            className="absolute inset-0 h-full w-full touch-pan-y select-none object-contain"
          />
        </AnimatePresence>
      </section>

      <p
        role="alert"
        className="h-5 px-4 text-center text-xs text-error"
      >
        {likeError || fetchError || actionError || photoListError}
      </p>

      <BestPickDetailFooter
        isLiked={photo.isLiked}
        isUpdatingLike={isUpdatingLike}
        isDownloading={isDownloading}
        isSharing={isSharing}
        onDownload={handleDownload}
        onToggleLike={handleToggleLike}
        onInfo={() => setIsInfoOpen(true)}
        onShare={handleShare}
        onDelete={handleDeleteOpen}
      />
      
      <BestPickInfoSheet
        isOpen={isInfoOpen}
        photo={photo}
        onClose={() => setIsInfoOpen(false)}
      />

      {isDeleteConfirmOpen && (
        <ConfirmModal
          isOpen={isDeleteConfirmOpen}
          title="이 사진을 삭제할까요?"
          description={`삭제한 사진은 휴지통에서 ${TRASH_RETENTION_DAYS.bestPick}일간 보관됩니다.`}
          error={deleteError}
          confirmLabel="삭제하기"
          isConfirming={isDeleting}
          onClose={closeDeleteConfirm}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </main>
  );
};

export default BestPickDetailPage;
