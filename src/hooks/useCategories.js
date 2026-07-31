import { useCallback, useEffect, useState } from 'react';

import { createCategory, 
         getCategories,
         updateCategory,
         deleteCategory,
         restoreCategory,
} from '../api/categoryApi';

const useCategories = () => {
  const [categories, setCategories] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false); //버튼 연타 방지용
  const [isUpdating, setIsUpdating] = useState(false); //카테고리 이름 변경중
  const [isDeleting, setIsDeleting] = useState(false); //카테고리 삭제중
  const [isRestoring, setIsRestoring] = useState(false); //카테고리 복구중
  const [categoryError, setCategoryError] = useState('');
  const [fetchError, setFetchError] = useState('');

  const fetchCategories = useCallback(() => { //카테고리 목록 가져오기
    return getCategories() //카테고리 조회 API를 호출 및 promise 반환, return은 await fetchCategories();를 하기 위함
        .then((result) => {
        setCategories(Array.isArray(result) ? result : []);
        setFetchError('');
        })
        .catch((error) => {
            console.error('카테고리 조회 실패:', error);

            setFetchError(
              error.response?.data?.message ??
                '카테고리를 불러오지 못했습니다.',
            );
        })
        .finally(() => {
        setIsLoading(false);
        });
    }, []);

  const addCategory = async (name) => { //카테고리 생성
    const trimmedName = name.trim(); //trim은 공백 제거

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

  const renameCategory = async (categoryId, name) => { //카테고리 이름 수정
    const trimmedName = name.trim();

    if (!trimmedName || trimmedName.length > 50) {
      setCategoryError(
        '카테고리 이름은 1자 이상 50자 이하로 입력해주세요.',
      );

      return null;
    }

    try {
      setIsUpdating(true);
      setCategoryError('');

      const updatedCategory = await updateCategory(
        categoryId,
        trimmedName,
      );

      setCategories((previousCategories) =>
        previousCategories.map((category) =>
          category.id === categoryId
            ? { ...category, ...updatedCategory } //수정 응답에 id, name만 오므로 기존 사진·날짜·개수 정보를 보존
            : category,
        ),
      );

      return updatedCategory;
    } catch (error) {
      const errorCode = error.response?.data?.code;

      if (errorCode === 'CATEGORY_DUPLICATE') {
        setCategoryError('이미 존재하는 카테고리입니다.');
      } else if (errorCode === 'CATEGORY_PROTECTED') {
        setCategoryError('미분류 카테고리는 수정할 수 없습니다.');
      } else {
        setCategoryError(
          error.response?.data?.message ??
            '카테고리 이름을 수정하지 못했습니다.',
        );
      }

      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  const removeCategory = async (categoryId) => { //카테고리 삭제
    try {
      setIsDeleting(true);
      setCategoryError('');

      const deletionResult = await deleteCategory(categoryId);

      setCategories((previousCategories) =>
        previousCategories.filter( //filter()는 배열의 요소들을 하나씩 검사한 뒤, 조건이 true인 요소만 새 배열에 남김
          (category) => category.id !== categoryId, //삭제할 ID와 다른 카테고리들은 남김
        ),
      );

      return deletionResult;
    } catch (error) {
      const errorCode = error.response?.data?.code;

      if (errorCode === 'CATEGORY_PROTECTED') {
        setCategoryError('미분류 카테고리는 삭제할 수 없습니다.');
      } else if (errorCode === 'CATEGORY_NOT_FOUND') {
        setCategoryError('존재하지 않는 카테고리입니다.');
      } else if (errorCode === 'FORBIDDEN_RESOURCE') {
        setCategoryError('삭제할 권한이 없습니다.');
      } else {
        setCategoryError(
          error.response?.data?.message ??
            '카테고리를 삭제하지 못했습니다.',
        );
      }

      return null;
    } finally {
      setIsDeleting(false);
    }
  };

  const recoverCategory = async (categoryId) => { //카테고리 복구
    try {
      setIsRestoring(true);
      setCategoryError('');

      const restorationResult = await restoreCategory(categoryId);

      await fetchCategories(); //화면에 보이는 카테고리 목록을 서버의 최신상태로 다시 맞추기 위함

      return restorationResult;
    } catch (error) {
      const errorCode = error.response?.data?.code;

      if (errorCode === 'CATEGORY_NOT_FOUND') {
        setCategoryError('복구할 카테고리를 찾지 못했습니다.');
      } else {
        setCategoryError(
          error.response?.data?.message ??
            '카테고리를 복구하지 못했습니다.',
        );
      }

      return null;
    } finally {
      setIsRestoring(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    isLoading,
    isCreating,
    categoryError,
    fetchError,
    isUpdating,
    isDeleting,
    isRestoring,
    recoverCategory,
    removeCategory,
    renameCategory,
    addCategory,
    fetchCategories,
  };
};

export default useCategories;