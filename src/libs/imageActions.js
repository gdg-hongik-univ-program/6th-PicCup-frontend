const fetchImageBlob = async (imageUrl) => {
  const response = await fetch(imageUrl);

  if (!response.ok) {
    throw new Error('이미지 요청에 실패했습니다.');
  }

  return response.blob();
};

export const downloadImage = async ({
  imageUrl,
  fileName,
}) => {
  const imageBlob = await fetchImageBlob(imageUrl);
  const objectUrl = URL.createObjectURL(imageBlob);
  //브라우저가 임시로 접근할 수 있는 URL

  try {
    const downloadLink =
      document.createElement('a'); //a태그 생성

    downloadLink.href = objectUrl; //임시 URL로 이동
    downloadLink.download = fileName; //download 속성으로 처리

    document.body.appendChild(downloadLink); //body에 임시 다운로드 링크 추가
    downloadLink.click(); //클릭
    downloadLink.remove(); //제거
  } finally {
    URL.revokeObjectURL(objectUrl); //임시 URL을 없앰
  }
};

export const shareImage = async ({
  imageUrl,
  fileName,
  title = 'PicCup Best Pick',
}) => {
  const imageBlob = await fetchImageBlob(imageUrl);

  const imageFile = new File( //Blob을 File 객체로 바꾸기
    [imageBlob],
    fileName,
    {
      type: imageBlob.type || 'image/jpeg',
    },
  );

  if (//OS 기본 공유창을 열어주는 Web Share API
    navigator.share && //공유 API 자체를 지원하나?
    navigator.canShare?.({//이미지 파일 자체를 공유할 수 있나?
      files: [imageFile],
    })
  ) {
    await navigator.share({
      title,
      files: [imageFile],
    });

    return;
  }

  if (navigator.share) { //사진 파일 대신 링크만 공유
    await navigator.share({
      title,
      url: imageUrl,
    });

    return;
  }
  //공유 API가 아예 없는 브라우저라면 이미지 URL을 클립보드에 복사
  await navigator.clipboard.writeText(imageUrl);
};

//이미지 다운로드 및 공유 기능을 별도의 유틸 함수로 분리