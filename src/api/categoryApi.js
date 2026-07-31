import { del, get, patch, post } from './request';

const categoryConfig = {
  headers: {
    'X-User-Id': '1',
  },
};

export const getCategories = async () => { //카테고리 목록 조회
  const response = await get('/categories', categoryConfig);

  return response.data;
};

export const createCategory = async (name) => { //카테고리 생성
  const response = await post('/categories', { name }, categoryConfig);

  return response.data;
};

export const updateCategory = async (categoryId, name) => { //카테고리 이름 수정
  const response = await patch(`/categories/${categoryId}`, {name}, categoryConfig);

  return response.data;
};

export const deleteCategory = async (categoryId) => { //카테고리 삭제
  const response = await del(`/categories/${categoryId}`, categoryConfig);

  return response.data;
};

export const restoreCategory = async (categoryId) => { //카테고리 복구
  const response = await post(`/categories/${categoryId}/restore`,
    null,
    categoryConfig,
  );

  return response.data;
};