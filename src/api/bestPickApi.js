import { get, patch, post } from './request';

export const uploadBestPick = async ({
  file,
  categoryId,
  capturedDate,
  candidateCount, //토너먼트 참가 사진 수
}) => {
  const formData = new FormData();

  formData.append('file', file, 'best-pick.jpg'); //file = winner.blob
  formData.append('categoryId', categoryId); //백엔드쪽에서 Long으로 변환해서 받음
  formData.append('capturedDate', capturedDate);
  formData.append('candidateCount', candidateCount);//백엔드쪽에서 int로 변환해서 받음

  const response = await post('/best-picks', formData, {
    headers: {
      'X-User-Id': '1',
    },
  });

  return response.data; //실제 응답 데이터만 반환
};

//bestPick 기능에 필요한 실제 API 요청

export const getBestPicks = async (categoryId) => { //사진 조회 API
  const response = await get('/best-picks', {
    headers: {
      'X-User-Id': '1',
    },
    params:
      categoryId === 'all'
        ? undefined
        : { categoryId },
  });

  return Array.isArray(response.data)
    ? response.data
    : [];
};

export const getBestPickDetail = async (
  bestPickId,
) => {
  const response = await get(
    `/best-picks/${bestPickId}`,
    {
      headers: {
        'X-User-Id': '1',
      },
    },
  );

  return response.data;
};

export const updateBestPickLike = async ( //좋아요 변경 함수
  bestPickId,
  isLiked,
) => {
  const response = await patch(
    `/best-picks/${bestPickId}/like`,
    { isLiked },
    {
      headers: {
        'X-User-Id': '1',
      },
    },
  );

  return response.data;
};

export const deleteBestPicks = async (ids) => { //다중삭제
  const response = await post(
    '/best-picks/delete',
    { ids },
    {
      headers: {
        'X-User-Id': '1',
      },
    },
  );

  return response.data;
};