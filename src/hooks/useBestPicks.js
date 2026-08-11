import { useEffect, useState } from 'react';

import { getBestPicks } from '../api/bestPickApi';

const useBestPicks = (
    categoryId,
    isEnabled = true,
) => {
  const [bestPicks, setBestPicks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    if (!isEnabled) {
        return undefined;
    }
    let isCancelled = false; 
    //조회가 끝나기 전에 다른 화면으로 이동했을 때, 이미 사라진 화면의 상태를 변경하지 않게 막아주는 역할

    getBestPicks(categoryId)
      .then((result) => {
        if (isCancelled) return;

        setBestPicks(result);
        setFetchError('');
      })
      .catch((error) => {
        if (isCancelled) return;

        console.error('베스트픽 조회 실패:', error);

        setFetchError(
          error.response?.data?.message ??
            '사진을 불러오지 못했습니다.',
        );
      })
      .finally(() => {
        if (isCancelled) return;

        setIsLoading(false);
      });

    return () => { //cleanup 함수. useEffect가 끝나기 전에 실행됨. 즉, 화면이 사라지기 전에 실행됨
      isCancelled = true;
    };
  }, [categoryId, isEnabled]);

  return {
    bestPicks: isEnabled ? bestPicks : [],
    isLoading: isEnabled ? isLoading : false,
    fetchError: isEnabled ? fetchError : '',
};
};

export default useBestPicks;