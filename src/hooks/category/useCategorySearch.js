import {
  useMemo,
  useState,
} from 'react';
import {
  CATEGORY_SORT,
} from '../../constants/category';

const CATEGORY_SORT_STORAGE_KEY =
  'piccup-category-sort';

const getInitialSortOption = () => {
  const savedSort =
    localStorage.getItem(
      CATEGORY_SORT_STORAGE_KEY,
    );

  return Object
    .values(CATEGORY_SORT)
    .includes(savedSort)
      ? savedSort
      : CATEGORY_SORT.LATEST;
};

const useCategorySearch = (categories = []) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // 마지막으로 선택한 정렬 기준을 불러옴
  const [sortOption, setSortOptionState] =
    useState(getInitialSortOption);

  const setSortOption = (option) => {
    setSortOptionState(option);

    localStorage.setItem(
      CATEGORY_SORT_STORAGE_KEY,
      option,
    );
  };

  // 입력한 이름이 포함된 카테고리만 표시
  const filteredCategories = useMemo(() => { 
    const normalizedQuery = searchQuery
      .trim()
      .normalize('NFC') //문자열의 Unicode 표현을 통일
      .toLocaleLowerCase('ko-KR'); //영문 대소문자를 무시하고 검색
      //검색과 정렬 함께 적용
      const searchedCategories =
      normalizedQuery.length === 0
        ? [...categories]
        : categories.filter((category) => //실제 검색
            category.name
              .normalize('NFC')
              .toLocaleLowerCase('ko-KR')
              .includes(normalizedQuery), //조건에 맞는것만 남김
          );
    
    return searchedCategories.sort((a, b) => { //작은게 앞으로
        if (sortOption === CATEGORY_SORT.NAME) {
            return a.name.localeCompare(
            b.name,
            'ko-KR',
            );
        }

        if (
            sortOption === CATEGORY_SORT.PHOTO_COUNT
        ) {
            return (
            (b.bestPickCount ?? 0) -
            (a.bestPickCount ?? 0)
            );
        }

        // yyyy-MM-dd 형식이므로 문자열 비교 가능
        return (
            b.latestCapturedDate ?? ''
        ).localeCompare(
            a.latestCapturedDate ?? '',
        );
        });
    }, [
        categories,
        searchQuery,
        sortOption,
    ]);
      
  const openSearch = () => {
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return {
    searchQuery,
    setSearchQuery,
    isSearchOpen,
    filteredCategories,
    sortOption,
    setSortOption,
    openSearch,
    closeSearch,
  };
};

export default useCategorySearch;
