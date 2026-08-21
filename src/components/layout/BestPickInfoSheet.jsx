import {
  useEffect,
  useState,
} from 'react';

import {
  AnimatePresence,
  motion,
} from 'motion/react';

import { formatCapturedDate } from '../../utils/date';

const formatFileSize = (size) => {
  if (!Number.isFinite(size)) {
    return '확인할 수 없음';
  }

  const megabytes = size / (1024 * 1024);

  if (megabytes < 1) {
    return `${Math.round(size / 1024)} KB`;
  }

  return `${megabytes.toFixed(1)} MB`;
};

const formatImageType = (mimeType) => {
  const typeMap = {
    'image/jpeg': 'JPEG',
    'image/png': 'PNG',
    'image/webp': 'WEBP',
    'image/heic': 'HEIC',
    'image/heif': 'HEIF',
  };

  return typeMap[mimeType] ?? 'IMAGE';
};

const BestPickInfoSheet = ({
  isOpen,
  photo,
  onClose,
}) => {
  const [metadata, setMetadata] =
    useState(null);

  useEffect(() => {
    if (!isOpen || !photo?.imageUrl) {
      return undefined;
    }

    let isCancelled = false;
    const controller = new AbortController();

    // 현재 사진의 메타데이터 일부만 안전하게 갱신
    const updateMetadata = (nextMetadata) => {
      if (isCancelled) {
        return;
      }

      setMetadata((previousMetadata) => ({
        photoId: photo.id,
        width:
          previousMetadata?.photoId === photo.id
            ? previousMetadata.width
            : null,
        height:
          previousMetadata?.photoId === photo.id
            ? previousMetadata.height
            : null,
        fileSize:
          previousMetadata?.photoId === photo.id
            ? previousMetadata.fileSize
            : null,
        mimeType:
          previousMetadata?.photoId === photo.id
            ? previousMetadata.mimeType
            : '',
        ...nextMetadata,
      }));
    };

    // 이미지 자체에서 해상도 확인
    const image = new Image();

    image.onload = () => {
      updateMetadata({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    };

    image.src = photo.imageUrl;

    // S3 파일을 통해 용량과 형식 확인
    const loadFileMetadata = async () => {
      try {
        const response = await fetch(
          photo.imageUrl,
          {
            signal: controller.signal,
            cache: 'force-cache',
          },
        );

        if (!response.ok) {
          throw new Error(
            '이미지 파일 정보를 확인하지 못했습니다.',
          );
        }

        const blob = await response.blob();

        updateMetadata({
          fileSize: blob.size,
          mimeType:
            blob.type ||
            response.headers.get(
              'content-type',
            ) ||
            '',
        });
      } catch (error) {
        if (error.name === 'AbortError') {
          return;
        }

        console.warn(
          '이미지 메타데이터 조회 실패:',
          error,
        );

        updateMetadata({
          fileSize: null,
          mimeType: '',
        });
      }
    };

    loadFileMetadata();

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [
    isOpen,
    photo?.id,
    photo?.imageUrl,
  ]);

  const currentMetadata =
    metadata?.photoId === photo?.id
      ? metadata
      : null;

  const resolution =
    currentMetadata?.width &&
    currentMetadata?.height
      ? `${currentMetadata.width} × ${currentMetadata.height}`
      : '확인 중';

  return (
    <AnimatePresence>
      {isOpen && photo && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* 바텀시트 바깥 배경 */}
          <motion.button
            type="button"
            onClick={onClose}
            data-press-feedback="none"
            className="absolute inset-0 bg-text-primary/40"
            aria-label="이미지 정보 닫기"
          />

          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="best-pick-info-title"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              stiffness: 350,
              damping: 35,
            }}
            className="
              relative mx-auto w-full max-w-md
              rounded-t-3xl bg-background
              px-5 pt-5
              pb-[max(1.25rem,env(safe-area-inset-bottom))]
            "
          >
            <h2
              id="best-pick-info-title"
              className="text-center text-lg font-semibold"
            >
              이미지 정보
            </h2>

            {/* 파일 요약 */}
            <div className="mt-5 flex items-center justify-between rounded-2xl bg-gray-100 px-4 py-4">
              <div>
                <p className="text-xs text-text-secondary">
                  파일 용량
                </p>

                <p className="mt-1 font-semibold">
                  {currentMetadata
                    ? formatFileSize(
                        currentMetadata.fileSize,
                      )
                    : '확인 중'}
                </p>
              </div>

              <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium">
                {currentMetadata
                  ? formatImageType(
                      currentMetadata.mimeType,
                    )
                  : 'IMAGE'}
              </span>
            </div>

            {/* 상세 정보 */}
            <dl className="mt-4 divide-y divide-border rounded-2xl border border-border px-4">
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-sm text-text-secondary">
                  앨범
                </dt>
                <dd className="truncate text-sm font-medium">
                  {photo.categoryName ?? '-'}
                </dd>
              </div>

              <div className="flex justify-between gap-4 py-3">
                <dt className="text-sm text-text-secondary">
                  촬영 날짜
                </dt>
                <dd className="text-sm font-medium">
                  {formatCapturedDate(
                    photo.capturedDate,
                  )}
                </dd>
              </div>

              <div className="flex justify-between gap-4 py-3">
                <dt className="text-sm text-text-secondary">
                  해상도
                </dt>
                <dd className="text-sm font-medium">
                  {resolution}
                </dd>
              </div>

            </dl>

            <button
              type="button"
              onClick={onClose}
              className="mt-5 h-12 w-full rounded-xl bg-primary font-semibold text-background"
            >
              닫기
            </button>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BestPickInfoSheet;