export const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const getCalendarDays = (
  year,
  monthIndex,
) => { //달력 칸 배열을 만드는 함수
  const firstDay = new Date(
    year,
    monthIndex,
    1,
  ).getDay(); //일요일 0, 토요일 6

  const lastDate = new Date(
    year,
    monthIndex + 1,
    0,
  ).getDate(); //다음 달 1일의 하루 전날

  const calendarDays = [
    ...Array(firstDay).fill(null), //첫째 날 이전 빈칸
    ...Array.from(
      { length: lastDate },
      (_, index) => index + 1,
    ),
  ];

  return [
    ...calendarDays,
    ...Array(
      42 - calendarDays.length,
    ).fill(null), //항상 6주, 42칸 유지
  ];
};

export const formatCapturedDate = (capturedDate) => {
  if (!capturedDate) return '';

  const [year, month, day] =
    capturedDate.split('-');

  return `${year}년 ${month}월 ${day}일`;
};
