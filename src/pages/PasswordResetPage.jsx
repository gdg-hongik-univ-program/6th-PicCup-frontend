import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { resetPassword } from '../api/authApi';
import { validatePasswordResetForm } from '../libs/authValidation';

import logoImage from '../assets/piccup-logo.png';
import AuthButton from '../components/auth/AuthButton';
import AuthTextField from '../components/auth/AuthTextField';

const PasswordResetPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] =
    useState('');
  const [passwordConfirm, setPasswordConfirm] =
    useState('');

  const [resetError, setResetError] = useState('');
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleResetPassword = async (event) => {
    event.preventDefault();

    const validationError =
      validatePasswordResetForm({
        email,
        newPassword,
        passwordConfirm,
      });

    setResetError(validationError);

    if (validationError) return;

    try {
      setIsSubmitting(true);
      setResetError('');

      await resetPassword({
        email: email.trim(),
        newPassword,
      });

      navigate('/login', {
        replace: true,
        state: {
          passwordResetSuccess: true,
        },
      });
    } catch (error) {
      console.error(
        '비밀번호 재설정 실패:',
        error,
      );

      if (error.response?.status === 400) {
        setResetError(
          '입력한 이메일과 비밀번호를 확인해주세요.',
        );
      } else {
        setResetError(
          error.response?.data?.message ??
            '비밀번호 재설정 중 오류가 발생했습니다.',
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearError = () => {
    setResetError('');
  };

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
              onChange={(event) => {
                setEmail(event.target.value);
                clearError();
              }}
              placeholder="이메일"
              autoComplete="email"
            />

            <AuthTextField
              label="새 비밀번호"
              name="newPassword"
              type="password"
              value={newPassword}
              onChange={(event) => {
                setNewPassword(event.target.value);
                clearError();
              }}
              placeholder="새 비밀번호"
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
                setPasswordConfirm(
                  event.target.value,
                );
                clearError();
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