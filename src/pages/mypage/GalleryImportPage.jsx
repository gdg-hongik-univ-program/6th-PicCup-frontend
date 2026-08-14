import {
  ImagePlus,
  X,
} from 'lucide-react';

import AuthButton from '../../components/auth/AuthButton';
import CategoryManagementOverlays from '../../components/category/CategoryManagementOverlays';
import BackHeader from '../../components/layout/BackHeader';
import CategoryGrid from '../../components/layout/CategoryGrid';
import useCategoryManagement from '../../hooks/category/useCategoryManagement';
import useGalleryImport from '../../hooks/profile/useGalleryImport';

const GalleryImportPage = () => {
  const categoryManagement =
    useCategoryManagement();

  const {
    categories,
    isLoading: isCategoryLoading,
    fetchError,
    openCreateSheet,
  } = categoryManagement;

  const {
    imageInputRef,
    selectedImages,
    selectedCategory,
    capturedDate,
    todayDate,
    isUploading,
    uploadError,
    openGallery,
    handleImageChange,
    removeImage,
    handleCategorySelect,
    handleDateChange,
    handleUpload,
  } = useGalleryImport();

  return (
    <main className="min-h-dvh px-4 pt-2 pb-32">
      <BackHeader title="이미지 불러오기" />

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*,.heic,.heif,image/heic,image/heif"
        multiple
        onChange={handleImageChange}
        className="hidden"
      />

      <section className="mt-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            사진 선택
          </h2>

          {selectedImages.length > 0 && (
            <button
              type="button"
              onClick={openGallery}
              className="text-sm font-medium text-primary"
            >
              다시 선택
            </button>
          )}
        </div>

        {selectedImages.length === 0 ? (
          <button
            type="button"
            onClick={openGallery}
            className="mt-3 flex h-32 w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-gray-50 text-text-secondary active:bg-gray-100"
          >
            <ImagePlus size={32} />

            <span className="text-sm font-medium">
              갤러리에서 이미지 불러오기
            </span>
          </button>
        ) : (
          <>
            <p className="mt-1 text-sm text-text-secondary">
                {selectedImages.length}장을 선택했어요.
            </p>
            <div className="mt-3 flex gap-2 overflow-x-auto overscroll-x-contain pb-2">
                {selectedImages.map((image) => (
                    <div
                    key={image.id}
                    className="relative size-26 shrink-0 overflow-hidden rounded-xl bg-gray-100"
                    >
                    <img
                        src={image.previewUrl}
                        alt=""
                        className="h-full w-full object-cover"
                    />

                    <button
                        type="button"
                        onClick={() =>
                        removeImage(image.id)
                        }
                        className="absolute right-1 top-1 flex size-7 items-center justify-center rounded-full bg-black/55 text-white"
                        aria-label="선택한 이미지 제거"
                    >
                        <X size={16} />
                    </button>
                    </div>
                ))}
            </div>
          </>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">
          카테고리 선택
        </h2>

        {fetchError && (
          <p className="mt-3 text-sm text-error">
            {fetchError}
          </p>
        )}

        {isCategoryLoading ? (
          <p className="mt-4 text-sm text-text-secondary">
            카테고리를 불러오는 중이에요.
          </p>
        ) : (
          <CategoryGrid
            categories={categories}
            leadingType="add"
            showBestPickCount={false}
            selectedCategoryId={
              selectedCategory?.id
            }
            className="max-h-[calc(min(66.6667vw,18.6667rem)-1.4167rem)] overflow-y-auto overscroll-contain"
            onLeadingClick={openCreateSheet}
            onCategoryClick={
              handleCategorySelect
            }
          />
        )}
      </section>

      <section className="mt-8">
        <label
          htmlFor="gallery-captured-date"
          className="text-lg font-semibold"
        >
          촬영 날짜
        </label>

        <input
          id="gallery-captured-date"
          type="date"
          value={capturedDate}
          max={todayDate}
          onChange={handleDateChange}
          className="mt-3 block h-12 w-56 max-w-full rounded-xl border border-border bg-surface px-4 outline-none focus:border-primary"
        />

        <p className="mt-2 px-2 text-xs text-text-secondary">
          선택한 모든 사진에 같은 날짜가 적용돼요.
        </p>
      </section>

      <div className="fixed inset-x-0 bottom-4 z-40 mx-auto w-full max-w-md px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2">
        <div className="mb-2 flex min-h-5 items-center justify-center">
            {uploadError && (
            <p
                className="text-center text-xs text-error"
                role="alert"
            >
                {uploadError}
            </p>
            )}
        </div>

        <AuthButton
            onClick={handleUpload}
            disabled={
            isUploading ||
            selectedImages.length === 0 ||
            !selectedCategory ||
            !capturedDate
            }
        >
            {isUploading
            ? '이미지 추가 중...'
            : `${selectedImages.length}장 추가하기`}
        </AuthButton>
        </div>

      <CategoryManagementOverlays
        management={categoryManagement}
      />
    </main>
  );
};

export default GalleryImportPage;