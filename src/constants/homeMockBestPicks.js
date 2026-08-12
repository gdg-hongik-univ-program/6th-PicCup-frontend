export const HOME_MOCK_CUTOFF_DATE =
  '2026-08-11';

const HOME_MOCK_SOURCE = [
  // 7월 목업
  ['2026-07-03', '/images/cat.jpg'],
  ['2026-07-04', '/images/landscape.jpg'],
  ['2026-07-05', '/images/friend.webp'],
  ['2026-07-08', '/images/dokyo.webp'],
  ['2026-07-10', '/images/friends.jpg'],
  ['2026-07-12', '/images/friend.webp'],
  ['2026-07-15', '/images/landscape.jpg'],
  ['2026-07-16', '/images/dokyo.webp'],
  ['2026-07-18', '/images/cat.jpg'],
  ['2026-07-20', '/images/friends.jpg'],
  ['2026-07-22', '/images/landscape.jpg'],

  // 7월 24일 Best Picks 4장
  [
    '2026-07-24',
    '/images/dokyo.webp',
    '09:00:00',
  ],
  [
    '2026-07-24',
    '/images/landscape.jpg',
    '12:00:00',
  ],
  [
    '2026-07-24',
    '/images/friends.jpg',
    '15:00:00',
  ],
  [
    '2026-07-24',
    '/images/friend.webp',
    '18:00:00',
  ],

  // 8월 1일~11일 목업
  ['2026-08-01', '/images/dokyo.webp'],
  ['2026-08-02', '/images/friend.webp'],
  ['2026-08-03', '/images/landscape.jpg'],
  ['2026-08-04', '/images/friends.jpg'],
  ['2026-08-05', '/images/cat.jpg'],
  ['2026-08-06', '/images/dokyo.webp'],
  ['2026-08-07', '/images/landscape.jpg'],
  ['2026-08-08', '/images/friend.webp'],
  ['2026-08-09', '/images/friends.jpg'],
  ['2026-08-10', '/images/cat.jpg'],
  ['2026-08-11', '/images/dokyo.webp'],
];

const homeMockBestPicks =
  HOME_MOCK_SOURCE.map(
    ([capturedDate, imageUrl, time], index) => ({
      id: `mock-home-${index + 1}`,
      categoryId: 'mock-home',
      categoryName: '목업 앨범',
      capturedDate,
      createdAt: `${capturedDate}T${
        time ?? '12:00:00'
      }`, //가장 최근 사진 썸네일 지정을 위해
      imageUrl,
      isLiked: false,
    }),
  );

export default homeMockBestPicks;