import {
  AnimatePresence,
  motion,
} from 'motion/react';

const ProfilePhotoActionSheet = ({
  isOpen,
  onClose,
  onSelectBestPick,
  onLoadImage,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            type="button"
            onClick={onClose}
            className="absolute inset-0 bg-black/40"
            aria-label="프로필 사진 설정 닫기"
          />

          <motion.section
            role="dialog"
            aria-modal="true"
            aria-label="프로필 사진 설정"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              stiffness: 350,
              damping: 35,
            }}
            className="relative mx-auto w-full max-w-md rounded-t-3xl bg-background p-3 pb-4"
          >
            <h2 className="mb-2 text-center text-lg font-semibold">
              프로필 사진 설정
            </h2>

            <div className="space-y-3">
              <button
                type="button"
                onClick={onSelectBestPick}
                className="h-13 w-full rounded-xl bg-gray-100 text-base active:bg-gray-200"
              >
                Best Pick에서 선택
              </button>

              <button
                type="button"
                onClick={onLoadImage}
                className="h-13 w-full rounded-xl bg-gray-100 text-base active:bg-gray-200"
              >
                이미지 불러오기
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="mt-4 h-13 w-full rounded-xl bg-primary text-base font-semibold text-white active:bg-primary-pressed"
            >
              돌아가기
            </button>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfilePhotoActionSheet;