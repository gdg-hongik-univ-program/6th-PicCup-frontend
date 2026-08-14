import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { getCalendarBestPicks } from '../../api/bestPickApi';
import {
  getCalendarPhotoByDate,
  getLatestCapturedDate,
  getYearMonth,
} from '../../utils/homeCalendar';
import { getLocalDateString } from '../../utils/date';

const useHomeCalendar = () => {
  const [todayDate] = useState(() =>
    getLocalDateString(),
  );
  const [currentMonth, setCurrentMonth] =
    useState(() => {
      const today = new Date();

      return new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
      );
    });

  const [calendarResponse, setCalendarResponse] =
    useState({
      yearMonth: '',
      bestPicks: [],
      error: '',
    });

  const [selectedDateState, setSelectedDateState] =
    useState(() => ({
        yearMonth: todayDate.slice(0, 7),
        date: todayDate,
    }));

  const yearMonth = useMemo(
    () => getYearMonth(currentMonth),
    [currentMonth],
  );

  useEffect(() => {
    let isCancelled = false;

    getCalendarBestPicks(yearMonth)
      .then((bestPicks) => {
        if (isCancelled) return;

        setCalendarResponse({
          yearMonth,
          bestPicks,
          error: '',
        });
      })
      .catch((error) => {
        if (isCancelled) return;

        console.error(
          '캘린더 베스트픽 조회 실패:',
          error,
        );

        setCalendarResponse({
          yearMonth,
          bestPicks: [],
          error:
            error.response?.data?.message ??
            '캘린더 사진을 불러오지 못했습니다.',
        });
      });

    return () => {
      isCancelled = true;
    };
  }, [yearMonth]);

  const calendarBestPicks = useMemo(() => {
    return calendarResponse.yearMonth === yearMonth
      ? calendarResponse.bestPicks
      : [];
  }, [
    yearMonth,
    calendarResponse.yearMonth,
    calendarResponse.bestPicks,
  ]);

  const calendarPhotoByDate = useMemo(
    () =>
      getCalendarPhotoByDate(
        calendarBestPicks,
      ),
    [calendarBestPicks],
  );

  const latestCapturedDate = useMemo(
    () =>
      getLatestCapturedDate(
        calendarBestPicks,
      ),
    [calendarBestPicks],
  );

  const currentYearMonth = //오늘이 속한 연-월
    todayDate.slice(0, 7);

  const defaultSelectedDate = //최근 기록 날짜 (다른 월에서)
    yearMonth === currentYearMonth
        ? todayDate
        : latestCapturedDate;

  const selectedDate =
    selectedDateState.yearMonth === yearMonth
        ? selectedDateState.date
        : defaultSelectedDate;

  const selectedBestPicks = useMemo(
    () =>
      calendarBestPicks.filter(
        (photo) =>
          photo.capturedDate === selectedDate,
      ),
    [calendarBestPicks, selectedDate],
  );

  const recordedDayCount = Object.keys(
    calendarPhotoByDate,
  ).length; //이번달에 몇일 찍었는지

  const isLoading =
    calendarResponse.yearMonth !== yearMonth;

  const calendarError =
    calendarResponse.yearMonth === yearMonth
      ? calendarResponse.error
      : '';

  const handlePreviousMonth = () => {
    setCurrentMonth((previousMonth) =>
      new Date(
        previousMonth.getFullYear(),
        previousMonth.getMonth() - 1,
        1,
      ),
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth((previousMonth) =>
      new Date(
        previousMonth.getFullYear(),
        previousMonth.getMonth() + 1,
        1,
      ),
    );
  };

  const handleDateSelect = (date) => {
    if (!calendarPhotoByDate[date]) return;

    setSelectedDateState({
      yearMonth,
      date,
    });
  };

  return {
    currentMonth,
    calendarPhotoByDate,
    selectedDate,
    selectedBestPicks,
    recordedDayCount,
    isLoading,
    calendarError,
    handlePreviousMonth,
    handleNextMonth,
    handleDateSelect,
  };
};

export default useHomeCalendar;
