import AuthButton from '../../components/auth/AuthButton';
import AuthTextField from '../../components/auth/AuthTextField';
import BackHeader from '../../components/layout/BackHeader';
import { AUTH_FIELD_LIMITS } from '../../constants/auth';
import useMyPasswordResetForm from '../../hooks/profile/useMyPasswordResetForm';

const MyPasswordResetPage = () => {
  const {
    user,
    newPassword,
    passwordConfirm,
    resetError,
    isSubmitting,
    handleResetPassword,
    handleNewPasswordChange,
    handlePasswordConfirmChange,
  } = useMyPasswordResetForm();

  return (
    <main className="min-h-dvh px-4 pt-2 pb-4">
      <form
        className="flex min-h-[calc(100dvh-2rem)] flex-col"
        onSubmit={handleResetPassword}
      >
        <BackHeader title="비밀번호 재설정" />

        <section className="flex flex-1 flex-col px-4 pt-10">
          <div className="space-y-3">
            <AuthTextField
              label="가입한 이메일"
              name="email"
              type="email"
              value={user?.email ?? ''}
              readOnly
              aria-readonly="true"
            />

            <AuthTextField
              label="새 비밀번호"
              name="newPassword"
              type="password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              placeholder="새 비밀번호"
              maxLength={AUTH_FIELD_LIMITS.passwordMax}
              autoComplete="new-password"
              helperText="10~16자 영문과 숫자를 포함해주세요."
            />

            <AuthTextField
              label="비밀번호 확인"
              name="passwordConfirm"
              type="password"
              value={passwordConfirm}
              onChange={handlePasswordConfirmChange}
              placeholder="비밀번호 확인"
              maxLength={AUTH_FIELD_LIMITS.passwordMax}
              autoComplete="new-password"
            />
          </div>
        </section>

        <div className="px-4">
          <div className="mb-2 flex h-4 items-center justify-center">
            {resetError && (
              <p
                className="text-xs text-error"
                role="alert"
              >
                {resetError}
              </p>
            )}
          </div>

          <AuthButton
            type="submit"
            disabled={isSubmitting}
          >
            재설정
          </AuthButton>
        </div>
      </form>
    </main>
  );
};

export default MyPasswordResetPage;
