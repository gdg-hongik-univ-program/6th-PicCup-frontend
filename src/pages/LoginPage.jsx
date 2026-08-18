import { Link } from 'react-router';

import logoImage from '../assets/piccup-logo.png';
import AuthButton from '../components/auth/AuthButton';
import AuthTextField from '../components/auth/AuthTextField';
import useLoginForm from '../hooks/auth/useLoginForm';

const LoginPage = () => {
  const {
    email,
    password,
    isSubmitting,
    loginError,
    loginNotice,
    handleLogin,
    handleEmailChange,
    handlePasswordChange,
  } = useLoginForm();

  return (
    <main className="flex min-h-dvh flex-col px-6 py-8">
      <section className="relative flex flex-1 flex-col justify-center">
        <div className="flex flex-col items-center">
          <div className="flex size-16 items-center justify-center rounded-2xl">
            <img
                src={logoImage}
                alt="PicCup 로고"
                className="h-16 w-auto object-contain"
            />
          </div>

          <h1 className="mt-2 font-logo text-3xl">PicCup</h1>
          <p className="mt-2 text-xl font-medium">로그인</p>
        </div>

        <form
          className="mt-8 space-y-3 px-4"
          onSubmit={handleLogin}
        >
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
            autoComplete="current-password"
          />

            <AuthButton
              type="submit"
              isProcessing={isSubmitting}
            >
              로그인
            </AuthButton>
        </form>

        <Link
          to="/password-reset"
          className="mt-3 text-center text-sm text-text-secondary underline"
        >
          비밀번호를 잊으셨나요?
        </Link>
        <div className="absolute inset-x-0 bottom-4 flex h-4 items-center justify-center px-4">
          {loginError ? (
            <p
              className="text-xs text-error"
              role="alert"
            >
              {loginError}
            </p>
          ) : loginNotice ? (
            <p
              className="text-xs text-primary"
              role="status"
            >
              {loginNotice}
            </p>
          ) : null}
        </div>
      </section>

      <section className="border-t border-border pt-5 px-4">
        <p className="mb-3 text-center text-sm text-text-secondary">
          아직 회원이 아니신가요?
        </p>

        <Link
          to="/signup"
          className="flex h-12 items-center justify-center rounded-xl border border-primary font-semibold text-primary active:bg-primary-soft"
        >
          회원가입
        </Link>
      </section>
    </main>
  );
};

export default LoginPage;
