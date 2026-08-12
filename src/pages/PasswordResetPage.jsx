import { Link } from 'react-router';

import logoImage from '../assets/piccup-logo.png';
import AuthButton from '../components/auth/AuthButton';
import AuthTextField from '../components/auth/AuthTextField';
import { AUTH_FIELD_LIMITS } from '../constants/auth';
import usePasswordResetForm from '../hooks/auth/usePasswordResetForm';

const PasswordResetPage = () => {
  const {
    email,
    newPassword,
    passwordConfirm,
    resetError,
    isSubmitting,
    handleResetPassword,
    handleEmailChange,
    handleNewPasswordChange,
    handlePasswordConfirmChange,
  } = usePasswordResetForm();

  return (
    <main className="min-h-dvh px-6 py-8">
      <form
        className="flex min-h-[calc(100dvh-4rem)] flex-col"
        onSubmit={handleResetPassword}
      >
        <section className="flex flex-1 flex-col justify-center px-4">
          <div className="flex flex-col items-center">
            <img
              src={logoImage}
              alt="PicCup 로고"
              className="h-16 w-auto object-contain"
            />

            <h1 className="mt-2 font-logo text-3xl">
              PicCup
            </h1>

            <p className="mt-2 text-xl font-medium">
              비밀번호 재설정
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <AuthTextField
              label="가입할 때 사용한 이메일"
              name="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="이메일"
              autoComplete="email"
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

          <Link
            to="/login"
            className="mt-4 text-center text-sm text-text-secondary underline"
          >
            로그인으로 돌아가기
          </Link>
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

export default PasswordResetPage;
