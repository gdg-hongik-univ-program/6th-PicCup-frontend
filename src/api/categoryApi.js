import { del, get, put, post } from './request';

export const getCategories = async () => { //카테고리 목록 조회
  const response = await get('/categories');

  return response.data;
};

export const createCategory = async (name) => { //카테고리 생성
  const response = await post('/categories', { name });

  return response.data;
};

export const updateCategory = async (categoryId, name) => { //카테고리 이름 수정
  const response = await put(`/categories/${categoryId}`, {name});

  return response.data;
};

export const deleteCategory = async (categoryId) => { //카테고리 삭제
  const response = await del(`/categories/${categoryId}`);

  return response.data;
};

export const restoreCategory = async (categoryId) => { //카테고리 복구
  const response = await post(`/categories/${categoryId}/restore`,
    null,
  );

  return response.data;
};