import { get, post } from './request';

export const getCategories = async () => { //카테고리 목록 조회
  const response = await get('/categories');

  return response.data;
};

export const createCategory = async (name) => { //카테고리 생성
  const response = await post('/categories', {
    name,
  });

  return response.data;
};