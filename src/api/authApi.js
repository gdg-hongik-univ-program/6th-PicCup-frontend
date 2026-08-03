import { get, post } from './request';

export const signup = async ({ nickname, email, password }) => {
  const response = await post('/users/signup', {
    nickname,
    email,
    password,
  });

  return response.data;
};

export const login = async ({ email, password }) => {
  const response = await post('/users/login', {
    email,
    password,
  });

  return response.data;
};

export const logout = async () => {
  const response = await post('/users/logout');

  return response.data;
};

export const getMe = async () => {
  const response = await get('/users/me');

  return response.data;
};

export const resetPassword = async ({ email, newPassword }) => {
  const response = await post('/users/password/reset', {
    email,
    newPassword,
  });

  return response.data;
};