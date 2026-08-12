import { useState } from 'react';
import { useNavigate } from 'react-router';

import { resetPassword } from '../../api/authApi';
import useAuthStore from '../../store/useAuthStore';
import { validatePasswordResetForm } from '../../utils/authValidation';

const useMyPasswordResetForm = () => {
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

  const handleNewPasswordChange = (event) => {
    setNewPassword(
      event.target.value,
    );
    clearError();
  };

  const handlePasswordConfirmChange = (event) => {
    setPasswordConfirm(
      event.target.value,
    );
    clearError();
  };

  return {
    user,
    newPassword,
    passwordConfirm,
    resetError,
    isSubmitting,
    handleResetPassword,
    handleNewPasswordChange,
    handlePasswordConfirmChange,
  };
};

export default useMyPasswordResetForm;
