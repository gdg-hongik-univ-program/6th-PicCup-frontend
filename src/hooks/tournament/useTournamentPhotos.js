import { useEffect, useState } from 'react';

import {
  getPhotosBySessionId,
  losersToTrash,
} from '../../libs/photoDB';

const useTournamentPhotos = ({
  sessionId,
  startTournament,
  winner,
  selectedCategory,
}) => {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { //화면이 렌더링된 다음 IndexedDB 조회 작업을 실행
    const loadPhotos = async () => { //비동기 작업
      try {
        const sessionPhotos =
          await getPhotosBySessionId(sessionId);
        const photosWithPreview =
          sessionPhotos.map((photo) => ({
            ...photo,
            previewUrl: URL.createObjectURL(photo.blob), //각 사진에 previewUrl추가. <img>의 src에는 Blob객체를 그대로 넣을 수 없기 때문
          }));
        setPhotos(photosWithPreview);
        startTournament(photosWithPreview);

      } catch (error) {
        console.error('토너먼트 사진 불러오기 실패:', error);
      } finally { //성공하든 실패하든 무조건 실행. 로딩상태 끔
        setIsLoading(false);
      }
    };
    loadPhotos();
  }, [sessionId, startTournament]); //페이지 첨 렌더링 될 때, sessionId가 바뀔때 실행

  useEffect(() => { //winner가 정해졌을 때 탈락사진을 휴지통으로 옮김
    if (!winner) {
      return;
    }

    const trashLosers = async () => {
      try {
        const trashedCount = await losersToTrash(
          sessionId,
          winner.id,
          selectedCategory,
        );

        if (trashedCount > 0) {
          console.log(`${trashedCount}장의 탈락 사진을 휴지통으로 이동했습니다.`);
        }
      } catch (error) {
        console.error('탈락 사진 휴지통 이동 실패:', error);
      }
    };

    trashLosers();
  }, [winner, sessionId, selectedCategory]);

  return {
    photos,
    isLoading,
  };
};

export default useTournamentPhotos;
