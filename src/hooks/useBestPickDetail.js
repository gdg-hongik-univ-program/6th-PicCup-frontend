import { useEffect, useState } from 'react';

import { getBestPickDetail } from '../api/bestPickApi';

const useBestPickDetail = (
  bestPickId, //URL의 사진 ID
  initialPhoto,
  isEnabled = true, //목업 사진과 실제 API를 구분하기 위한 플래그. true면 실제 API 호출, false면 목업 사진 사용
) => {
  const [photo, setPhoto] = useState(
    () => initialPhoto ?? null, 
  ); //state 초기값을 함수로 전달하면, 컴포넌트가 처음 렌더링될 때만 실행됨. 즉, bestPickId가 바뀌어도 initialPhoto는 다시 계산되지 않음

  const [isLoading, setIsLoading] = useState(
    () => isEnabled && !initialPhoto,
  ); 

  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    if (!isEnabled) return undefined; //목업사진인 경우

    let isCancelled = false;

    getBestPickDetail(bestPickId)
      .then((result) => {
        if (isCancelled) return;

        setPhoto(result);
        setFetchError('');
      })
      .catch((error) => {
        if (isCancelled) return;

        console.error('베스트픽 상세 조회 실패:', error);

        setFetchError(
          error.response?.data?.message ??
            '사진 정보를 불러오지 못했습니다.',
        );
      })
      .finally(() => {
        if (isCancelled) return;

        setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [bestPickId, isEnabled]);

  return {
    photo,
    setPhoto,
    isLoading,
    fetchError,
  };
};

export default useBestPickDetail;