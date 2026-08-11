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

import AuthButton from '../../components/auth/AuthButton';
import BackHeader from '../../components/layout/BackHeader';
import ProfileAvatar from '../../components/profile/ProfileAvatar';
import ProfilePhotoActionSheet from '../../components/profile/ProfilePhotoActionSheet';
import FilledCameraIcon from '../../components/icons/FilledCameraIcon';
import BestPickProfileSelector from '../../components/profile/BestPickProfileSelector';

const ProfileEditPage = () => {
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

  return (
    <main className="min-h-dvh px-4 py-4">
      <form
        className="flex min-h-[calc(100dvh-2rem)] flex-col"
        onSubmit={handleSubmit}
      >
        <BackHeader title="내 정보 수정" />

        <section className="flex flex-1 flex-col px-4 pt-10">
          <div className="flex flex-col items-center">
            <div className="relative">
              <ProfileAvatar
                src={profileImage.preview}
                alt="프로필 이미지"
                className="size-24"
              />

              <button
                type="button"
                onClick={() =>
                  setIsPhotoSheetOpen(true)
                }
                className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-black/5"
                aria-label="프로필 사진 설정"
              >
                <FilledCameraIcon size={22} />
              </button>
            </div>
          </div>

          <div className="mt-4">
            <p className="flex items-center justify-center mb-3 mt-8 text-base font-medium">
              닉네임 수정
            </p>
            <label
              htmlFor="profile-nickname"
              className="sr-only"
            >
              닉네임
            </label>

            <input
              id="profile-nickname"
              type="text"
              value={nickname}
              maxLength={10}
              onChange={(event) => {
                setNickname(event.target.value);
                setProfileError('');
              }}
              placeholder="닉네임"
              className="h-12 w-full rounded-xl border border-border bg-surface px-4 outline-none focus:border-primary"
            />

            <div className="mt-2 flex items-center justify-between px-1 text-xs text-text-secondary">
              <p>
                닉네임은 최대 10자까지 입력할 수 있어요.
              </p>

              <p>{nickname.length}/10</p>
            </div>
          </div>
          <div className="mt-4">
            <AuthButton
                type="submit"
                disabled={
                isSubmitting ||
                !nickname.trim()
                }
            >
                수정하기
            </AuthButton>
          </div>
          
        </section>

        <div className="px-4">
          <div className="mb-2 flex h-4 items-center justify-center">
            {profileError && (
              <p
                className="text-xs text-error"
                role="alert"
              >
                {profileError}
              </p>
            )}
          </div>
        </div>
      </form>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleSelectedFile}
        className="hidden"
      />

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleSelectedFile}
        className="hidden"
      />

      <ProfilePhotoActionSheet
        isOpen={isPhotoSheetOpen}
        onClose={() =>
          setIsPhotoSheetOpen(false)
        }
        onSelectBestPick={
          handleSelectBestPick
        }
        onLoadImage={handleLoadImage}
      />
      {isBestPickSelectorOpen && (
        <BestPickProfileSelector
            onClose={() =>
            setIsBestPickSelectorOpen(false)
            }
            onSelect={handleBestPickSelected}
        />
      )}
    </main>
  );
};

export default ProfileEditPage;