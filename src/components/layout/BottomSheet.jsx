import { Trash2 } from 'lucide-react';

import { useEffect, useState } from 'react';

const useVisualViewportHeight = (isOpen) => {
  const [height, setHeight] = useState(null); // null이면 기본 100% 높이 사용

  useEffect(() => {
    const vv = window.visualViewport;
    if (!isOpen || !vv) return;

    const update = () => setHeight(vv.height);
    update();

    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);

    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
      setHeight(null);
    };
  }, [isOpen]);

  return height;
};

const BottomSheet = ({
  isOpen, 
  title,
  name,
  onNameChange,
  onClose,
  onSubmit,
  submitLabel,
  submittingLabel = '처리 중...',
  isSubmitting = false,
  error = '',
  showDelete = false,
  onDelete,
  isSubmitDisabled = false,
}) => {
  const viewportHeight = useVisualViewportHeight(isOpen);

  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    const { body, documentElement: html } = document;

    const lockScroll = () => window.scrollTo(0, 0);

    html.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';

    window.addEventListener('scroll', lockScroll);

    return () => {
      window.removeEventListener('scroll', lockScroll);
      html.style.overflow = '';
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);
  return (
    <div
      style={viewportHeight ? { height: `${viewportHeight}px` } : undefined}
      className={`fixed inset-0 z-[60] flex items-end overscroll-none ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
        <div
        className={`fixed inset-0 z-[60] flex items-end overscroll-none ${
            isOpen
            ? 'pointer-events-auto'
            : 'pointer-events-none'
        }`}
        >
        <button
            type="button"
            aria-label={`${title} 닫기`} //배경 눌러서 닫기
            onClick={onClose}
            className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
            }`}
        />

        <section
            className={`relative w-full rounded-t-3xl bg-background p-5 transition-transform duration-300 ${
            isOpen
                ? 'translate-y-0 ease-out' //부모 items-end 때문에 화면 아래쪽에 붙어있음
                : 'translate-y-full ease-in' //자신의 높이만큼 아래로 이동
            }`}
        >
            <h3 className="mb-4 px-2 text-lg font-semibold">
            {title}
            </h3>

            <div className="rounded-xl border border-border p-3 focus-within:border-primary">
            <input
                type="text"
                value={name}
                maxLength={50}
                placeholder="카테고리 이름"
                onChange={(event) =>
                onNameChange(event.target.value)
                }
                className="w-full outline-none"
            />
            </div>

            <p className="mt-2 px-1 text-right text-xs text-text-secondary">
            {name.length}/50
            </p>

            {error && (
            <p className="px-2 text-sm text-error">
                {error}
            </p>
            )}

            <div className="mt-2 grid grid-cols-2 gap-2">
            <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-border py-3"
            >
                취소
            </button>

            <button
                type="button"
                onClick={onSubmit}
                disabled={isSubmitting || isSubmitDisabled || !name.trim()}
                className="rounded-xl bg-primary py-3 text-background disabled:opacity-70"
            >
                {isSubmitting
                ? submittingLabel
                : submitLabel}
            </button>
            </div>

            {showDelete && (
            <div className="mt-4 border-t border-border pt-4">
            <button
                type="button"
                onClick={onDelete}
                className="flex w-full items-center justify-center rounded-2xl bg-gray-100 gap-1 py-3 text-error"
            >
                <Trash2 size={16} />
                삭제하기
            </button>
            </div>
            )}
        </section>
        </div>
    </div>
  );
};

export default BottomSheet;