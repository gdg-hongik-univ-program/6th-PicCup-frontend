import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { trackEvent } from '../../libs/analytics';

import { uploadBestPick } from '../../api/bestPickApi';
import { getLocalDateString } from '../../utils/date';

const useBestPickUpload = ({
  winner,
  selectedCategory,
  candidateCount,
}) => {
  const [isUploading, setIsUploading] =useState(false);
  const [uploadError, setUploadError] =useState('');
  const [uploadedBestPick, setUploadedBestPick] = useState(null); //서버 저장 성공응답 받은 베스트픽
  // 같은 우승 사진이 중복 업로드되는 것을 방지
  const uploadedWinnerIdRef = useRef(null);

  const handleUploadBestPick = useCallback(async () => {
    if (!winner) {
      return;
    }

    if (!selectedCategory) {
      setUploadError(
        '선택된 카테고리가 없습니다.',
      );
      return;
    }

    // 같은 우승 사진은 한 번만 업로드
    if (
      uploadedWinnerIdRef.current === winner.id
    ) {
      return;
    }

    uploadedWinnerIdRef.current = winner.id;

    try {
      setIsUploading(true);
      setUploadError('');

      const result = await uploadBestPick({
        file: winner.blob,

        categoryId:
          selectedCategory.id,

        capturedDate:
          getLocalDateString(
            new Date(winner.createdAt),
          ),

        candidateCount,
      });
      // 서버 저장에 성공한 사진만 집계(ga4 이벤트: 베스트픽 저장 성공 측정)
      trackEvent('best_pick_saved', {
        feature_source: 'tournament',
        candidate_count: candidateCount,
      });

      setUploadedBestPick(result);

      console.log(
        '베스트픽 업로드 성공:',
        result,
      );
      
    } catch (error) {
      console.error(
        '베스트픽 업로드 실패:',
        error,
      );

      // 실패한 경우 다시 시도할 수 있도록 초기화
      uploadedWinnerIdRef.current = null;

      const message =
        error.response?.data?.message ??
        '베스트픽 저장에 실패했습니다.';

      setUploadError(message);
    } finally {
      setIsUploading(false);
    }
  }, [
    winner,
    selectedCategory,
    candidateCount,
  ]);

  // 우승자 결정 후 다음 작업에서 자동 업로드
  useEffect(() => {
    if (!winner) return undefined; //우승자 없음
    //지금 당장 effect 안에서 실행하지 말고, 현재 작업이 끝난 직후 실행
    const timeoutId = window.setTimeout(() => {
      void handleUploadBestPick();
    }, 0); 

    return () => {
      window.clearTimeout(timeoutId);
    }; //예약도중 컴포넌트 사라진 경우 대비
  }, [
    winner,
    handleUploadBestPick,
  ]);

  return {
    handleUploadBestPick,
    isUploading,
    uploadError,
    uploadedBestPick,
  };
};

export default useBestPickUpload;
