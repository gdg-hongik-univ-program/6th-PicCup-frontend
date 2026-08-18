import { useNavigate } from 'react-router';

import useCategoryStore from '../store/useCategoryStore';
import useCategoryManagement from '../hooks/category/useCategoryManagement';
import useCategorySearch from '../hooks/category/useCategorySearch';

import AppHeader from '../components/layout/AppHeader';
import BottomNav from '../components/layout/BottomNav';
import CategoryManagementOverlays from '../components/category/CategoryManagementOverlays';
import CollectionToolbar from '../components/layout/CollectionToolbar';
import CategoryGrid from '../components/layout/CategoryGrid';


const CategoryPage = () => {
  const navigate = useNavigate();

  const setSelectedCategory = useCategoryStore(
    (state) => state.setSelectedCategory,
  );

  // 기존 카테고리 선택과 생성 직후 이동에서 함께 사용
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);

    navigate('/camera');
  };

  const categoryManagement =
    useCategoryManagement({
      onCategoryCreated: handleCategorySelect,
    });

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
        <div className="flex min-h-0 flex-1 flex-col px-4 pt-4">
          <div className="shrink-0">
            <AppHeader />
          </div>
      
          <section className="mt-8 shrink-0">
            <h2 className="text-3xl font-semibold">
              카테고리 선택
            </h2>

            <p className="mt-2 h-5 text-sm font-light text-text-secondary">
              선택하면 바로 촬영이 시작됩니다.
            </p>
          </section>
          <div className="shrink-0">
            <CollectionToolbar
              searchQuery={searchQuery}
              isSearchOpen={isSearchOpen}
              searchPlaceholder="카테고리를 검색해 보세요!"
              sortOption={sortOption}
              onSortChange={setSortOption}
              onSearchClick={openSearch}
              onSearchChange={setSearchQuery}
              onSearchClose={closeSearch}
            />
          </div>

          {/* 카테고리 카드 영역만 스크롤 */}
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-28 touch-pan-y">
            <CategoryGrid
              categories={filteredCategories}
              leadingType="add"
              showBestPickCount={false}
              onLeadingClick={openCreateSheet}
              onCategoryClick={handleCategorySelect}
              onCategoryMenuClick={openEditSheet}
            />
          </div>
          
        </div>

        <CategoryManagementOverlays
          management={categoryManagement}
        />
        <BottomNav activeTab="camera" />
    </main>
  );
};

export default CategoryPage;
