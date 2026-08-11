import {
  Navigate,
  Outlet,
  useLocation,
} from 'react-router';

import useAuthStore from '../../store/useAuthStore';

const ProtectedRoute = () => {
  const location = useLocation();
  //현재 사용자가 어디에 있는지 알기 위해 사용

  const authStatus = useAuthStore(
    (state) => state.authStatus,
  );

  if (authStatus === 'checking') {
    return null; //스플래시 보여주고 있음
  }

  if (authStatus !== 'authenticated') {
    const currentPath =
      location.pathname + location.search;

    return (
      <Navigate //사용자를 /login으로 이동시키는 React Router 컴포넌트
        to="/login"
        replace
        state={{
          from: currentPath, //직전 사용하던 페이지 복귀
        }}
      />
    );
  }

  return <Outlet />;
  //ProtectedRoute 안에 묶인 자식 Route를 실제로 렌더링
};

export default ProtectedRoute;