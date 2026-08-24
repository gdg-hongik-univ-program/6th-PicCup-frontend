import { useState } from 'react';
import { useNavigate } from 'react-router';

import { signup as signupUser } from '../../api/authApi';
import { validateSignupForm } from '../../utils/authValidation';

const useSignupForm = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async (event) => {
    event.preventDefault();

    const fieldValidationError = validateSignupForm({
      nickname,
      email,
      password,
      passwordConfirm,
    });
    const validationError = fieldValidationError
      || (!isTermsAgreed ? '서비스 이용약관에 동의해주세요.' : '');

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

  const handleNicknameChange = (event) => {
    setNickname(event.target.value);
    setSignupError('');
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setSignupError('');
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setSignupError('');
  };

  const handlePasswordConfirmChange = (event) => {
    setPasswordConfirm(event.target.value);
    setSignupError('');
  };

  const handleTermsAgreementChange = (event) => {
    setIsTermsAgreed(event.target.checked);
    setSignupError('');
  };

  return {
    nickname,
    email,
    password,
    passwordConfirm,
    isTermsAgreed,
    signupError,
    isSubmitting,
    handleSignup,
    handleNicknameChange,
    handleEmailChange,
    handlePasswordChange,
    handlePasswordConfirmChange,
    handleTermsAgreementChange,
  };
};

export default useSignupForm;
