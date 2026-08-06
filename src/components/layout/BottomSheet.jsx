import { useEffect, useRef } from 'react';

import { Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const BottomSheet = ({
  isOpen,
  title,
  name,
  onNameChange,
  onClose,
  onSubmit,
  submitLabel,
  isSubmitting = false,
  error = '',
  showDelete = false,
  onDelete,
  isSubmitDisabled = false,
}) => {
    const layerRef = useRef(null);
    useEffect(() => {
    if (!isOpen) return undefined;

    const html = document.documentElement;
    const body = document.body;
    const viewport = window.visualViewport;
    const savedScrollY = window.scrollY;

    const previousHtmlOverflow = html.style.overflow;
    const previousHtmlOverscroll =
        html.style.overscrollBehavior;

    const previousBodyStyles = {
        position: body.style.position,
        top: body.style.top,
        left: body.style.left,
        right: body.style.right,
        width: body.style.width,
        overflow: body.style.overflow,
    };

    html.style.overflow = 'hidden';
    html.style.overscrollBehavior = 'none';

    body.style.position = 'fixed';
    body.style.top = `-${savedScrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';

    const syncVisualViewport = () => {
        const offsetTop = viewport?.offsetTop ?? 0;

        // 키보드가 화면을 위로 민 만큼 배경을 반대로 보정
        body.style.top = `${offsetTop - savedScrollY}px`;

        if (!viewport || !layerRef.current) return;

        // 바텀시트는 실제로 보이는 키보드 위 영역에 맞춤
        layerRef.current.style.top =
        `${viewport.offsetTop}px`;
        layerRef.current.style.left =
        `${viewport.offsetLeft}px`;
        layerRef.current.style.width =
        `${viewport.width}px`;
        layerRef.current.style.height =
        `${viewport.height}px`;
    };

    syncVisualViewport();

    viewport?.addEventListener(
        'resize',
        syncVisualViewport,
    );
    viewport?.addEventListener(
        'scroll',
        syncVisualViewport,
    );

    return () => {
        viewport?.removeEventListener(
        'resize',
        syncVisualViewport,
        );
        viewport?.removeEventListener(
        'scroll',
        syncVisualViewport,
        );

        html.style.overflow = previousHtmlOverflow;
        html.style.overscrollBehavior =
        previousHtmlOverscroll;

        Object.assign(body.style, previousBodyStyles);

        requestAnimationFrame(() => {
        window.scrollTo(0, savedScrollY);
        });
    };
    }, [isOpen]);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div //애니메이션
            ref={layerRef}
            key="bottom-sheet"
            className="fixed left-0 top-0 z-[60] flex h-dvh w-full items-end overscroll-none"
        >
          <motion.button //검정 배경
            type="button"
            aria-label={`${title} 닫기`}
            onClick={onClose}
            className="absolute inset-0 touch-none bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          <motion.section //실제 바텀시트
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: '100%' }} // 초기 위치: 화면 아래
            animate={{ y: 0 }} // 애니메이션 위치: 화면 중앙
            exit={{ y: '100%' }}
            transition={{ //애니메이션 타입
              type: 'spring',
              stiffness: 350,
              damping: 35,
            }}
            className="relative mx-auto w-full max-w-md rounded-t-3xl bg-background p-5"
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
                disabled={
                  isSubmitting ||
                  isSubmitDisabled ||
                  !name.trim()
                }
                className="rounded-xl bg-primary py-3 text-background disabled:opacity-70"
              >
                {submitLabel}
              </button>
            </div>

            {showDelete && (
              <div className="mt-4 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={onDelete}
                  className="flex w-full items-center justify-center gap-1 rounded-2xl bg-gray-100 py-3 text-error"
                >
                  <Trash2 size={16} />
                  삭제하기
                </button>
              </div>
            )}
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;