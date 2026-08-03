import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { getMe, login as loginUser } from '../api/authApi';
import useAuthStore from '../store/useAuthStore';

import logoImage from '../assets/piccup-logo.png';
import AuthButton from '../components/auth/AuthButton';

const LoginPage = () => {
  const navigate = useNavigate();

  const setAuthenticatedUser = useAuthStore(
    (state) => state.setAuthenticatedUser,
  );

  const setUnauthenticated = useAuthStore(
    (state) => state.setUnauthenticated,
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (event) => { //입력값 검사, 로그인 API를 호출한 뒤 성공·실패 상태 처리
    event.preventDefault(); //브라우저 새로고침 막음

    if (!email.trim() || !password) {
      setLoginError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setLoginError('');

    try {
      await loginUser({
        email: email.trim(),
        password,
      });

      const user = await getMe();

      setAuthenticatedUser(user);
      navigate('/', { replace: true }); //로그인 페이지로 안돌아감
    } catch (error) {
      console.error('로그인 실패:', error);
      setUnauthenticated();

      if (error.response?.status === 401) {
        setLoginError('이메일 또는 비밀번호를 확인해주세요.');
      } else {
        setLoginError('로그인 중 오류가 발생했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <main className="flex min-h-dvh flex-col px-6 py-8">
      <section className="flex flex-1 flex-col justify-center">
        <div className="flex flex-col items-center">
          <div className="flex size-16 items-center justify-center rounded-2xl">
            <img
                src={logoImage}
                alt="PicCup 로고"
                className="h-16 w-auto object-contain"
            />
          </div>

          <h1 className="mt-2 font-logo text-3xl">PicCup</h1>
          <p className="mt-2 text-xl font-semibold">로그인</p>
        </div>

        <form
          className="mt-8 space-y-3 px-4"
          onSubmit={handleLogin}
        >
          <label className="block">
            <span className="sr-only">이메일</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="이메일"
              autoComplete="email"
              className="h-12 w-full rounded-xl border border-border bg-surface px-4 outline-none focus:border-primary"
            />
          </label>

          <label className="block">
            <span className="sr-only">비밀번호</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="비밀번호"
              autoComplete="current-password"
              className="h-12 w-full rounded-xl border border-border bg-surface px-4 outline-none focus:border-primary"
            />
            {loginError && (
              <p className="text-sm text-error" role="alert">
                {loginError}
              </p>
            )}
          </label>

          <AuthButton
            type="submit"
            disabled={isSubmitting}
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