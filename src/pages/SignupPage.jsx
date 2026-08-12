import { Link } from 'react-router';

import logoImage from '../assets/piccup-logo.png';
import AuthButton from '../components/auth/AuthButton';
import AuthTextField from '../components/auth/AuthTextField';
import { AUTH_FIELD_LIMITS } from '../constants/auth';

import useSignupForm from '../hooks/auth/useSignupForm';

const SignupPage = () => {
  const {
    nickname,
    email,
    password,
    passwordConfirm,
    signupError,
    isSubmitting,
    handleSignup,
    handleNicknameChange,
    handleEmailChange,
    handlePasswordChange,
    handlePasswordConfirmChange,
  } = useSignupForm();

  return (
    <main className="min-h-dvh px-6 py-8">
      <form
        className="flex min-h-[calc(100dvh-4rem)] flex-col"
        onSubmit={handleSignup}
      >
        <section className="flex flex-1 flex-col justify-center px-4">
          <div className="flex flex-col items-center">
            <img
              src={logoImage}
              alt="PicCup 로고"
              className="h-16 w-auto object-contain"
            />

            <h1 className="mt-2 font-logo text-3xl">PicCup</h1>
            <p className="mt-2 text-xl font-medium">회원가입</p>
          </div>

          <div className="mt-8 space-y-3">
            <AuthTextField
                label="닉네임"
                name="nickname"
                value={nickname}
                onChange={handleNicknameChange}
                placeholder="닉네임"
                maxLength={AUTH_FIELD_LIMITS.nickname}
                autoComplete="nickname"
            />

            <AuthTextField
                label="이메일"
                name="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="이메일"
                autoComplete="email"
            />

            <AuthTextField
                label="비밀번호"
                name="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="비밀번호"
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
                {signupError && (
                <p
                    className="text-xs text-error"
                    role="alert"
                >
                    {signupError}
                </p>
                )}
            </div>

            <AuthButton
                type="submit"
                disabled={isSubmitting}
            >
                가입하기
            </AuthButton>
        </div>
      </form>
    </main>
  );
};

export default SignupPage;
