// 앨범 사진 뷰 크기
export const ALBUM_VIEW = {
  LARGE: 'large',
  DEFAULT: 'default',
  SMALL: 'small',
};

// 뷰 옵션 메뉴
export const ALBUM_VIEW_OPTIONS = [
  {
    value: ALBUM_VIEW.LARGE,
    label: '크게',
  },
  {
    value: ALBUM_VIEW.DEFAULT,
    label: '기본',
  },
  {
    value: ALBUM_VIEW.SMALL,
    label: '작게',
  },
];

// 뷰 크기별 그리드 클래스
export const ALBUM_VIEW_GRID_CLASS = {
  [ALBUM_VIEW.LARGE]:
    'grid grid-cols-2 items-start gap-1.5',

  [ALBUM_VIEW.DEFAULT]:
    'grid grid-cols-3 items-start gap-1',

  [ALBUM_VIEW.SMALL]:
    'grid grid-cols-5 items-start gap-0.5',
};
