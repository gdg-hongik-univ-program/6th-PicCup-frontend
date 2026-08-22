import { CameraOff } from 'lucide-react';

const CameraPermissionNotice = ({
  errorType,
  message,
  isRequesting,
  onRetry,
  onBack,
}) => {
  const isPermissionDenied =
    errorType === 'permission-denied';
  const canRetry =
    errorType !== 'unsupported' &&
    errorType !== 'not-found' &&
    errorType !== 'security';
  const title = isPermissionDenied
    ? '카메라 권한이 필요해요'
    : errorType === 'not-found'
      ? '카메라를 찾을 수 없어요'
      : '카메라를 사용할 수 없어요';

  return (
    <section className="absolute inset-0 z-30 flex items-center justify-center bg-text-primary/75 px-6">
      <div className="w-full max-w-xs rounded-3xl bg-background px-6 py-7 text-center shadow-xl">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-gray-100">
          <CameraOff
            size={28}
            aria-hidden="true"
          />
        </div>

        <h2 className="mt-4 text-xl font-semibold">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-text-secondary">
          {message}
        </p>

        {isPermissionDenied && (
          <p className="mt-3 rounded-xl bg-gray-100 px-3 py-3 text-xs leading-5 text-text-secondary">
            팝업이 다시 나타나지 않으면 브라우저 또는 기기
            설정에서 PicCup의 카메라 권한을 허용한 뒤 다시
            시도해주세요.
          </p>
        )}

        {canRetry && (
          <button
            type="button"
            onClick={onRetry}
            disabled={isRequesting}
            aria-busy={isRequesting}
            className="mt-5 h-12 w-full rounded-xl bg-primary font-semibold text-background"
          >
            카메라 권한 다시 확인
          </button>
        )}

        <button
          type="button"
          onClick={onBack}
          className="mt-2 h-12 w-full rounded-xl border border-border bg-background font-medium"
        >
          카테고리 선택으로 돌아가기
        </button>
      </div>
    </section>
  );
};

export default CameraPermissionNotice;
