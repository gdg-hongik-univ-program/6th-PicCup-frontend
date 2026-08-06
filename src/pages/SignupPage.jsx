import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

import logoImage from '../assets/piccup-logo.png';
import AuthButton from '../components/auth/AuthButton';
import AuthTextField from '../components/auth/AuthTextField';

import { validateSignupForm } from '../libs/authValidation';
import { signup as signupUser } from '../api/authApi';

const SignupPage = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [signupError, setSignupError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async (event) => {
    event.preventDefault();

    const validationError = validateSignupForm({
        nickname,
        email,
        password,
        passwordConfirm,
    });

    setSignupError(validationError);

    if (validationError) {
        return;
    }

    setIsSubmitting(true);
    setSignupError('');

    try {
        await signupUser({
        nickname: nickname.trim(),
        email: email.trim(),
        password,
        });

        navigate('/login', {
        replace: true,
        state: {
            signupSuccess: true,
        },
        });
    } catch (error) {
        console.error('회원가입 실패:', error);

        if (error.response?.status === 409) {
        setSignupError('이미 사용 중인 이메일입니다.');
        } else if (error.response?.status === 400) {
        setSignupError('입력한 회원정보를 확인해주세요.');
        } else {
        setSignupError('회원가입 중 오류가 발생했습니다.');
        }
    } finally {
        setIsSubmitting(false);
    }
    };

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
            <p className="mt-2 text-xl font-semibold">회원가입</p>
          </div>

          <div className="mt-8 space-y-3">
            <AuthTextField
                label="닉네임"
                name="nickname"
                value={nickname}
                onChange={(event) => {
                setNickname(event.target.value);
                setSignupError('');
                }}
                placeholder="닉네임"
                maxLength={10}
                autoComplete="nickname"
            />

            <AuthTextField
                label="이메일"
                name="email"
                type="email"
                value={email}
                onChange={(event) => {
                setEmail(event.target.value);
                setSignupError('');
                }}
                placeholder="이메일"
                autoComplete="email"
            />

            <AuthTextField
                label="비밀번호"
                name="password"
                type="password"
                value={password}
                onChange={(event) => {
                setPassword(event.target.value);
                setSignupError('');
                }}
                placeholder="비밀번호"
                maxLength={16}
                autoComplete="new-password"
                helperText="10~16자 영문과 숫자를 포함해주세요."
            />

            <AuthTextField
                label="비밀번호 확인"
                name="passwordConfirm"
                type="password"
                value={passwordConfirm}
                onChange={(event) => {
                setPasswordConfirm(event.target.value);
                setSignupError('');
                }}
                placeholder="비밀번호 확인"
                maxLength={16}
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