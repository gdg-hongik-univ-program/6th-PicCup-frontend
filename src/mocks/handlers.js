import {
  http,
  HttpResponse,
} from 'msw';

const user = {
  id: 1,
  email: 'dev@piccup.com',
  nickname: '개발 사용자',
  profileImageUrl: null,
};

let categories = [
  {
    id: 1,
    name: '일상',
    isDefault: false,
  },
  {
    id: 2,
    name: '여행',
    isDefault: false,
  },
];

let bestPicks = [
  {
    id: 101,
    categoryId: 1,
    categoryName: '일상',
    capturedDate: '2026-08-15',
    candidateCount: 1,
    createdAt: '2026-08-15T10:00:00',
    imageUrl: '/apple-touch-icon.png',
    isLiked: true,
  },
  {
    id: 102,
    categoryId: 2,
    categoryName: '여행',
    capturedDate: '2026-08-14',
    candidateCount: 1,
    createdAt: '2026-08-14T10:00:00',
    imageUrl: '/favicon.png',
    isLiked: false,
  },
];

const getCategoryResponse = () =>
  categories.map((category) => {
    const photos = bestPicks
      .filter(
        (photo) =>
          photo.categoryId === category.id,
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt),
      );

    return {
      ...category,
      bestPickCount: photos.length,
      latestCapturedDate:
        photos[0]?.capturedDate ?? null,
      coverImageUrl:
        photos[0]?.imageUrl ?? null,
    };
  });

export const handlers = [
  // 로그인 유지
  http.get('/api/users/me', () => {
    return HttpResponse.json(user);
  }),

  http.post('/api/users/login', () => {
    return HttpResponse.json({
      id: user.id,
      nickname: user.nickname,
    });
  }),

  http.post('/api/users/signup', () => {
    return HttpResponse.json(
      user,
      { status: 201 },
    );
  }),

  http.post('/api/users/logout', () => {
    return HttpResponse.json({
      ok: true,
    });
  }),

  // 카테고리
  http.get('/api/categories', () => {
    return HttpResponse.json(
      getCategoryResponse(),
    );
  }),

  http.post(
    '/api/categories',
    async ({ request }) => {
      const { name } =
        await request.json();

      const newCategory = {
        id: Date.now(),
        name,
        isDefault: false,
        bestPickCount: 0,
        latestCapturedDate: null,
        coverImageUrl: null,
      };

      categories = [
        ...categories,
        newCategory,
      ];

      return HttpResponse.json(
        newCategory,
        { status: 201 },
      );
    },
  ),

  // 전체·카테고리별 사진 조회
  http.get(
    '/api/best-picks',
    ({ request }) => {
      const url = new URL(request.url);
      const categoryId =
        url.searchParams.get(
          'categoryId',
        );

      const result = categoryId
        ? bestPicks.filter(
            (photo) =>
              String(photo.categoryId) ===
              String(categoryId),
          )
        : bestPicks;

      return HttpResponse.json(result);
    },
  ),

  // 캘린더 조회
  http.get(
    '/api/best-picks/calendar',
    ({ request }) => {
      const url = new URL(request.url);
      const yearMonth =
        url.searchParams.get(
          'yearMonth',
        );

      const result = bestPicks.filter(
        (photo) =>
          photo.capturedDate.startsWith(
            yearMonth,
          ),
      );

      return HttpResponse.json(result);
    },
  ),

  // 개별 사진 조회
  http.get(
    '/api/best-picks/:bestPickId',
    ({ params }) => {
      const photo = bestPicks.find(
        (item) =>
          String(item.id) ===
          String(params.bestPickId),
      );

      if (!photo) {
        return HttpResponse.json(
          {
            code:
              'BEST_PICK_NOT_FOUND',
          },
          { status: 404 },
        );
      }

      return HttpResponse.json(photo);
    },
  ),

  // 좋아요
  http.patch(
    '/api/best-picks/:bestPickId/like',
    async ({ params, request }) => {
      const { isLiked } =
        await request.json();

      bestPicks = bestPicks.map(
        (photo) =>
          String(photo.id) ===
          String(params.bestPickId)
            ? {
                ...photo,
                isLiked,
              }
            : photo,
      );

      const updatedPhoto =
        bestPicks.find(
          (photo) =>
            String(photo.id) ===
            String(params.bestPickId),
        );

      return HttpResponse.json(
        updatedPhoto,
      );
    },
  ),

  // 다른 앨범으로 이동
  http.patch(
    '/api/best-picks/move',
    async ({ request }) => {
      const {
        ids,
        targetCategoryId,
      } = await request.json();

      const targetCategory =
        categories.find(
          (category) =>
            String(category.id) ===
            String(targetCategoryId),
        );

      if (!targetCategory) {
        return HttpResponse.json(
          {
            code:
              'CATEGORY_NOT_FOUND',
          },
          { status: 404 },
        );
      }

      bestPicks = bestPicks.map(
        (photo) =>
          ids.some(
            (id) =>
              String(id) ===
              String(photo.id),
          )
            ? {
                ...photo,
                categoryId:
                  targetCategory.id,
                categoryName:
                  targetCategory.name,
              }
            : photo,
      );

      return HttpResponse.json({
        movedIds: ids,
        categoryId:
          targetCategory.id,
        categoryName:
          targetCategory.name,
      });
    },
  ),

  // 사진 삭제
  http.post(
    '/api/best-picks/delete',
    async ({ request }) => {
      const { ids } =
        await request.json();

      bestPicks = bestPicks.filter(
        (photo) =>
          !ids.some(
            (id) =>
              String(id) ===
              String(photo.id),
          ),
      );

      return HttpResponse.json({
        deleted: ids,
      });
    },
  ),

  // 작성되지 않은 API가 실제 서버로 넘어가는 것을 차단
  http.all(/\/api\/.*/, () => {
    return HttpResponse.json(
      {
        message:
          '개발 Mock에 아직 등록되지 않은 API입니다.',
      },
      { status: 501 },
    );
  }),
];