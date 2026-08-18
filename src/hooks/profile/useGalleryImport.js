//갤러리에서 사진을 가져오기 관리하는 커스텀 훅
import {
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router';



import { uploadBestPick } from '../../api/bestPickApi';
import { trackEvent } from '../../libs/analytics';
import { getLocalDateString } from '../../utils/date';

import {
  isSupportedImageFile,
  normalizeImageFile,
} from '../../utils/imageFile';

const useGalleryImport = () => {
  const navigate = useNavigate();
  const imageInputRef = useRef(null); //실제 <input type="file"> DOM
  const selectedImagesRef = useRef([]); //사진 미리보기 URL을 정리

  const [todayDate] = useState(() =>
    getLocalDateString(),
  ); //날짜 기본값, 미래 날짜 방지

  const [ selectedImages, setSelectedImages ] = useState([]);
  //사진 미리보기 표시용

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState(null);

  const [capturedDate, setCapturedDate] = useState(todayDate);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');

  useEffect(() => {
    selectedImagesRef.current =
      selectedImages;
  }, [selectedImages]); //업데이트

  useEffect(() => { //사진 미리보기 정리
    return () => {
      selectedImagesRef.current.forEach(
        (image) => {
          URL.revokeObjectURL(
            image.previewUrl,
          );
        },
      );
    };
  }, []);

  const openGallery = () => {
    imageInputRef.current?.click();
  }; //실제 <input type="file"> DOM
  const handleImageChange = (event) => {
    const files = Array.from(
        event.target.files ?? [],
    )
        .filter(isSupportedImageFile)
        .map(normalizeImageFile);

    event.target.value = ''; //같은 사진 재선택할경우를 대비

    if (files.length === 0) return;

    selectedImagesRef.current.forEach( //정리 먼저
      (image) => {
        URL.revokeObjectURL(
          image.previewUrl,
        );
      },
    );
    console.table(
        files.map((file) => ({
            name: file.name,
            type: file.type,
            size: file.size,
        })),
    );

    const nextImages = files.map( //새 사진 목록 만들기
      (file, index) => ({
        id: `${file.name}-${file.lastModified}-${index}`,
        file,
        previewUrl:
          URL.createObjectURL(file),
      }),
    );

    selectedImagesRef.current = nextImages;

    setSelectedImages(nextImages);
    setUploadError('');
    setUploadMessage('');
  };

  const removeImage = (imageId) => { //선택 취소
    setSelectedImages(
      (previousImages) => {
        const removedImage =
          previousImages.find(
            (image) =>
              image.id === imageId,
          );

        if (removedImage) {
          URL.revokeObjectURL(
            removedImage.previewUrl,
          );
        }

        return previousImages.filter( //배열에서도 제거
          (image) =>
            image.id !== imageId,
        );
      },
    );

    setUploadError('');
  };

  const handleCategorySelect = ( //카테고리 선택
    category,
  ) => {
    setSelectedCategory(category);
    setUploadError('');
  };

  const handleDateChange = (event) => {
    setCapturedDate(event.target.value);
    setUploadError('');
  };

  const handleUpload = async () => {
    if (selectedImages.length === 0) {
      setUploadError(
        '불러올 이미지를 선택해주세요.',
      );
      return;
    }

    if (!selectedCategory) {
      setUploadError(
        '카테고리를 선택해주세요.',
      );
      return;
    }

    if (!capturedDate) {
      setUploadError(
        '사진 날짜를 선택해주세요.',
      );
      return;
    }

    if (capturedDate > todayDate) {
      setUploadError(
        '선택할 수 없는 날짜입니다.',
      );
      return;
    }

    try {
      setIsUploading(true);
      setUploadError('');
      setUploadMessage('');

      const uploadResults = //여러장 업로드, 여러번 호출
        await Promise.allSettled( //allSettled는 일부만 성공해도 넘어감
          selectedImages.map((image) =>
            uploadBestPick({
              file: image.file,
              categoryId:
                selectedCategory.id,
              capturedDate,
              candidateCount: 1,
            }),
          ),
        );

      const successImages =
        selectedImages.filter(
          (_, index) =>
            uploadResults[index].status ===
            'fulfilled',
        );

      const failedImages =
        selectedImages.filter(
          (_, index) =>
            uploadResults[index].status ===
            'rejected',
        );

      successImages.forEach((image) => {
        // ga4 이벤트: 서버 업로드에 성공한 사진마다 이벤트 전송
        trackEvent('best_pick_saved', {
          feature_source: 'gallery_import',
          candidate_count: 1,
        });
        URL.revokeObjectURL(
          image.previewUrl,
        );
      });

      selectedImagesRef.current = failedImages;

      setSelectedImages(failedImages);

      if (failedImages.length === 0) {
        navigate(
          `/album/${selectedCategory.id}`,
          {
            replace: true,
            state: {
              albumName:
                selectedCategory.name,
            },
          },
        );

        return;
      }

      setUploadError(
        `${successImages.length}장은 추가됐지만 ${failedImages.length}장은 추가하지 못했어요.`,
      );
    } catch (error) {
      console.error(
        '갤러리 이미지 업로드 실패:',
        error,
      );

      setUploadError(
        error.response?.data?.message ??
          '이미지를 업로드하지 못했어요.',
      );
    } finally {
      setIsUploading(false);
    }
  };

  return {
    imageInputRef,
    selectedImages,
    selectedCategory,
    capturedDate,
    todayDate,
    isUploading,
    uploadError,
    uploadMessage,
    openGallery,
    handleImageChange,
    removeImage,
    handleCategorySelect,
    handleDateChange,
    handleUpload,
  };
};

export default useGalleryImport;