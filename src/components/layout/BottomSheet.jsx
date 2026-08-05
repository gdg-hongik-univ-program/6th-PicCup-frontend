import { Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const BottomSheet = ({
  isOpen,
  title,
  name,
  onNameChange,
  onClose,
  onSubmit,
  isSubmitting = false,
  error = '',
  showDelete = false,
  onDelete,
  isSubmitDisabled = false,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div //Motion에서 애니메이션을 줄 수 있는 요소
          key="bottom-sheet"
          className="fixed inset-0 z-[60] flex items-end"
        >
          <motion.button //검정 배경
            type="button"
            aria-label={`${title} 닫기`}
            onClick={onClose}ㅐ
            className="absolute inset-0 bg-black/40"
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
                submitLabel
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