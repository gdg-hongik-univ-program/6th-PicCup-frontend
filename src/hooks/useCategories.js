import { useCallback, useEffect, useState } from 'react';

import { createCategory, getCategories } from '../api/categoryApi';

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [totalBestPickCount, setTotalBestPickCount] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false); //버튼 연타 방지용
  const [categoryError, setCategoryError] = useState('');

  const fetchCategories = useCallback(() => {
    getCategories()
        .then((result) => {
        setCategories(result.categories ?? []);
        setTotalBestPickCount(
            result.totalBestPickCount ?? 0,
        );
        setCategoryError('');
        })
        .catch((error) => {
            console.error('카테고리 조회 실패:', error);

            setCategoryError(
                error.response?.data?.message ??
                    '카테고리를 불러오지 못했습니다.',
            );
        })
        .finally(() => {
        setIsLoading(false);
        });
    }, []);

  const addCategory = async (name) => { //카테고리 생성
    const trimmedName = name.trim(); 

    if (!trimmedName) { //공백 검사
      setCategoryError(
        '카테고리 이름을 입력해주세요.',
      );

      return null;
    }

    try {
      setIsCreating(true);
      setCategoryError('');

      const createdCategory = await createCategory(trimmedName);

      setCategories((previousCategories) => [
        ...previousCategories,
        createdCategory,
      ]);

      return createdCategory;
    } catch (error) {
      console.error('카테고리 생성 실패:', error);

      if (error.response?.status === 409) {
        setCategoryError(
          '이미 존재하는 카테고리입니다.',
        );
      } else {
        setCategoryError(
          error.response?.data?.message ??
            '카테고리를 생성하지 못했습니다.',
        );
      }

      return null;
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    totalBestPickCount,
    isLoading,
    isCreating,
    categoryError,
    addCategory,
    fetchCategories,
  };
};

export default useCategories;