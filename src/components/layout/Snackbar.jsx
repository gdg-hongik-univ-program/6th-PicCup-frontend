import {
  useEffect,
  useRef,
} from 'react';

const Snackbar = ({
  message,
  duration = 2500,
  positionClassName = 'bottom-6',
  actionLabel = '',
  isActionDisabled = false,
  onAction,
  onClose,
}) => {
  const onCloseRef = useRef(onClose);

  // 최신 종료 함수 저장
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // 일정 시간 후 자동으로 닫기
  useEffect(() => {
    if (!message) return undefined;

    const timeoutId = window.setTimeout(() => {
      onCloseRef.current?.();
    }, duration);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    duration,
    message,
  ]);

  if (!message) return null;

  return (
    <div
      className={`fixed inset-x-0 z-[60] mx-auto w-full max-w-md px-4 ${positionClassName}`}
    >
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="flex items-center justify-between gap-3 rounded-full bg-gray-100 px-6 py-3 shadow-lg"
      >
        <p className="min-w-0 truncate text-sm">
          {message}
        </p>

        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            disabled={isActionDisabled}
            aria-busy={isActionDisabled}
            className="shrink-0 rounded-lg bg-primary px-2 py-2 text-sm text-background"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default Snackbar;
