import { useNavigate } from 'react-router';
import {
  ChevronRight,
  FileText,
  Images,
  KeyRound,
  LogOut,
  UserPen,
} from 'lucide-react';

import BottomNav from '../../components/layout/BottomNav';
import ProfileAvatar from '../../components/profile/ProfileAvatar';

import ConfirmModal from '../../components/layout/ConfirmModal';
import useMyPage from '../../hooks/profile/useMyPage';

const MyPage = () => {
  const navigate = useNavigate();

  const {
    user,
    isLogoutOpen,
    isLoggingOut,
    logoutError,
    openLogout,
    closeLogout,
    handleLogout,
  } = useMyPage();

  const menuItems = [
    {
      label: '내 정보 수정',
      icon: UserPen,
      path: '/mypage/edit',
    },
    {
      label: '이미지 불러오기',
      icon: Images,
      path: '/mypage/import',
    },
    {
      label: '비밀번호 재설정',
      icon: KeyRound,
      path: '/mypage/password-reset',
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
          <h1>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="font-logo text-3xl tracking-tight active:opacity-60"
              aria-label="홈으로 이동"
            >
              PicCup
            </button>
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
              onClick={openLogout}
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
        isConfirming={isLoggingOut}
        variant="primary"
        onClose={closeLogout}
        onConfirm={handleLogout}
      />
    </main>
  );
};

export default MyPage;
