import BottomSheet from '../layout/BottomSheet';
import ConfirmModal from '../layout/ConfirmModal';
import Snackbar from '../layout/Snackbar';

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
    setDeletedNotice,
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
        error={categoryError}
        showDelete
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
        isConfirming={isDeleting}
        variant="danger"
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />

      <Snackbar
        message={
          deletedNotice
            ? `‘${deletedNotice.name}’과 사진 ${deletedNotice.deletedBestPickCount}장을 삭제했어요.`
            : ''
        }
        duration={5000}
        positionClassName="bottom-28"
        actionLabel="되돌리기"
        isActionDisabled={isRestoring}
        onAction={restoreDeletedCategory}
        onClose={() => setDeletedNotice(null)}
      />
    </>
  );
};

export default CategoryManagementOverlays;
