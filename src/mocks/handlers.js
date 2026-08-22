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

const MOCK_IMAGES = [
  '/images/cat.jpg',
  '/images/dokyo.webp',
  '/images/friend.webp',
  '/images/friends.jpg',
  '/images/landscape.jpg',
];

let nextBestPickId = 200;

let categories = [
  {
    id: 1,
    name: '일상',
  },
  {
    id: 2,
    name: '여행',
  },
  {
    id: 3,
    name: '친구',
  },
];

let deletedCategories = [];

let bestPicks = [
  {
    id: 101,
    categoryId: 1,
    categoryName: '일상',
    capturedDate: '2026-08-15',
    candidateCount: 4,
    createdAt: '2026-08-15T10:00:00',
    imageUrl: '/images/cat.jpg',
    isLiked: true,
  },
  {
    id: 102,
    categoryId: 2,
    categoryName: '여행',
    capturedDate: '2026-08-14',
    candidateCount: 8,
    createdAt: '2026-08-14T14:00:00',
    imageUrl: '/images/dokyo.webp',
    isLiked: false,
  },
  {
    id: 103,
    categoryId: 3,
    categoryName: '친구',
    capturedDate: '2026-08-13',
    candidateCount: 6,
    createdAt: '2026-08-13T18:00:00',
    imageUrl: '/images/friend.webp',
    isLiked: true,
  },
  {
    id: 104,
    categoryId: 3,
    categoryName: '친구',
    capturedDate: '2026-08-13',
    candidateCount: 5,
    createdAt: '2026-08-13T20:00:00',
    imageUrl: '/images/friends.jpg',
    isLiked: false,
  },
  {
    id: 105,
    categoryId: 2,
    categoryName: '여행',
    capturedDate: '2026-08-12',
    candidateCount: 7,
    createdAt: '2026-08-12T16:00:00',
    imageUrl: '/images/landscape.jpg',
    isLiked: true,
  },
];

