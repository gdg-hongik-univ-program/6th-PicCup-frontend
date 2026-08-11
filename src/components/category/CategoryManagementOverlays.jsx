import BottomSheet from '../layout/BottomSheet';
import ConfirmModal from '../layout/ConfirmModal';

const CategoryManagementOverlays = ({
  management,
}) => {
  const {
    categoryError,

    isCreateOpen,
    categoryName,
    setCategoryName,
    isCreating,
    closeCreateSheet,
    submitCreate,

    isEditOpen,
    editingCategory,
    editingName,
    setEditingName,
    isUpdating,
    closeEditSheet,
    submitEdit,
    openDeleteModal,

    deleteTarget,
    isDeleting,
    closeDeleteModal,
    confirmDelete,

    deletedNotice,
    isRestoring,
    restoreDeletedCategory,
  } = management;

  return (
    <>
      <BottomSheet
        isOpen={isCreateOpen}
        title="새 카테고리"
        name={categoryName}
        onNameChange={setCategoryName}
        onClose={closeCreateSheet}
        onSubmit={submitCreate}
        submitLabel="카테고리 생성"
        isSubmitting={isCreating}
        error={categoryError}
      />

      <BottomSheet
        isOpen={isEditOpen}
        title="카테고리 수정"
        name={editingName}
        onNameChange={setEditingName}
        onClose={closeEditSheet}
        onSubmit={submitEdit}
        onDelete={openDeleteModal}
        submitLabel="수정하기"
        isSubmitting={isUpdating}
        isSubmitDisabled={editingCategory?.isMock}
        error={
          editingCategory?.isMock
            ? ''
            : categoryError
        }
        showDelete={!editingCategory?.isMock}
      />

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title={
          deleteTarget
            ? `'${deleteTarget.name}' 카테고리를 삭제하시겠습니까?`
            : ''
        }
        description="이 카테고리에 저장된 사진도 함께 삭제됩니다."
        error={categoryError}
        confirmLabel="삭제하기"
        confirmingLabel="삭제 중..."
        isConfirming={isDeleting}
        variant="danger"
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />

      {deletedNotice && (
        <div className="fixed inset-x-0 bottom-28 z-[55] mx-auto w-full max-w-md px-4">
          <div className="flex items-center justify-between rounded-full bg-gray-100 px-4 py-3 shadow-lg">
            <p className="min-w-0 truncate text-sm">
              ‘{deletedNotice.name}’과 사진{' '}
              {deletedNotice.deletedBestPickCount}장을
              삭제했어요.
            </p>

            <button
              type="button"
              onClick={restoreDeletedCategory}
              disabled={isRestoring}
              className="ml-3 shrink-0 font-semibold text-primary disabled:opacity-50"
            >
              {isRestoring ? '복구 중...' : '되돌리기'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryManagementOverlays;