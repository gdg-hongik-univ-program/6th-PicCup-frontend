export const trackEvent = (
  eventName,
  parameters = {},
) => {
  // 로컬에서는 GA에 보내지 않고 콘솔로만 확인
  if (!import.meta.env.PROD) {
    console.log(
      `[GA4] ${eventName}`,
      parameters,
    );
    return;
  }

  // 배포 환경에서 GA4 이벤트 전송
  window.gtag?.(
    'event',
    eventName,
    parameters,
  );
};