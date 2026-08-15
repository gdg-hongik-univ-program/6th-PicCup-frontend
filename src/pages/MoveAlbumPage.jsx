import {
  useLocation,
  useNavigate,
} from 'react-router';

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

  return (
    <main className="min-h-dvh px-4 pb-10 pt-4">
      <BackHeader title="이동할 앨범 선택" />

      <p className="mt-4 text-sm text-text-secondary">
        선택한 {ids.length}장의 사진을 이동할 앨범을 선택해주세요.
      </p>

      {(fetchError || moveError) && (
        <p
          role="alert"
          className="mt-3 text-sm text-error"
        >
          {fetchError || moveError}
        </p>
      )}

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
          onCategoryClick={moveToCategory}
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
    </main>
  );
};

export default MoveAlbumPage;