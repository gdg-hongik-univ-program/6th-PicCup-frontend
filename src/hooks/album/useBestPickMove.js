import { useState } from 'react';

import { moveBestPicks } from '../../api/bestPickApi';

const useBestPickMove = ({
  ids,
  sourceCategoryId,
  navigate,
}) => {
  const [isMoving, setIsMoving] =
    useState(false);
  const [moveError, setMoveError] =
    useState('');

  const moveToCategory = async (
    targetCategory,
  ) => {
    if (isMoving) return;

    if (
      !Array.isArray(ids) ||
      ids.length === 0
    ) {
      setMoveError(
        '이동할 사진 정보가 없습니다.',
      );
      return;
    }

    if (
      String(targetCategory.id) ===
      String(sourceCategoryId)
    ) {
      setMoveError(
        '현재 앨범과 다른 앨범을 선택해주세요.',
      );
      return;
    }

    try {
      setIsMoving(true);
      setMoveError('');

      const result = await moveBestPicks({
        ids,
        targetCategoryId:
          targetCategory.id,
      });

      navigate(
        `/album/${result.categoryId}`,
        {
          replace: true,
          state: {
            albumName:
              result.categoryName ??
              targetCategory.name,
          },
        },
      );
    } catch (error) {
      console.error(
        '다른 앨범으로 이동 실패:',
        error,
      );

      setMoveError(
        error.response?.data?.message ??
          '사진을 이동하지 못했습니다.',
      );
    } finally {
      setIsMoving(false);
    }
  };

  return {
    isMoving,
    moveError,
    moveToCategory,
  };
};

export default useBestPickMove;