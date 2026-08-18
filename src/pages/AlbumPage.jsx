import { useNavigate } from 'react-router';

import useCategoryManagement from '../hooks/category/useCategoryManagement';
import useCategorySearch from '../hooks/category/useCategorySearch';

import CategoryManagementOverlays from '../components/category/CategoryManagementOverlays';
import CollectionToolbar from '../components/layout/CollectionToolbar';
import CategoryGrid from '../components/layout/CategoryGrid';

import AppHeader from '../components/layout/AppHeader';
import BottomNav from '../components/layout/BottomNav';

const AlbumPage = () => {
  const navigate = useNavigate();
  const categoryManagement =
    useCategoryManagement();

  const {
    categories,
    openCreateSheet,
    openEditSheet,
  } = categoryManagement;

  const {
    searchQuery,
    setSearchQuery,
    isSearchOpen,
    filteredCategories,
    sortOption,
    setSortOption,
    openSearch,
    closeSearch,
  } = useCategorySearch(categories);

  return (
    <main className="flex h-dvh min-h-0 flex-col overflow-hidden">
        <div className="flex min-h-0 flex-1 flex-col px-4 pt-2">
          <div className="shrink-0">
            <AppHeader
                showTrash
                onTrashClick={()=>{
                    navigate('/album/trash');
                }}
            />
          </div>

          <section className="mt-8 shrink-0">
              <h2 className="px-1 text-3xl font-semibold">
                  앨범
              </h2>
          </section>

          <div className="shrink-0">
            <CollectionToolbar
              selectLabel="+"
              searchQuery={searchQuery}
              isSearchOpen={isSearchOpen}
              searchPlaceholder="카테고리를 검색해 보세요!"
              sortOption={sortOption}
              onSortChange={setSortOption}
              onSelectClick={openCreateSheet}
              onSearchClick={openSearch}
              onSearchChange={setSearchQuery}
              onSearchClose={closeSearch}
            />
          </div>

        {/* 카테고리 카드 영역만 스크롤 */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-28 touch-pan-y">
          <CategoryGrid
              categories={filteredCategories}
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
      </div>

      <CategoryManagementOverlays
        management={categoryManagement}
      />

      <BottomNav activeTab="album" />
    </main>
  );
};

export default AlbumPage;
