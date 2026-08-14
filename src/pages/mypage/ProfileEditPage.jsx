import AuthButton from '../../components/auth/AuthButton';
import FilledCameraIcon from '../../components/FilledCameraIcon';
import BackHeader from '../../components/layout/BackHeader';
import BestPickProfileSelector from '../../components/profile/BestPickProfileSelector';
import ProfileAvatar from '../../components/profile/ProfileAvatar';
import ProfilePhotoActionSheet from '../../components/profile/ProfilePhotoActionSheet';
import { AUTH_FIELD_LIMITS } from '../../constants/auth';
import useProfileEdit from '../../hooks/profile/useProfileEdit';

const ProfileEditPage = () => {
  const {
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
  } = useProfileEdit();

  return (
    <main className="min-h-dvh px-4 pt-2 pb-4">
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
                onClick={openPhotoSheet}
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
              maxLength={AUTH_FIELD_LIMITS.nickname}
              onChange={handleNicknameChange}
              placeholder="닉네임"
              className="h-12 w-full rounded-xl border border-border bg-surface px-4 outline-none focus:border-primary"
            />

            <div className="mt-2 flex items-center justify-between px-1 text-xs text-text-secondary">
              <p>
                닉네임은 최대 10자까지 입력할 수 있어요.
              </p>

              <p>
                {nickname.length}/{AUTH_FIELD_LIMITS.nickname}
              </p>
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
        onClose={closePhotoSheet}
        onSelectBestPick={handleSelectBestPick}
        onLoadImage={handleLoadImage}
      />
      {isBestPickSelectorOpen && (
        <BestPickProfileSelector
          onClose={closeBestPickSelector}
          onSelect={handleBestPickSelected}
        />
      )}
    </main>
  );
};

export default ProfileEditPage;
