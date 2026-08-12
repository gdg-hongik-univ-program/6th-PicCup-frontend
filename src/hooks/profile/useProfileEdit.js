import {
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router';

import {
  updateProfile,
  updateProfileImage,
} from '../../api/authApi';
import useAuthStore from '../../store/useAuthStore';

const useProfileEdit = () => {
  const navigate = useNavigate();

  const imageInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const user = useAuthStore(
    (state) => state.user,
  );

  const setAuthenticatedUser = useAuthStore(
    (state) => state.setAuthenticatedUser,
  );

  const [nickname, setNickname] = useState(
    user?.nickname ?? '',
  );

  const [profileImage, setProfileImage] =
    useState({
      preview: user?.profileImageUrl ?? null,
      file: null,
      bestPickId: null,
    });

  const [isPhotoSheetOpen, setIsPhotoSheetOpen] =
    useState(false);

  const [
    isBestPickSelectorOpen,
    setIsBestPickSelectorOpen,
  ] = useState(false);

  const [profileError, setProfileError] =
    useState('');

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleSelectedFile = (event) => { //기기 사진 읽고 미리보기 만들기
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) return;

    const reader = new FileReader(); //브라우저에서 파일 내용 읽는 객체

    reader.onload = () => {
      setProfileImage({
        preview: reader.result,
        file: selectedFile, //서버로 업로드할 실체
        bestPickId: null, //기기 이미지이므로
      });
    };

    reader.readAsDataURL(selectedFile); //URL 로 읽기
    setProfileError('');
  };

  const handleLoadImage = () => { //기기의 사진 선택창을 열기
    setIsPhotoSheetOpen(false);
    imageInputRef.current?.click();
  };

  const handleSelectBestPick = () => {
    setIsPhotoSheetOpen(false);
    setIsBestPickSelectorOpen(true);
  };

  const handleBestPickSelected = (photo) => { //프로필 베스트픽 선택완료
    if (!photo) return;

    setProfileImage({ //개발중엔 목업사진으로
      preview: photo.imageUrl,
      file: null,
      bestPickId: photo.isMock
        ? null
        : photo.id,
    });

    setProfileError('');
    setIsBestPickSelectorOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedNickname = nickname.trim();

    if (!trimmedNickname) {
      setProfileError(
        '닉네임을 입력해주세요.',
      );
      return;
    }

    const isPreviewMode =
      import.meta.env.DEV &&
      import.meta.env.VITE_AUTH_PREVIEW ===
        'true';

    if (isPreviewMode) {
      setAuthenticatedUser({
        ...user,
        nickname: trimmedNickname,
        profileImageUrl:
          profileImage.preview,
      });

      navigate('/mypage', {
        replace: true,
      });

      return;
    }

    try {
      setIsSubmitting(true);
      setProfileError('');

      let nextUser = {
        ...user,
      };

      if (
        trimmedNickname !== user?.nickname
      ) {
        const updatedProfile =
          await updateProfile({
            nickname: trimmedNickname,
          });

        nextUser = {
          ...nextUser,
          ...updatedProfile,
        };
      }

      if (
        profileImage.file ||
        profileImage.bestPickId !== null
      ) {
        const updatedImage =
          await updateProfileImage({
            file: profileImage.file,
            bestPickId:
              profileImage.bestPickId,
          });

        nextUser = {
          ...nextUser,
          profileImageUrl:
            updatedImage.profileImageUrl,
        };
      }

      setAuthenticatedUser(nextUser);

      navigate('/mypage', {
        replace: true,
      });
    } catch (error) {
      console.error(
        '프로필 수정 실패:',
        error,
      );

      setProfileError(
        error.response?.data?.message ??
          '프로필을 수정하지 못했습니다.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNicknameChange = (event) => {
    setNickname(event.target.value);
    setProfileError('');
  };

  const openPhotoSheet = () => {
    setIsPhotoSheetOpen(true);
  };

  const closePhotoSheet = () => {
    setIsPhotoSheetOpen(false);
  };

  const closeBestPickSelector = () => {
    setIsBestPickSelectorOpen(false);
  };

  return {
    imageInputRef,
    cameraInputRef,
    nickname,
    profileImage,
    isPhotoSheetOpen,
    isBestPickSelectorOpen,
    profileError,
    isSubmitting,
    handleSelectedFile,
    handleLoadImage,
    handleSelectBestPick,
    handleBestPickSelected,
    handleSubmit,
    handleNicknameChange,
    openPhotoSheet,
    closePhotoSheet,
    closeBestPickSelector,
  };
};

export default useProfileEdit;