let deletedBestPicks = [
  {
    id: 90,
    categoryId: 1,
    categoryName: '일상',
    capturedDate: '2026-08-10',
    candidateCount: 4,
    createdAt: '2026-08-10T10:00:00',
    imageUrl: '/images/landscape.jpg',
    isLiked: false,
    deletedAt: '2026-08-14T10:00:00',
    daysLeft: 29,
  },
  {
    id: 91,
    categoryId: 3,
    categoryName: '친구',
    capturedDate: '2026-08-09',
    candidateCount: 6,
    createdAt: '2026-08-09T10:00:00',
    imageUrl: '/images/friends.jpg',
    isLiked: true,
    deletedAt: '2026-08-13T10:00:00',
    daysLeft: 28,
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
  //카테고리 수정
  http.put(
    '/api/categories/:categoryId',
    async ({
        params,
        request,
    }) => {
        const { name } =
        await request.json();

        const categoryId =
        params.categoryId;

        const targetCategory =
        categories.find(
            (category) =>
            String(category.id) ===
            String(categoryId),
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

        categories = categories.map(
        (category) =>
            String(category.id) ===
            String(categoryId)
            ? {
                ...category,
                name,
                }
            : category,
        );

        bestPicks = bestPicks.map(
        (photo) =>
            String(photo.categoryId) ===
            String(categoryId)
            ? {
                ...photo,
                categoryName: name,
                }
            : photo,
        );

        return HttpResponse.json({
        id: targetCategory.id,
        name,
        });
    },
  ),
  //카테고리 삭제
  http.delete(
    '/api/categories/:categoryId',
    ({ params }) => {
        const categoryId =
        params.categoryId;

        const targetCategory =
        categories.find(
            (category) =>
            String(category.id) ===
            String(categoryId),
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

        const deletedAt =
        new Date().toISOString();

        const categoryPhotos =
        bestPicks.filter(
            (photo) =>
            String(photo.categoryId) ===
            String(categoryId),
        );

        deletedCategories = [
        ...deletedCategories,
        {
            ...targetCategory,
            deletedAt,
        },
        ];

        deletedBestPicks = [
        ...deletedBestPicks,
        ...categoryPhotos.map(
            (photo) => ({
            ...photo,
            deletedAt,
            daysLeft: 30,
            deletedByCategory: true,
            }),
        ),
        ];

        categories = categories.filter(
        (category) =>
            String(category.id) !==
            String(categoryId),
        );

        bestPicks = bestPicks.filter(
        (photo) =>
            String(photo.categoryId) !==
            String(categoryId),
        );

        return HttpResponse.json({
        id: targetCategory.id,
        deletedBestPickCount:
            categoryPhotos.length,
        });
    },
  ),
  
  //카테고리 복구
  http.post(
    '/api/categories/:categoryId/restore',
    ({ params }) => {
        const categoryId =
        params.categoryId;

        const deletedCategory =
        deletedCategories.find(
            (category) =>
            String(category.id) ===
            String(categoryId),
        );

        if (!deletedCategory) {
        return HttpResponse.json(
            {
            code:
                'CATEGORY_NOT_FOUND',
            },
            { status: 404 },
        );
        }

        const restoredCategory = {
        ...deletedCategory,
        };

        delete restoredCategory.deletedAt;

        const photosToRestore =
        deletedBestPicks.filter(
            (photo) =>
            String(photo.categoryId) ===
                String(categoryId) &&
            photo.deletedByCategory,
        );

        const restoredPhotos =
        photosToRestore.map(
            (photo) => {
            const restoredPhoto = {
                ...photo,
            };

            delete restoredPhoto.deletedAt;
            delete restoredPhoto.daysLeft;
            delete restoredPhoto.deletedByCategory;

            return restoredPhoto;
            },
        );

        categories = [
        ...categories,
        restoredCategory,
        ];

        bestPicks = [
        ...bestPicks,
        ...restoredPhotos,
        ];

        deletedCategories =
        deletedCategories.filter(
            (category) =>
            String(category.id) !==
            String(categoryId),
        );

        deletedBestPicks =
        deletedBestPicks.filter(
            (photo) =>
            !(
                String(photo.categoryId) ===
                String(categoryId) &&
                photo.deletedByCategory
            ),
        );

        return HttpResponse.json({
        id: restoredCategory.id,
        restoredBestPickCount:
            restoredPhotos.length,
        });
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

  //탈락사진 앨범에 추가
  http.post( 
    '/api/best-picks',
    async ({ request }) => {
        const formData =
        await request.formData();

        const requestedCategoryId =
        formData.get('categoryId');

        const targetCategory =
        categories.find(
            (category) =>
            String(category.id) ===
            String(requestedCategoryId),
        ) ?? categories[0];

        if (!targetCategory) {
        return HttpResponse.json(
            {
            code:
                'CATEGORY_NOT_FOUND',
            },
            { status: 404 },
        );
        }

        const newId =
        nextBestPickId++;

        const newBestPick = {
        id: newId,
        categoryId:
            targetCategory.id,
        categoryName:
            targetCategory.name,
        capturedDate:
            formData.get(
            'capturedDate',
            ),
        candidateCount: Number(
            formData.get(
            'candidateCount',
            ),
        ),
        createdAt:
            new Date().toISOString(),
        imageUrl:
            MOCK_IMAGES[
            newId %
                MOCK_IMAGES.length
            ],
        isLiked: false,
        };

        bestPicks = [
        ...bestPicks,
        newBestPick,
        ];

        return HttpResponse.json(
        newBestPick,
        { status: 201 },
        );
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

  // 삭제한 베스트픽 조회
    http.get(
    '/api/best-picks/trash',
    () => {
        return HttpResponse.json(
        deletedBestPicks,
        );
    },
    ),

    // 삭제한 베스트픽 복구
    http.post(
    '/api/best-picks/trash/restore',
    async ({ request }) => {
        const { ids } =
        await request.json();

        const restoredPhotos =
        deletedBestPicks.filter(
            (photo) =>
            ids.some(
                (id) =>
                String(id) ===
                String(photo.id),
            ),
        );

        bestPicks = [
        ...bestPicks,
        ...restoredPhotos.map(
            (photo) => {
                const restoredPhoto = {
                ...photo,
                };

                delete restoredPhoto.deletedAt;
                delete restoredPhoto.daysLeft;

                return restoredPhoto;
            },
        ),
        ];

        deletedBestPicks =
        deletedBestPicks.filter(
            (photo) =>
            !ids.some(
                (id) =>
                String(id) ===
                String(photo.id),
            ),
        );

        return HttpResponse.json({
        restored: restoredPhotos.map(
            (photo) => ({
            id: photo.id,
            categoryId:
                photo.categoryId,
            categoryName:
                photo.categoryName,
            }),
        ),
        skipped: [],
        });
    },
    ),

    // 영구삭제
    http.post(
    '/api/best-picks/trash/permanent',
    async ({ request }) => {
        const { ids } =
        await request.json();

        deletedBestPicks =
        deletedBestPicks.filter(
            (photo) =>
            !ids.some(
                (id) =>
                String(id) ===
                String(photo.id),
            ),
        );

        return HttpResponse.json({
        purged: ids,
        });
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

        const photosToDelete =
        bestPicks.filter(
            (photo) =>
            ids.some(
                (id) =>
                String(id) ===
                String(photo.id),
            ),
        );

        deletedBestPicks = [
        ...deletedBestPicks,
        ...photosToDelete.map(
            (photo) => ({
            ...photo,
            deletedAt:
                new Date().toISOString(),
            daysLeft: 30,
            }),
        ),
        ];

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
