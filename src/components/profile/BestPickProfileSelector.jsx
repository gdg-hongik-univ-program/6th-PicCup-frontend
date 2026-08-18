import { useState } from 'react';
import { Check } from 'lucide-react';

import useBestPicks from '../../hooks/album/useBestPicks';

import BackHeader from '../layout/BackHeader';

const BestPickProfileSelector = ({
  onClose,
  onSelect,
}) => {
  const {
    bestPicks: photos,
    isLoading,
    fetchError,
  } = useBestPicks('all');

  const [selectedPhoto, setSelectedPhoto] =
    useState(null);

  return (
    <section className="fixed inset-0 z-[80] mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background px-4 py-4">
      <BackHeader
        title="Best Pick 선택하기"
        onBack={onClose}
      />

      <div className="flex-1 overflow-y-auto pt-5">
        {isLoading && (
          <p className="py-10 text-center text-sm text-text-secondary">
            Best Pick을 불러오는 중입니다.
          </p>
        )}

        {!isLoading && fetchError && (
          <p
            className="py-10 text-center text-sm text-error"
            role="alert"
          >
            {fetchError}
          </p>
        )}

        {!isLoading &&
          !fetchError &&
          photos.length === 0 && (
            <p className="py-10 text-center text-sm text-text-secondary">
              선택할 수 있는 Best Pick이 없습니다.
            </p>
          )}

        <div className="grid grid-cols-3 gap-1">
          {photos.map((photo) => {
            const isSelected =
              selectedPhoto?.id === photo.id;

            return (
              <button
                key={photo.id}
                type="button"
                data-thumbnail="true"
                onClick={() =>
                  setSelectedPhoto(photo)
                }
                className="relative aspect-square overflow-hidden rounded-2xl"
                aria-pressed={isSelected}
              >
                <img
                  src={photo.imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />

                {isSelected && (
                  <>
                    <div className="absolute inset-0 bg-background/40" />

                    <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-primary text-background">
                      <Check size={12} strokeWidth={4} />
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-4">
        <button
          type="button"
          onClick={() =>
            onSelect(selectedPhoto)
          }
          disabled={!selectedPhoto}
          className="h-12 w-full rounded-xl bg-primary font-semibold text-background"
        >
          선택하기
        </button>
      </div>
    </section>
  );
};

export default BestPickProfileSelector;
