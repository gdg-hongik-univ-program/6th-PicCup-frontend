import {
  get,
  patch,
  post,
  put,
} from './request';

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

export const updateProfile = async ({ //닉네임 수정
  nickname,
}) => {
  const response = await patch('/users/me', {
    nickname,
  });

  return response.data;
};

export const updateProfileImage = async ({ //프로필 사진 수정
  file = null,
  bestPickId = null,
}) => {
  const hasFile = Boolean(file);
  const hasBestPick =
    bestPickId !== null &&
    bestPickId !== undefined;

  if (hasFile === hasBestPick) {
    throw new Error(
      'file과 bestPickId 중 하나만 전달해야 합니다.',
    );
  }

  const formData = new FormData();

  if (file) { //직접 촬영 혹은 기기에서 가져온 사진 사용
    formData.append('file', file);
  }

  if (hasBestPick) { //best pick 사용
    formData.append(
      'bestPickId',
      String(bestPickId),
    );
  }

  const response = await put(
    '/users/me/profile-image',
    formData,
  );

  return response.data;
};
