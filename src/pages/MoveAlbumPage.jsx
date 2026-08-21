import {
  useLocation,
  useNavigate,
} from 'react-router';

import { useState } from 'react';

import Snackbar from '../components/layout/Snackbar';

import CategoryManagementOverlays from '../components/category/CategoryManagementOverlays';
import BackHeader from '../components/layout/BackHeader';
import CategoryGrid from '../components/layout/CategoryGrid';
import useBestPickMove from '../hooks/album/useBestPickMove';
import useCategoryManagement from '../hooks/category/useCategoryManagement';

const MoveAlbumPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const ids = Array.isArray(
    location.state?.ids,
  )
    ? location.state.ids
    : [];

  const sourceCategoryId =
    location.state?.sourceCategoryId;

  const categoryManagement =
    useCategoryManagement();

  const {
    categories,
    isLoading,
    fetchError,
    openCreateSheet,
  } = categoryManagement;

  const {
    isMoving,
    moveError,
    moveToCategory,
  } = useBestPickMove({
    ids,
    sourceCategoryId,
    navigate,
  });

  // 사용자가 닫은 오류 메시지
  const [ dismissedError, setDismissedError ] = useState('');
  const currentError = fetchError || moveError || '';

  const snackbarMessage =
    currentError !== dismissedError
      ? currentError
      : '';

  // 다시 카테고리를 누르면 이전 오류 닫힘 상태 초기화
  const handleCategoryClick = (
    category,
  ) => {
    setDismissedError('');
    moveToCategory(category);
  };

  return (
    <main className="min-h-dvh px-4 pb-10 pt-4">
      <BackHeader title="이동할 앨범 선택" />

      <p className="mt-4 text-sm text-text-secondary">
        선택한 {ids.length}장의 사진을 이동할 앨범을 선택해주세요.
      </p>

      {isLoading ? (
        <p className="mt-5 text-sm text-text-secondary">
          앨범을 불러오는 중이에요.
        </p>
      ) : (
        <CategoryGrid
          categories={categories}
          leadingType="add"
          showBestPickCount={false}
          onLeadingClick={openCreateSheet}
          onCategoryClick={handleCategoryClick}
        />
      )}

      {isMoving && (
        <p className="mt-4 text-center text-sm text-text-secondary">
          사진을 이동하는 중이에요.
        </p>
      )}

      <CategoryManagementOverlays
        management={categoryManagement}
      />

      <Snackbar
        message={snackbarMessage}
        actionLabel="뒤로가기"
        onAction={() => navigate(-1)}
        onClose={() =>
          setDismissedError(currentError)
        }
        positionClassName="bottom-12"
      />
    </main>
  );
};

export default MoveAlbumPage;