import {
  useEffect,
  useMemo, //목업 사진 중 삭제된 사진만 골라서 가공할 때 사용
  useState,
} from 'react';
import { Check, Trash2 } from 'lucide-react';

import { getDeletedBestPicks } from '../api/bestPickApi';
import { getTrashPhotos } from '../libs/photoDB';
import useMockBestPickStore from '../store/useMockBestPickStore';

import BackHeader from '../components/layout/BackHeader';

const DAY_IN_MS = 24 * 60 * 60 * 1000; //하루를 밀리초로 바꾼 값

const calculateDaysLeft = ( //사진이 자동 삭제되기까지 며칠 남았는지 계산
  deletedAt,
  retentionDays,
) => {
  if (!deletedAt) return retentionDays;

  const expiresAt =
    new Date(deletedAt).getTime() +
    retentionDays * DAY_IN_MS;

  return Math.max(
    0, //0일부터 시작
    Math.ceil( //올림
      (expiresAt - Date.now()) / DAY_IN_MS,
    ),
  );
};

const TrashPage = () => {
  const isPreviewMode =
    import.meta.env.DEV &&
    import.meta.env.VITE_AUTH_PREVIEW ===
      'true';
  const [activeTab, setActiveTab] = useState('rejected'); //탈락사진먼저
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const [
    selectedPhotoKeys,
    setSelectedPhotoKeys,
  ] = useState([]);
  
  const [rejectedPhotos, setRejectedPhotos] = useState([]);
  //탈락사진 목록

  const [
    serverDeletedBestPicks,
    setServerDeletedBestPicks,
  ] = useState([]);

  const [isRejectedLoading, setIsRejectedLoading] = useState(true);
  const [isServerLoading, setIsServerLoading] = useState(!isPreviewMode);
  const [rejectedError, setRejectedError] = useState('');
  const [serverError, setServerError] = useState('');

  const mockPhotos = useMockBestPickStore(
    (state) => state.photos,
  );


  useEffect(() => {
    let isCancelled = false; //상태 업데이트 막음
    const objectUrls = [];

    const loadRejectedPhotos = async () => {
      try {
        const photos = await getTrashPhotos();

        const photosWithPreview = photos.map(
          (photo) => {
            const previewUrl =
              URL.createObjectURL(photo.blob);

            objectUrls.push(previewUrl);

            return {
              ...photo,
              previewUrl,
              daysLeft: photo.expiresAt
                ? Math.max(
                    0,
                    Math.ceil(
                      (
                        new Date(
                          photo.expiresAt,
                        ).getTime() -
                        Date.now()
                      ) / DAY_IN_MS,
                    ),
                  )
                : 7, //expiresAt이 없을 경우
            };
          },
        );

        if (isCancelled) return;

        setRejectedPhotos(photosWithPreview);
        setRejectedError('');
      } catch (error) {
        if (isCancelled) return;

        console.error(
          '탈락 사진 휴지통 조회 실패:',
          error,
        );

        setRejectedError(
          '탈락 사진을 불러오지 못했습니다.',
        );
      } finally {
        if (!isCancelled) {
          setIsRejectedLoading(false);
        }
      }
    };

    loadRejectedPhotos();

    return () => {
      isCancelled = true;

      objectUrls.forEach((objectUrl) => {
        URL.revokeObjectURL(objectUrl); //패이지 떠날때 정리
      });
    };
  }, []);

  useEffect(() => {
    if (isPreviewMode) { //개발자 모드에서는 서버데이터 없음
      return undefined;
    }

    let isCancelled = false;

    const loadDeletedBestPicks = async () => {
      try {
        const result =
          await getDeletedBestPicks();

        if (isCancelled) return;

        setServerDeletedBestPicks(result);
        setServerError('');
      } catch (error) {
        if (isCancelled) return;

        console.error(
          '삭제한 베스트픽 조회 실패:',
          error,
        );

        setServerError(
          error.response?.data?.message ??
            '삭제한 베스트픽을 불러오지 못했습니다.',
        );
      } finally {
        if (!isCancelled) {
          setIsServerLoading(false);
        }
      }
    };

    loadDeletedBestPicks();

    return () => {
      isCancelled = true;
    };
  }, [isPreviewMode]);

  const mockDeletedBestPicks = useMemo(
    () =>
      mockPhotos
        .filter((photo) => photo.deletedAt)
        .map((photo) => ({
          ...photo,
          isMock: true,
          daysLeft: calculateDaysLeft(
            photo.deletedAt,
            30,
          ),
        })),
    [mockPhotos],
  );

  const deletedBestPicks = [
    ...mockDeletedBestPicks,
    ...serverDeletedBestPicks,
  ];

  const visiblePhotos =
    activeTab === 'rejected'
      ? rejectedPhotos
      : deletedBestPicks;

  const getPhotoKey = (photo) => {
    if (activeTab === 'rejected') {
        return `rejected-${photo.id}`;
    }

    return `${
        photo.isMock ? 'mock' : 'server'
    }-${photo.id}`;
  };

  const selectedPhotos = visiblePhotos.filter(
    (photo) =>
        selectedPhotoKeys.includes(
        getPhotoKey(photo),
        ),
  );

  const handleTabChange = (nextTab) => {
    setActiveTab(nextTab);
    setIsSelectionMode(false);
    setSelectedPhotoKeys([]);
  };

  const handleSelectionMode = () => {
    if (isSelectionMode) {
        setSelectedPhotoKeys([]);
  }

    setIsSelectionMode(
        (previous) => !previous,
    );
  }  

  const togglePhotoSelection = (photo) => {
    const photoKey = getPhotoKey(photo);

    setSelectedPhotoKeys((previousKeys) =>
        previousKeys.includes(photoKey)
        ? previousKeys.filter(
            (key) => key !== photoKey,
            )
        : [...previousKeys, photoKey],
    );
  };

  const isLoading =
    activeTab === 'rejected'
      ? isRejectedLoading
      : isServerLoading;

  const currentError =
    activeTab === 'rejected'
      ? rejectedError
      : serverError;

  const emptyMessage =
    activeTab === 'rejected'
      ? '탈락 사진이 없어요.'
      : '삭제한 베스트픽이 없어요.';

  const emptyDescription =
    activeTab === 'rejected'
      ? '토너먼트에서 탈락한 사진은 7일간 보관돼요.'
      : '삭제한 베스트픽은 30일간 보관돼요.';

  return (
    <main
        className={`min-h-dvh px-4 py-4 ${
            isSelectionMode ? 'pb-24' : ''
        }`}
    >
      <BackHeader title="휴지통" />

      <div className="mt-3 grid grid-cols-2 border-b border-border">
        <button
          type="button"
          onClick={() =>
            handleTabChange('rejected')
          }
          className={`border-b-2 py-3 text-sm ${
            activeTab === 'rejected'
              ? 'border-primary font-semibold text-text-primary'
              : 'border-transparent text-text-secondary'
          }`}
        >
          탈락 사진
        </button>

        <button
          type="button"
          onClick={() =>
            handleTabChange('best-pick')
          }
          className={`border-b-2 py-3 text-sm ${
            activeTab === 'best-pick'
              ? 'border-primary font-semibold text-text-primary'
              : 'border-transparent text-text-secondary'
          }`}
        >
          삭제한 베스트픽
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between px-1">
        <div>
            <p className="text-xs text-text-secondary">
            {activeTab === 'rejected'
                ? '7일 이내 자동 삭제'
                : '30일 이내 자동 삭제'}
            </p>

            {isSelectionMode && (
            <p className="mt-1 text-xs font-semibold text-primary">
                {selectedPhotos.length}장 선택
            </p>
            )}
        </div>

        <button
            type="button"
            onClick={handleSelectionMode}
            disabled={visiblePhotos.length === 0}
            className="rounded-full border border-border px-3 py-1.5 text-xs disabled:opacity-40"
        >
            {isSelectionMode
            ? '선택 해제'
            : '선택'}
        </button>
      </div>

      {currentError && (
        <p
          className="mt-4 text-center text-xs text-error"
          role="alert"
        >
          {currentError}
        </p>
      )}

      {isLoading ? (
        <p className="py-16 text-center text-sm text-text-secondary">
          사진을 불러오는 중입니다.
        </p>
      ) : visiblePhotos.length === 0 ? (
        <section className="flex min-h-[55dvh] flex-col items-center justify-center text-center">
          <Trash2
            size={28}
            className="text-text-secondary"
          />

          <p className="mt-4 text-sm font-medium">
            {emptyMessage}
          </p>

          <p className="mt-2 text-xs leading-5 text-text-secondary">
            {emptyDescription}
          </p>
        </section>
      ) : (
        <section className="mt-4 grid grid-cols-3 gap-1">
          {visiblePhotos.map((photo) => {
            const photoKey = getPhotoKey(photo);

            const isSelected =
                selectedPhotoKeys.includes(photoKey);

            return (
                <button
                key={photoKey}
                type="button"
                onClick={() => {
                    if (!isSelectionMode) return;

                    togglePhotoSelection(photo);
                }}
                aria-pressed={
                    isSelectionMode
                    ? isSelected
                    : undefined
                }
                className="relative aspect-square overflow-hidden rounded-xl bg-gray-200"
                >
                <img
                    src={
                    activeTab === 'rejected'
                        ? photo.previewUrl
                        : photo.imageUrl
                    }
                    alt=""
                    className="h-full w-full object-cover"
                />

                {isSelectionMode && isSelected && (
                    <>
                    <div className="absolute inset-0 bg-black/20" />

                    <span className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-primary text-white">
                        <Check
                        size={12}
                        strokeWidth={4}
                        />
                    </span>
                    </>
                )}

                <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-1 text-[10px] text-white">
                    {photo.daysLeft}일 남음
                </span>
                </button>
            );
          })}
        </section>
      )}

      {isSelectionMode &&
        visiblePhotos.length > 0 && (
            <div className="fixed inset-x-0 bottom-5 z-50 mx-auto grid w-full max-w-md grid-cols-2 gap-2 px-4">
            <button
                type="button"
                disabled={
                selectedPhotos.length === 0
                }
                className="h-12 rounded-xl bg-primary font-semibold text-white shadow-lg disabled:bg-primary-muted"
            >
                {activeTab === 'rejected'
                ? '앨범에 추가'
                : '복구하기'}
            </button>

            <button
                type="button"
                disabled={
                selectedPhotos.length === 0
                }
                className="h-12 rounded-xl bg-white font-semibold text-error shadow-lg ring-1 ring-border disabled:text-error/40"
            >
                영구 삭제
            </button>
            </div>
      )}
    </main>
  );
};

export default TrashPage;