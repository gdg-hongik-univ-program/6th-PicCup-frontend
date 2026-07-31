import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

import useCategoryStore from '../store/useCategoryStore';
import useCategories from '../hooks/useCategories';

import { Plus, EllipsisVertical, } from 'lucide-react';
import AppHeader from '../components/layout/AppHeader';
import BottomNav from '../components/layout/BottomNav';
import BottomSheet from '../components/layout/BottomSheet';


const mockCategories = [ //임시 카테고리
  {
    id: 'mock-dokyo',
    name: '도쿄 여행',
    coverImageUrl: '/images/dokyo.webp',
    isDefault: false,
    isMock: true,
  },
  {
    id: 'mock-landscape',
    name: '풍경',
    coverImageUrl: '/images/landscape.jpg',
    isDefault: false,
    isMock: true,
  },
  {
    id: 'mock-cat',
    name: '고양이',
    coverImageUrl: '/images/cat.jpg',
    isDefault: false,
    isMock: true,
  },
];


const CategoryPage = () => {
  const navigate = useNavigate();

  const [isCreateOpen, setIsCreateOpen] = useState(false); //카테고리 생성
  const [categoryName, setCategoryName] = useState('');

  const [isEditOpen, setIsEditOpen] = useState(false); //카테고리 수정
  const [editingCategory, setEditingCategory] = useState(null); //수정, 삭제할 카테고리
  const [editingName, setEditingName] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null); //삭제할 카테고리
  const [deletedNotice, setDeletedNotice] = useState(null); //삭제 결과 상태

  const hasOverlay =
    isCreateOpen ||
    isEditOpen ||
    deleteTarget !== null;

  useEffect(() => {
    document.documentElement.style.backgroundColor =
      hasOverlay ? '#989999' : '#FDFFFF';

    return () => {
      document.documentElement.style.backgroundColor =
        '#FDFFFF';
    };
  }, [hasOverlay]);

  const {
    categories,
    isCreating,
    isUpdating,
    isDeleting,
    isRestoring,
    categoryError,
    addCategory,
    renameCategory,
    removeCategory,
    recoverCategory,
  } = useCategories();

  const displayedCategories = [
    ...mockCategories,
    ...categories,
  ];

  const setSelectedCategory = useCategoryStore(
    (state) => state.setSelectedCategory,
  );

  const handleCategorySelect = (category) => {
    if (category.isMock) {
      setSelectedCategory({ //임시 카테고리
        id: 1,
        name: category.name,
      });
    } else { //카테고리 추가
      setSelectedCategory(category);
    }

    navigate('/camera');
  };
  

  const handleCreateCategory = async () => { //카테고리 추가
    const createdCategory = await addCategory(categoryName);

    if (!createdCategory) return;

    setCategoryName('');
    setIsCreateOpen(false);
  };

  const handleEditOpen = (category) => { //카테고리 수정 바텀시트 열기
    setEditingCategory(category);
    setEditingName(category.name);
    setIsEditOpen(true);
  };
  const handleUpdateCategory = async () => { //카테고리 수정하기 버튼 누름
    if (!editingCategory || editingCategory.isMock) return;

    const updatedCategory = await renameCategory(
      editingCategory.id,
      editingName,
    );

    if (!updatedCategory) return;

    setIsEditOpen(false);
  };
  const handleDeleteOpen = () => { //삭제 버튼 누를 때 동작
    if (!editingCategory || editingCategory.isMock) return;

    setDeleteTarget(editingCategory); //수정중인 카테고리를 삭제 대상으로 정함
    setIsEditOpen(false); //수정 바텀시트 닫기
  };
  const handleDeleteConfirm = async () => { //삭제하기 및 확인
    if (!deleteTarget) return;

    const deletionResult = await removeCategory(
      deleteTarget.id,
    );

    if (!deletionResult) return;

    setDeletedNotice({
      id: deletionResult.id,
      name: deleteTarget.name,
      deletedBestPickCount:
        deletionResult.deletedBestPickCount,
    });

    setDeleteTarget(null);

    setTimeout(() => { //스낵바 5초 뒤 사라짐
      setDeletedNotice(null);
    }, 5000);
  };
  const handleRestoreCategory = async () => { //카테고리 복구
    if (!deletedNotice) return;

    const restorationResult = await recoverCategory(
      deletedNotice.id,
    );

    if (!restorationResult) return;

    setDeletedNotice(null);
  };
  
  return (
    <main className="flex min-h-dvh flex-col">
        <div className="flex-1 px-4 pt-4">
          <AppHeader />
      
          <section className="mt-8">
            <h2 className="text-3xl font-semibold">
              카테고리 선택
            </h2>

            <p className="mt-2 text-sm font-light text-text-secondary">
              선택하면 바로 촬영이 시작됩니다.
            </p>
          </section>

          <section className="mt-6 grid grid-cols-3 gap-1">
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="flex aspect-square items-center justify-center rounded-2xl border-2 border-border text-text-secondary bg-gray-50"
            >
              <Plus size={24} />
            </button>

            {displayedCategories.map((category) => ( 
              <div
                key={category.id}
                className="relative aspect-square overflow-hidden rounded-2xl bg-gray-200"
              >
                <button
                  type="button"
                  onClick={() => handleCategorySelect(category)}
                  className="w-full h-full text-left"
                >
                  {category.coverImageUrl && (
                    
                      <img
                        src={category.coverImageUrl}
                        alt={category.name}
                        className="h-full w-full object-cover"
                      />
                  )}
                  <div className="absolute inset-0 bg-black/30" />

                  <div className="absolute inset-x-0 bottom-0 p-3 text-background">
                    <p className="text-lg font-semibold opacity-95">
                      {category.name}
                    </p>
                  </div>
                </button>
                {!category.isDefault && ( //카테고리 수정 아이콘
                  <button
                    type="button"
                    aria-label={`${category.name} 편집`}
                    onClick={() => handleEditOpen(category)}
                    className="absolute right-1 top-3 z-10 flex size-8 items-center justify-center rounded-3xl text-background/90 drop-shadow transition-colors active:bg-gray-500/50"
                  >
                    <EllipsisVertical size={20} />
                  </button>
                )}
              </div>
            ))}
          </section>
          
        </div>
        <BottomSheet
          isOpen={isCreateOpen}
          title="새 카테고리"
          name={categoryName}
          onNameChange={setCategoryName}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleCreateCategory}
          submitLabel="카테고리 생성"
          submittingLabel="생성 중..."
          isSubmitting={isCreating}
          error={categoryError}
        />

        <BottomSheet
          isOpen={isEditOpen}
          title="카테고리 수정"
          name={editingName}
          onNameChange={setEditingName}
          onClose={() => setIsEditOpen(false)}
          onDelete={handleDeleteOpen}
          onSubmit={handleUpdateCategory}
          submitLabel="수정하기"
          submittingLabel="수정 중..."
          isSubmitting={isUpdating}
          isSubmitDisabled={editingCategory?.isMock}
          error={
            editingCategory?.isMock
              ? ''
              : categoryError
          }
          showDelete
        />

        {deleteTarget && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center px-6">
            <button
              type="button"
              aria-label="삭제 확인 닫기"
              onClick={() => setDeleteTarget(null)}
              className="absolute inset-0 bg-black/40"
            />

            <section className="relative w-full rounded-2xl bg-background p-5 text-center">
              <h3 className="font-semibold">
                ‘{deleteTarget.name}’ 카테고리를 삭제하시겠습니까?
              </h3>

              <p className="mt-3 text-sm text-text-secondary">
                이 카테고리에 저장된 사진도 함께 삭제됩니다.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="rounded-xl border border-border py-3"
                >
                  취소
                </button>

                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="rounded-xl bg-error py-3 text-white disabled:opacity-50"
                >
                  {isDeleting ? '삭제 중...' : '삭제하기'}
                </button>
              </div>
            </section>
          </div>
        )}
        {deletedNotice && (
          <div className="fixed inset-x-0 bottom-28 z-[55] mx-auto w-full max-w-md px-4">
            <div className="flex items-center justify-between rounded-full bg-gray-100 px-4 py-3 shadow-lg">
              <p className="text-sm">
                ‘{deletedNotice.name}’ 카테고리와 사진{' '}
                {deletedNotice.deletedBestPickCount}장을 삭제했어요.
              </p>

              <button
                type="button"
                onClick={handleRestoreCategory}
                disabled={isRestoring}
                className="ml-3 shrink-0 font-semibold text-primary disabled:opacity-50"
              >
                {isRestoring ? '복구 중...' : '되돌리기'}
              </button>
            </div>
          </div>
        )}

        <BottomNav activeTab="camera" />
    </main>
  );
};

export default CategoryPage;