import { useNavigate } from 'react-router';
import { useState } from 'react';
import {
  ChevronRight,
  FileText,
  KeyRound,
  LogOut,
  UserPen,
} from 'lucide-react';

import useAuthStore from '../../store/useAuthStore';
import BottomNav from '../../components/layout/BottomNav';
import ProfileAvatar from '../../components/profile/ProfileAvatar';

import { logout as logoutUser } from '../../api/authApi';
import ConfirmModal from '../../components/layout/ConfirmModal';

const MyPage = () => {
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

  const menuItems = [
    {
      label: '내 정보 수정',
      icon: UserPen,
      path: '/mypage/edit',
    },
    {
      label: '비밀번호 재설정',
      icon: KeyRound,
      path: '/password-reset',
    },
    {
      label: '서비스 약관',
      icon: FileText,
      path: '/terms',
    },
  ];

  return (
    <main className="flex min-h-dvh flex-col pb-28">
      <div className="flex-1 px-4 pt-5">
        <header className="px-2">
          <h1 className="font-logo text-3xl tracking-tight">
            PicCup
          </h1>
        </header>

        <section className="mt-6">
          <h2 className="px-2 text-2xl font-semibold">
            마이페이지
          </h2>

          <div className="mt-5 flex items-center gap-4 rounded-2xl bg-primary-soft p-5">
            <ProfileAvatar
                src={user?.profileImageUrl}
                alt={`${user?.nickname ?? '사용자'} 프로필`}
                className="size-14"
            />

            <p className="text-xl font-semibold">
              {user?.nickname ?? '사용자'}
            </p>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl bg-gray-50">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() =>
                    navigate(item.path)
                  }
                  className="flex w-full items-center gap-3 px-4 py-6 text-left active:bg-gray-100"
                >
                  <Icon
                    size={18}
                    className="text-text-primary"
                  />

                  <span className="flex-1 text-sm font-medium">
                    {item.label}
                  </span>

                  <ChevronRight
                    size={17}
                    className="text-text-primary"
                  />
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => {
                setLogoutError('');
                setIsLogoutOpen(true);
              }}
              className="flex w-full items-center gap-3 border-border px-4 py-6 text-left active:bg-gray-100"
            >
              <LogOut
                size={18}
                className="text-text-primary"
              />

              <span className="flex-1 text-sm font-medium">
                로그아웃
              </span>

              <ChevronRight
                size={17}
                className="text-text-primary"
              />
            </button>
          </div>
        </section>
      </div>

      <BottomNav />

      <ConfirmModal
        isOpen={isLogoutOpen}
        title="로그아웃 할까요?"
        description="로그아웃하면 로그인 화면으로 이동합니다."
        error={logoutError}
        confirmLabel="로그아웃"
        confirmingLabel="로그아웃 중..."
        isConfirming={isLoggingOut}
        variant="primary"
        onClose={() => {
            setLogoutError('');
            setIsLogoutOpen(false);
        }}
        onConfirm={handleLogout}
      />
    </main>
  );
};

export default MyPage;