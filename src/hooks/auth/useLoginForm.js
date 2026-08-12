import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { getMe, login as loginUser } from '../../api/authApi';
import useAuthStore from '../../store/useAuthStore';

const useLoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loginNotice, setLoginNotice] = useState(
    () => {
      if (location.state?.passwordResetSuccess) {
        return '비밀번호가 변경되었습니다.';
      }

      if (location.state?.signupSuccess) {
        return '회원가입이 완료되었습니다. 로그인해주세요.';
      }

      return '';
    },
  );

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
    setLoginNotice('');

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
      const redirectPath =
        typeof location.state?.from === 'string' //원래 가려던 페이지가 있으면
          ? location.state.from //그 페이지로
          : '/'; //없다면 홈으로

      navigate(redirectPath, {
        replace: true, //로그인 후 뒤로가기 눌러도 로그인으로 안감
      });
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

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setLoginError('');
    setLoginNotice('');
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setLoginError('');
    setLoginNotice('');
  };

  return {
    email,
    password,
    isSubmitting,
    loginError,
    loginNotice,
    handleLogin,
    handleEmailChange,
    handlePasswordChange,
  };
};

export default useLoginForm;
