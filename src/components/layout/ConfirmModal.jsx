const ConfirmModal = ({
  isOpen,
  title,
  description,
  error = '',
  confirmLabel = '확인',
  confirmingLabel = '처리 중...',
  cancelLabel = '취소',
  isConfirming = false,
  variant = 'danger',
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const confirmColor =
    variant === 'danger'
      ? 'bg-error text-white'
      : 'bg-primary text-white';

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-6">
      <button
        type="button"
        onClick={onClose}
        disabled={isConfirming}
        className="absolute inset-0 bg-black/40"
        aria-label="확인창 닫기"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-sm rounded-2xl bg-background p-5 text-center"
      >
        <h2 className="font-semibold">
          {title}
        </h2>

        {description && (
          <p className="mt-3 text-sm text-text-secondary">
            {description}
          </p>
        )}

        <p
          role="alert"
          className="mt-2 h-5 text-xs text-error"
        >
          {error}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isConfirming}
            className="rounded-xl border border-border py-3 disabled:opacity-50"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className={`rounded-xl py-3 disabled:opacity-50 ${confirmColor}`}
          >
            {isConfirming
              ? confirmingLabel
              : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
};

export default ConfirmModal;