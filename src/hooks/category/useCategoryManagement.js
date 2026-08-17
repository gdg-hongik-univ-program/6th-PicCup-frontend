import { useState } from 'react';

import useCategories from './useCategories';

const useCategoryManagement = ({
  onCategoryCreated, //카테고리 생성완료 콜백
} = {}) => {
  const {
    categories,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isRestoring,
    categoryError,
    fetchError,
    addCategory,
    renameCategory,
    removeCategory,
    recoverCategory,
    clearCategoryError,
  } = useCategories();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingName, setEditingName] = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletedNotice, setDeletedNotice] = useState(null); //복구를 위해

  const openCreateSheet = () => {
    clearCategoryError();
    setCategoryName('');
    setIsCreateOpen(true);
  };

  const closeCreateSheet = () => {
    clearCategoryError();
    setCategoryName('');
    setIsCreateOpen(false);
  };

  const submitCreate = async () => {
    const createdCategory = await addCategory(
      categoryName,
    );

    if (!createdCategory) return;

    closeCreateSheet();

    // 생성된 카테고리를 선택하고 다음 화면으로 이동
    onCategoryCreated?.(createdCategory);
  };

  const openEditSheet = (category) => {
    if (category.isDefault) return;

    clearCategoryError();
    setEditingCategory(category);
    setEditingName(category.name);
    setIsEditOpen(true);
  };

  const closeEditSheet = () => {
    clearCategoryError();
    setIsEditOpen(false);
    setEditingCategory(null);
    setEditingName('');
  };

  const submitEdit = async () => {
    if (!editingCategory) return;

    const updatedCategory = await renameCategory(
      editingCategory.id,
      editingName,
    );

    if (!updatedCategory) return;

    closeEditSheet();
  };

  const openDeleteModal = () => {
    if (!editingCategory) return;

    setDeleteTarget(editingCategory);
    closeEditSheet();
  };

  const closeDeleteModal = () => {
    clearCategoryError();
    setDeleteTarget(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    const deletionResult = await removeCategory(
      deleteTarget.id,
    );

    if (!deletionResult) return;

    setDeletedNotice({
      id: deletionResult.id ?? deleteTarget.id,
      name: deleteTarget.name,
      deletedBestPickCount:
        deletionResult.deletedBestPickCount ?? 0,
    });

    setDeleteTarget(null);

    setTimeout(() => {
      setDeletedNotice(null);
    }, 5000);
  };

  const restoreDeletedCategory = async () => {
    if (!deletedNotice) return;

    const restorationResult = await recoverCategory(
      deletedNotice.id,
    );

    if (!restorationResult) return;

    setDeletedNotice(null);
  };

  

  return {
    categories,
    isLoading,
    fetchError,
    categoryError,

    isCreateOpen,
    categoryName,
    setCategoryName,
    isCreating,
    openCreateSheet,
    closeCreateSheet,
    submitCreate,

    isEditOpen,
    editingCategory,
    editingName,
    setEditingName,
    isUpdating,
    openEditSheet,
    closeEditSheet,
    submitEdit,

    deleteTarget,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,

    deletedNotice,
    isRestoring,
    setDeletedNotice,
    restoreDeletedCategory,
  };
};

export default useCategoryManagement;
