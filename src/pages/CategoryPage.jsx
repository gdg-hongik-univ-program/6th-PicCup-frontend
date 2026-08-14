import { useNavigate } from 'react-router';

import useCategoryStore from '../store/useCategoryStore';
import useCategoryManagement from '../hooks/category/useCategoryManagement';

import AppHeader from '../components/layout/AppHeader';
import BottomNav from '../components/layout/BottomNav';
import CategoryManagementOverlays from '../components/category/CategoryManagementOverlays';
import CollectionToolbar from '../components/layout/CollectionToolbar';
import CategoryGrid from '../components/layout/CategoryGrid';


const CategoryPage = () => {
  const navigate = useNavigate();

  const categoryManagement =
    useCategoryManagement();

  const {
    categories,
    openCreateSheet,
    openEditSheet,
  } = categoryManagement;

  const setSelectedCategory = useCategoryStore(
    (state) => state.setSelectedCategory,
  );

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);

    navigate('/camera');
  };
  
  return (
    <main className="flex min-h-dvh flex-col pb-28">
        <div className="flex-1 px-4 pt-4">
          <AppHeader />
      
          <section className="mt-8">
            <h2 className="text-3xl font-semibold">
              카테고리 선택
            </h2>

            <p className="mt-2 h-5 text-sm font-light text-text-secondary">
              선택하면 바로 촬영이 시작됩니다.
            </p>
          </section>
          <CollectionToolbar />

          <CategoryGrid
            categories={categories}
            leadingType="add"
            showBestPickCount={false}
            onLeadingClick={openCreateSheet}
            onCategoryClick={handleCategorySelect}
            onCategoryMenuClick={openEditSheet}
          />
          
        </div>

        <CategoryManagementOverlays
          management={categoryManagement}
        />
        <BottomNav activeTab="camera" />
    </main>
  );
};

export default CategoryPage;
