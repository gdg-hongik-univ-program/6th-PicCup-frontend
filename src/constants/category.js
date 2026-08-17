//카테고리 이름 최대 글자수
export const CATEGORY_NAME_MAX_LENGTH = 50;

// 카테고리 정렬 기준
export const CATEGORY_SORT = {
  NAME: 'name',
  LATEST: 'latest',
  PHOTO_COUNT: 'photoCount',
};

// 정렬 메뉴에 표시할 목록
export const CATEGORY_SORT_OPTIONS = [
  {
    value: CATEGORY_SORT.NAME,
    label: '가나다순',
  },
  {
    value: CATEGORY_SORT.LATEST,
    label: '최신순',
  },
  {
    value: CATEGORY_SORT.PHOTO_COUNT,
    label: '사진수',
  },
];