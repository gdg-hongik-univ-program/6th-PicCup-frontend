import { HOME_MOCK_CUTOFF_DATE } from '../constants/homeMockBestPicks';

export const getYearMonth = (date) => {
  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1,
  ).padStart(2, '0');

  return `${year}-${month}`;
}; //날짜를 API 쿼리 형식으로 변경

export const mergeHomeBestPicks = ({
  yearMonth,
  mockBestPicks,
  serverBestPicks,
}) => {
  const monthlyMockBestPicks =
    mockBestPicks.filter(
      (photo) =>
        photo.capturedDate.startsWith(yearMonth),
    );

  const monthlyServerBestPicks =
    serverBestPicks.filter(
      (photo) =>
        photo.capturedDate.startsWith(yearMonth) &&
        photo.capturedDate >
          HOME_MOCK_CUTOFF_DATE,
    );

  return [
    ...monthlyMockBestPicks,
    ...monthlyServerBestPicks,
  ];
};

export const getCalendarPhotoByDate = ( //캘린더 섬네일 선택
  bestPicks,
) => {
  return bestPicks.reduce((result, photo) => {
    const currentPhoto =
      result[photo.capturedDate];

    if (
      !currentPhoto ||
      (photo.createdAt ?? '') >
        (currentPhoto.createdAt ?? '')
    ) {
      result[photo.capturedDate] = photo;
    }

    return result;
  }, {});
};

export const getLatestCapturedDate = ( //최초 하단 Best Picks에 보여줄 가장 최근 날짜 계산
  bestPicks,
) => {
  return bestPicks.reduce(
    (latestDate, photo) =>
      photo.capturedDate > latestDate
        ? photo.capturedDate
        : latestDate,
    '',
  );
};