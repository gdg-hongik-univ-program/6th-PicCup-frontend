import { useState } from 'react';
import { useNavigate } from 'react-router';

import { resetPassword } from '../../api/authApi';
import { validatePasswordResetForm } from '../../utils/authValidation';

const usePasswordResetForm = () => {
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

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    clearError();
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
    clearError();
  };

  const handlePasswordConfirmChange = (event) => {
    setPasswordConfirm(
      event.target.value,
    );
    clearError();
  };

  return {
    email,
    newPassword,
    passwordConfirm,
    resetError,
    isSubmitting,
    handleResetPassword,
    handleEmailChange,
    handleNewPasswordChange,
    handlePasswordConfirmChange,
  };
};

export default usePasswordResetForm;
