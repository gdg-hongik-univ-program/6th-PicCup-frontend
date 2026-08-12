import { useParams } from 'react-router';

import useCategoryStore from '../store/useCategoryStore';
import useBestPickUpload from '../hooks/tournament/useBestPickUpload';
import useTournament from '../hooks/tournament/useTournament';
import useTournamentPhotos from '../hooks/tournament/useTournamentPhotos';

import TournamentWinner from '../components/tournament/TournamentWinner';
import TournamentMatch from '../components/tournament/TournamentMatch';

const TournamentPage = () => {
  const { sessionId } = useParams(); //라우터에서 주소 뒷부분(변수)를 객체로 반환해서 sessionId에 저장

  const selectedCategory = useCategoryStore(
    (state) => state.selectedCategory,
  );

  const {
    winner,
    firstPhoto,
    secondPhoto,
    roundPhotos,
    matchIndex,
    startTournament, // 불러온 사진으로 토너먼트를 초기화하는 함수
    selectPhoto, //사용자 선택 사진을 처리하는  함수
  } = useTournament();

  const {
    photos,
    isLoading,
  } = useTournamentPhotos({
    sessionId,
    startTournament,
    winner,
    selectedCategory,
  });

  const { 
    handleUploadBestPick, //커스텀 훅에서 전달받음
    isUploading,
    uploadError,
    uploadedBestPick,
  } = useBestPickUpload({ //커스텀 hook 호출
    winner,
    selectedCategory,
    candidateCount: photos.length, //커스텀 훅으로 전달함
  })

  if (isLoading) {
    return (
        <main>
            <p className="p-4">사진 불러오는 중...</p>
        </main>
    );
  }
  if (photos.length === 0) {
    return (
        <main>
            <p className="p-4">토너먼트에 사용할 사진이 없어요.</p>
        </main>
    )
  }

  return (
    <main className="flex h-dvh flex-col overflow-hidden">
        {winner ? (
            <TournamentWinner //우승 페이지
                winner={winner} //props이름={부모(토너먼트 페이지)가 가진 값}
                onUpload={handleUploadBestPick}
                isUploading={isUploading}
                uploadError={uploadError}
                uploadedBestPick={uploadedBestPick}
            />
        ) : (
            <TournamentMatch 
                firstPhoto={firstPhoto}
                secondPhoto={secondPhoto}
                onSelectPhoto={selectPhoto}
                roundPhotosCount={roundPhotos.length}
                matchIndex={matchIndex}
                candidateCount={photos.length}
            />
        )}
    </main>
  );
};

export default TournamentPage;

/*
1. 주소에서 sessionId 받기
2. IndexedDB에서 그 세션의 사진 불러오기
3. 두 장씩 보여주고 한 장 선택받기
4. 선택된 사진들로 다음 라운드를 반복해서 우승자 만들기
*/
