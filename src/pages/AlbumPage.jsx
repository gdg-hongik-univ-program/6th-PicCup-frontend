import { useNavigate } from 'react-router';

import useMockBestPickStore from '../store/useMockBestPickStore';
import BottomNav from '../components/layout/BottomNav';

import useCategoryManagement from '../hooks/useCategoryManagement';
import CategoryManagementOverlays from '../components/category/CategoryManagementOverlays';

import CollectionToolbar from '../components/album/CollectionToolbar';
import CategoryGrid from '../components/album/CategoryGrid';

import mockCategories from '../constants/mockCategories';
import AppHeader from '../components/layout/AppHeader';

const AlbumPage = () => {
  const navigate = useNavigate();
  const categoryManagement =
    useCategoryManagement();

  const {
    categories,
    openCreateSheet,
    openEditSheet,
  } = categoryManagement;

  const allMockPhotos = useMockBestPickStore(
    (state) => state.photos,
  );

  const activeMockPhotos = allMockPhotos.filter(
    (photo) => !photo.deletedAt,
  );

  const mockAlbumCategories = mockCategories.map(
    (category) => ({
        ...category,
        bestPickCount: activeMockPhotos.filter(
        (photo) =>
            photo.categoryId === category.id,
        ).length,
    }),
  );

  const displayedCategories = [
    ...mockAlbumCategories,
    ...categories,
  ];

  return (
    <main className="flex min-h-dvh flex-col pb-28">
      <div className="flex-1 px-4 pt-4">
        <AppHeader
            showTrash
            onTrashClick={()=>{
                navigate('/album/trash');
            }}
        />

        <section className="mt-8">
            <h2 className="px-1 text-3xl font-semibold">
                앨범
            </h2>

            
        </section>

        <CollectionToolbar
            selectLabel="+"
            onSelectClick={openCreateSheet}
        />
        <CategoryGrid
            categories={displayedCategories}
            leadingType="all"
            showBestPickCount
            onLeadingClick={() => { //전체 앨범으로 이동
                navigate('/album/all', {
                state: {
                    albumName: '전체',
                },
                });
            }}
            onCategoryClick={(category) => { //선택한 카테고리 앨범으로 이동
                navigate(`/album/${category.id}`, {
                state: {
                    albumName: category.name,
                },
                });
            }}
            onCategoryMenuClick={openEditSheet}
        />
      </div>

      <CategoryManagementOverlays
        management={categoryManagement}
      />

      <BottomNav activeTab="album" />
    </main>
  );
};

export default AlbumPage;