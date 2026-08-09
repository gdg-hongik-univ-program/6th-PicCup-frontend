import { ChevronLeft, Heart, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import {
  useLocation,
  useNavigate,
  useParams,
} from 'react-router';

import BottomNav from '../components/layout/BottomNav';
import mockBestPicks from '../constants/mockPhotos';

const AlbumDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); //이전 페이지에서 전달된 상태를 가져오기 위해 useLocation 사용
  const { categoryId } = useParams();

  const [showLikedOnly, setShowLikedOnly] = useState(false);

  const albumName =
    categoryId === 'all'
      ? '전체'
      : location.state?.albumName ?? '앨범';

  const albumPhotos =
    categoryId === 'all'
        ? mockBestPicks
        : mockBestPicks.filter(
            (photo) =>
            String(photo.categoryId) === categoryId,
        );

  const visiblePhotos = showLikedOnly
    ? albumPhotos.filter((photo) => photo.isLiked)
    : albumPhotos;

  return (
    <main className="flex min-h-dvh flex-col pb-28">
      <div className="flex-1 px-4 pt-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex size-10 items-center justify-center"
          aria-label="앨범 목록으로 돌아가기"
        >
          <ChevronLeft size={24} />
        </button>

        <section className="mt-4">
            <div className="flex items-baseline gap-2">
                <h1 className=" px-2 text-3xl font-semibold">
                {albumName}
                </h1>

                <span className="text-sm text-text-secondary">
                {albumPhotos.length}장
                </span>
            </div>
        </section>
        <div className="mt-4 flex items-center justify-between">
            <button
                type="button"
                onClick={() =>
                setShowLikedOnly((previous) => !previous)
                }
                aria-pressed={showLikedOnly}
                className={`flex px-4 py-2 items-center justify-center rounded-full border border-border ${
                showLikedOnly
                    ? 'bg-primary text-white'
                    : 'bg-white text-text-primary'
                }`}
            >
                <Heart
                size={16}
                />
            </button>

            <div className="flex items-center gap-2">
                <button
                type="button"
                className="flex px-4 py-2 items-center justify-center rounded-full border border-border"
                aria-label="뷰 옵션"
                >
                <SlidersHorizontal size={17} />
                </button>

                <button
                type="button"
                className="rounded-full border border-border px-3.5 py-1.5 text-sm"
                >
                선택
                </button>
            </div>
        </div>
        <section className="mt-5 columns-3 gap-1">
            {visiblePhotos.map((photo) => (
                <button
                key={photo.id}
                type="button"
                className="relative mb-1 block w-full break-inside-avoid overflow-hidden rounded-xl"
                >
                <img
                    src={photo.imageUrl}
                    alt={`${photo.categoryName} 베스트픽`}
                    className="block h-auto w-full object-cover"
                />
                {photo.isLiked && (
                    <span className="absolute bottom-3 left-3 text-white/90">
                        <Heart 
                        size={17}
                        fill='currentColor'
                        />
                    </span>
                )}
                </button>
            ))}
        </section>
      </div>

      <BottomNav activeTab="album" />
    </main>
  );
};

export default AlbumDetailPage;