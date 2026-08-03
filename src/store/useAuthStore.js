import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  authStatus: 'checking', //서버에 로그인 세션이 남아 있는지 확인 중
  // 새로고침했을때 쿠키가 남아있어 화면이 튀는것을 막음

  setAuthChecking: () => {
    set({ authStatus: 'checking' });
  },

  setAuthenticatedUser: (user) => {
    set({
      user,
      authStatus: 'authenticated',//로그인된 상태
    });
  },

  setUnauthenticated: () => {
    set({
      user: null,
      authStatus: 'unauthenticated',//로그인되지 않은 상태
    }); //401반환, 로그아웃 성공, 세션 만료 시 
  },
}));

export default useAuthStore;

/*로그인한 사용자 정보를 전역에서 관리할 인증 store
새로고침 시에는 이후 /users/me로 다시 채우게 됨*/
