const HEIC_EXTENSION_PATTERN = /\.heic$/i;
const HEIF_EXTENSION_PATTERN = /\.heif$/i;

export const isSupportedImageFile = (file) => {
  return (
    file.type.startsWith('image/') ||
    HEIC_EXTENSION_PATTERN.test(file.name) ||
    HEIF_EXTENSION_PATTERN.test(file.name)
  );
};

export const normalizeImageFile = (file) => {
  let normalizedType = file.type;

  if (HEIC_EXTENSION_PATTERN.test(file.name)) {
    normalizedType = 'image/heic';
  }

  if (HEIF_EXTENSION_PATTERN.test(file.name)) {
    normalizedType = 'image/heif';
  }

  if (
    !normalizedType ||
    normalizedType === file.type
  ) {
    return file;
  }

  return new File(
    [file],
    file.name,
    {
      type: normalizedType,
      lastModified: file.lastModified,
    },
  );
};