import { useNavigate } from 'react-router';
import useCategories from '../hooks/useCategories';
import BottomNav from '../components/layout/BottomNav';

import CollectionToolbar from '../components/album/CollectionToolbar';
import CategoryGrid from '../components/album/CategoryGrid';

import mockCategories from '../constants/mockCategories';
import AppHeader from '../components/layout/AppHeader';

const AlbumPage = () => {
  const navigate = useNavigate();
  const { categories } = useCategories();

  const displayedCategories = [
    ...mockCategories,
    ...categories,
  ];

  return (
    <main className="flex min-h-dvh flex-col pb-28">
      <div className="flex-1 px-4 pt-4">
        <AppHeader
            showTrash
            onTrashClick={()=>{
                //나중에 휴지통 화면으로 이동
            }}
        />

        <section className="mt-8">
            <h2 className="px-1 text-3xl font-semibold">
                앨범
            </h2>

            <p
                className="mt-2 h-5"
                aria-hidden="true"
            >
                &nbsp;
            </p>
        </section>

        <CollectionToolbar />
        <CategoryGrid
            categories={displayedCategories}
            leadingType="all"
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
        />
      </div>

      <BottomNav activeTab="album" />
    </main>
  );
};

export default AlbumPage;