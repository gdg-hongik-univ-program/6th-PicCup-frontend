import { useEffect } from 'react';

import { getMe } from '../../api/authApi';
import useAuthStore from '../../store/useAuthStore';

const useAuthBootstrap = () => {
  const setAuthenticatedUser = useAuthStore(
    (state) => state.setAuthenticatedUser,
  );

  const setUnauthenticated = useAuthStore(
    (state) => state.setUnauthenticated,
  );

  useEffect(() => {
    let isActive = true;
    //늦게 서버 응답이 도착해서 Zustand 상태를 변경하는 것을 방지

    const checkSession = async () => { //로그인 상태 확인을 위해
      try {
        const user = await getMe();

        if (!isActive) return;

        setAuthenticatedUser(user); //zustand에 정보 저장
      } catch (error) {
        if (!isActive) return;

        if (error.response?.status !== 401) {
          console.error(
            '로그인 세션 확인 실패:',
            error,
          );
        }

        setUnauthenticated(); //로그인 안 된 사용자
      }
    };

    checkSession(); //실제 /users/me 요청이 시작

    return () => {
      isActive = false;
    };
  }, [
    setAuthenticatedUser,
    setUnauthenticated,
  ]);
};

export default useAuthBootstrap;
