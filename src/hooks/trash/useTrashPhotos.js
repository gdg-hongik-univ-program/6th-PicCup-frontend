import {
  useEffect,
  useState,
} from 'react';

import { getDeletedBestPicks } from '../../api/bestPickApi';
import { TRASH_RETENTION_DAYS } from '../../constants/trash';
import { getTrashPhotos } from '../../libs/photoDB';
import { calculateDaysUntil } from '../../utils/trash';

const useTrashPhotos = () => {
  const [rejectedPhotos, setRejectedPhotos] = useState([]);
  //탈락사진 목록

  const [
    serverDeletedBestPicks,
    setServerDeletedBestPicks,
  ] = useState([]);

  const [isRejectedLoading, setIsRejectedLoading] = useState(true);
  const [isServerLoading, setIsServerLoading] = useState(true);
  const [rejectedError, setRejectedError] = useState('');
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    let isCancelled = false; //상태 업데이트 막음
    const objectUrls = [];

    const loadRejectedPhotos = async () => {
      try {
        const photos = await getTrashPhotos();

        const photosWithPreview = photos.map(
          (photo) => {
            const previewUrl =
              URL.createObjectURL(photo.blob);

            objectUrls.push(previewUrl);

            return {
              ...photo,
              previewUrl,
              daysLeft: photo.expiresAt
                ? calculateDaysUntil(
                    photo.expiresAt,
                  )
                : TRASH_RETENTION_DAYS.rejected, //expiresAt이 없을 경우
            };
          },
        );

        if (isCancelled) return;

        setRejectedPhotos(photosWithPreview);
        setRejectedError('');
      } catch (error) {
        if (isCancelled) return;

        console.error(
          '탈락 사진 휴지통 조회 실패:',
          error,
        );

        setRejectedError(
          '탈락 사진을 불러오지 못했습니다.',
        );
      } finally {
        if (!isCancelled) {
          setIsRejectedLoading(false);
        }
      }
    };

    loadRejectedPhotos();

    return () => {
      isCancelled = true;

      objectUrls.forEach((objectUrl) => {
        URL.revokeObjectURL(objectUrl); //패이지 떠날때 정리
      });
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const loadDeletedBestPicks = async () => {
      try {
        const result =
          await getDeletedBestPicks();

        if (isCancelled) return;

        setServerDeletedBestPicks(result);
        setServerError('');
      } catch (error) {
        if (isCancelled) return;

        console.error(
          '삭제한 베스트픽 조회 실패:',
          error,
        );

        setServerError(
          error.response?.data?.message ??
            '삭제한 베스트픽을 불러오지 못했습니다.',
        );
      } finally {
        if (!isCancelled) {
          setIsServerLoading(false);
        }
      }
    };

    loadDeletedBestPicks();

    return () => {
      isCancelled = true;
    };
  }, []);

  const deletedBestPicks = serverDeletedBestPicks;

  const removeRejectedPhotos = (photoIds) => {
    setRejectedPhotos((previousPhotos) =>
      previousPhotos.filter(
        (photo) =>
          !photoIds.includes(photo.id),
      ),
    );
  }; //앨범에 추가된 사진 휴지통에서 삭제

  const removeServerDeletedBestPicks = (
    photoIds,
  ) => {
    setServerDeletedBestPicks(
      (previousPhotos) =>
        previousPhotos.filter(
          (photo) =>
            !photoIds.includes(photo.id),
        ),
    );
  }; //서버 영구삭제된 베스트픽 휴지통에서 삭제

  return {
    rejectedPhotos,
    deletedBestPicks,
    isRejectedLoading,
    isServerLoading,
    rejectedError,
    serverError,
    removeRejectedPhotos,
    removeServerDeletedBestPicks,
  };
};

export default useTrashPhotos;
