import { useState } from 'react';

import {
  deleteBestPicks,
  updateBestPickLike,
} from '../../api/bestPickApi';
import {
  downloadImage,
  shareImage,
} from '../../libs/imageActions';

const useBestPickActions = ({
  photo,
  setPhoto,
  navigate,
}) => {
  const [isUpdatingLike, setIsUpdatingLike] = useState(false);
  const [likeError, setLikeError] = useState('');
  const [actionError, setActionError] = useState('');

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,
  ] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleToggleLike = async () => {
    if (!photo || isUpdatingLike) return;

    const nextIsLiked = !photo.isLiked;

    try {
      setIsUpdatingLike(true);
      setLikeError('');

      const updatedBestPick =
        await updateBestPickLike(
          photo.id,
          nextIsLiked,
        );

      setPhoto((previousPhoto) => ({
        ...previousPhoto,
        ...updatedBestPick,
      }));
    } catch (error) {
      console.error('베스트픽 좋아요 변경 실패:', error);

      setLikeError(
        error.response?.data?.message ??
          '좋아요 상태를 변경하지 못했습니다.',
      );
    } finally {
      setIsUpdatingLike(false);
    }
  };

  const handleDownload = async () => {
    if (!photo) return;

    try {
      setActionError('');

      await downloadImage({
        imageUrl: photo.imageUrl,
        fileName:
          `piccup-${photo.capturedDate}-${photo.id}.jpg`,
      });
    } catch (error) {
      console.error('사진 다운로드 실패:', error);

      setActionError(
        '사진을 다운로드하지 못했습니다.',
      );
    }
  };

  const handleShare = async () => {
    if (!photo) return;

    try {
      setActionError('');

      await shareImage({
        imageUrl: photo.imageUrl,
        fileName:
          `piccup-${photo.capturedDate}-${photo.id}.jpg`,
      });
    } catch (error) {
      if (error.name === 'AbortError') return;

      console.error('사진 공유 실패:', error);

      setActionError(
        '사진을 공유하지 못했습니다.',
      );
    }
  };

  const handleDeleteOpen = () => {
    setIsMenuOpen(false);
    setDeleteError('');
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!photo || isDeleting) return;

    try {
      setIsDeleting(true);
      setDeleteError('');

      await deleteBestPicks([photo.id]);

      setIsDeleteConfirmOpen(false);
      navigate(-1);
    } catch (error) {
      console.error('베스트픽 삭제 실패:', error);

      setDeleteError(
        error.response?.data?.message ??
          '사진을 삭제하지 못했습니다.',
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen((previous) => !previous);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const closeDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
  };

  const handleMoveOpen = () => { //다른 앨범으로 이동
    if (!photo) return;

    setIsMenuOpen(false);

    navigate('/album/move', {
      state: {
        ids: [photo.id],
        sourceCategoryId:
          photo.categoryId,
      },
    });
  };

  return {
    isUpdatingLike,
    likeError,
    actionError,
    isMenuOpen,
    isDeleteConfirmOpen,
    isDeleting,
    deleteError,
    handleToggleLike,
    handleDownload,
    handleShare,
    handleMoveOpen,
    handleDeleteOpen,
    handleDeleteConfirm,
    toggleMenu,
    closeMenu,
    closeDeleteConfirm,
  };
};

export default useBestPickActions;
