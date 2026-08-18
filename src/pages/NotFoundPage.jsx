import { Link } from 'react-router';
import { CircleAlert } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      {/* 오류 아이콘 */}
      <div className="flex size-20 items-center justify-center rounded-full bg-primary-soft text-primary">
        <CircleAlert
          size={60}
          strokeWidth={2.0}
          aria-hidden="true"
        />
      </div>

      <p className="mt-2 font-logo text-7xl text-primary">
        404
      </p>

      <h1 className="mt-4 text-2xl font-semibold">
        Page Not Found
      </h1>

      <p className="mt-2 text-sm text-text-secondary">
        주소가 잘못되었거나 삭제된 페이지예요.
      </p>

      {/* 홈으로 이동 */}
      <Link
        to="/"
        replace
        className="mt-8 flex h-12 w-full max-w-64 items-center justify-center rounded-xl bg-primary font-semibold text-white active:bg-primary-pressed"
      >
        홈으로 돌아가기
      </Link>
    </main>
  );
};

export default NotFoundPage;