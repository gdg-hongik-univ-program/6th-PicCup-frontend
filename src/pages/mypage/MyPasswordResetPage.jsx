import { useState } from 'react';
import { useNavigate } from 'react-router';

import { resetPassword } from '../../api/authApi';
import { validatePasswordResetForm } from '../../libs/authValidation';
import useAuthStore from '../../store/useAuthStore';

import AuthButton from '../../components/auth/AuthButton';
import AuthTextField from '../../components/auth/AuthTextField';
import BackHeader from '../../components/layout/BackHeader';

const MyPasswordResetPage = () => {
  const navigate = useNavigate();

  const user = useAuthStore(
    (state) => state.user,
  );

  const [newPassword, setNewPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [resetError, setResetError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResetPassword = async (event) => {
    event.preventDefault();

    const validationError =
      validatePasswordResetForm({
        email: user?.email ?? '',
        newPassword,
        passwordConfirm,
      });

    setResetError(validationError);

    if (validationError) return;

    const isPreviewMode =
      import.meta.env.DEV &&
      import.meta.env.VITE_AUTH_PREVIEW ===
        'true';

    if (isPreviewMode) {
      navigate('/mypage', {
        replace: true,
        state: {
          passwordResetSuccess: true,
        },
      });

      return;
    }

    try {
      setIsSubmitting(true);
      setResetError('');

      await resetPassword({
        email: user.email,
        newPassword,
      });

      navigate('/mypage', {
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
          '새 비밀번호를 확인해주세요.',
        );
      } else {
        setResetError(
          error.response?.data?.message ??
            '비밀번호를 재설정하지 못했습니다.',
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
    <main className="min-h-dvh px-4 py-4">
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
              onChange={(event) => {
                setNewPassword(
                  event.target.value,
                );
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