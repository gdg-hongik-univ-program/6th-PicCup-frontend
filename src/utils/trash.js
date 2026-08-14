const DAY_IN_MS = 24 * 60 * 60 * 1000; //하루를 밀리초로 바꾼 값

export const calculateDaysLeft = ( //사진이 자동 삭제되기까지 며칠 남았는지 계산
  deletedAt,
  retentionDays,
) => {
  if (!deletedAt) return retentionDays;

  const expiresAt =
    new Date(deletedAt).getTime() +
    retentionDays * DAY_IN_MS;

  return Math.max(
    0, //0일부터 시작
    Math.ceil( //올림
      (expiresAt - Date.now()) / DAY_IN_MS,
    ),
  );
};

export const calculateDaysUntil = (expiresAt) => {
  return Math.max(
    0,
    Math.ceil(
      (
        new Date(expiresAt).getTime() -
        Date.now()
      ) / DAY_IN_MS,
    ),
  );
};

export const getTrashPhotoKey = (
  photo,
  activeTab,
) => {
  if (activeTab === 'rejected') {
    return `rejected-${photo.id}`;
  }

  return `server-${photo.id}`;
};
