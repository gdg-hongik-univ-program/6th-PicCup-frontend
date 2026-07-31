import { Trash2 } from 'lucide-react';

import { useEffect } from 'react';

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
  useEffect(() => {
    if (!isOpen) return;

    const body = document.body;
    const savedScrollY = window.scrollY; //페이지가 세로로 얼마나 내려가 있는지 저장

    const previousStyles = { //원래 적용돼있던 body 스타일 (원상복구)
        position: body.style.position, 
        top: body.style.top, 
        left: body.style.left, 
        right: body.style.right, 
        width: body.style.width, 
        overflow: body.style.overflow,
    };

    body.style.position = 'fixed';
    body.style.top = `-${savedScrollY}px`; //현재 스크롤한 만큼
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden'; //화면 너비나 위치가 틀어지지 않도록 고정

    return () => {
        if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur(); //포커스 해제
        }

        Object.assign(body.style, previousStyles); //원래 body스타일로 원상복구

        const restoreScroll = () => {
        window.scrollTo(0, savedScrollY);
        }; //처음 저장해둔 위치로 다시 스크롤

        requestAnimationFrame(restoreScroll); //다음 화면을 다시 그리는 시점에
        setTimeout(restoreScroll, 350); //안전장치
    };
    }, [isOpen]); //isOpen이 true->false일때, 바텀시트 화면에서 사라질 때
  return (
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
  );
};

export default BottomSheet;