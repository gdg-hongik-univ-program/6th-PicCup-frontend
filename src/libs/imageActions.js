const fetchImageBlob = async (imageUrl) => {
  const response = await fetch(
    imageUrl,
    {
      mode: 'cors',
      cache: 'no-store',
    },//브라우저에 저장된 이미지 응답을 재사용하지 않고, CORS 설정이 적용된 최신 S3 응답을 다시 받기
  );

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

export const shareImage = async ({ // 이미지 공유 1장
  imageUrl,
  fileName,
  title = 'PicCup Best Pick',
}) => {
  if (navigator.share) {
    try {
      const imageBlob =
        await fetchImageBlob(imageUrl);
      
      const imageFile = new File( //Blob을 File 객체로 바꾸기
        [imageBlob],
        fileName,
        {
          type: imageBlob.type || 'image/jpeg',
        },
      );

      if (//OS 기본 공유창을 열어주는 Web Share API
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
    } catch (error) {
      if (error.name === 'AbortError') {
        throw error;
      }
      console.warn(
        '파일 공유 실패, 링크 공유로 전환:',
        error,
      );
    }

    await navigator.share({//사진 파일 대신 링크만 공유
      title,
      url: imageUrl,
    });

    return;
  }
  //공유 API가 아예 없는 브라우저라면 이미지 URL을 클립보드에 복사
  await navigator.clipboard.writeText(imageUrl);
};

export const shareImages = async ({ //다중 공유
  photos,
  title = 'PicCup Best Picks',
}) => {
  if (photos.length === 0) return;

  const imageFiles = [];

  try {
    // 모바일 메모리 부담을 줄이기 위해 순서대로 요청
    for (const photo of photos) {
      const imageBlob =
        await fetchImageBlob(
          photo.imageUrl,
        );

      imageFiles.push(
        new File(
          [imageBlob],
          `piccup-${photo.capturedDate}-${photo.id}.jpg`,
          {
            type:
              imageBlob.type ||
              'image/jpeg',
          },
        ),
      );
    }

    // 파일 다중 공유가 가능한 경우
    if (
      navigator.share &&
      navigator.canShare?.({
        files: imageFiles,
      })
    ) {
      await navigator.share({
        title,
        files: imageFiles,
      });

      return;
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }

    console.warn(
      '다중 파일 공유 실패, 링크 공유로 전환:',
      error,
    );
  }

  const imageUrls = photos
    .map((photo) => photo.imageUrl)
    .join('\n');

  // 파일 공유 불가 시 링크 목록 공유
  if (navigator.share) {
    await navigator.share({
      title,
      text: imageUrls,
    });

    return;
  }

  await navigator.clipboard.writeText(
    imageUrls,
  );
};

//이미지 다운로드 및 공유 기능을 별도의 유틸 함수로 분리