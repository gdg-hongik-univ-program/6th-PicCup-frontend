import { useState } from 'react';
import { useNavigate } from 'react-router';

import { logout as logoutUser } from '../../api/authApi';
import useAuthStore from '../../store/useAuthStore';

const useMyPage = () => {
  const navigate = useNavigate();

  const user = useAuthStore(
    (state) => state.user,
  );

  const setUnauthenticated = useAuthStore(
    (state) => state.setUnauthenticated,
  );

  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState('');

  const finishLogout = () => { //로그아웃 후처리
    setUnauthenticated();
    setIsLogoutOpen(false);

    navigate('/login', {
      replace: true,//로그아웃 후 마이페이지로 돌아가지 못하게
    });
  };

  const handleLogout = async () => { //로그아웃 처리
    const isPreviewMode = //개발미리보기인가
      import.meta.env.DEV &&
      import.meta.env.VITE_AUTH_PREVIEW ===
      'true';

    if (isPreviewMode) {
      finishLogout();
      return; //서버요청 안보냄
    }

    try { //실제환경이면
      setIsLoggingOut(true);
      setLogoutError('');

      await logoutUser();

      finishLogout();
    } catch (error) {
      console.error('로그아웃 실패:', error);

      if (error.response?.status === 401) { //시간지나 만료된경우
        finishLogout();
        return;
      }

      setLogoutError(
        error.response?.data?.message ??
          '로그아웃하지 못했습니다.',
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  const openLogout = () => {
    setLogoutError('');
    setIsLogoutOpen(true);
  };

  const closeLogout = () => {
    setLogoutError('');
    setIsLogoutOpen(false);
  };

  return {
    user,
    isLogoutOpen,
    isLoggingOut,
    logoutError,
    openLogout,
    closeLogout,
    handleLogout,
  };
};

export default useMyPage;
