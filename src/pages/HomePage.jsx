import HomeBestPicks from '../components/home/HomeBestPicks';
import HomeCalendar from '../components/home/HomeCalendar';
import AppHeader from '../components/layout/AppHeader';
import BottomNav from '../components/layout/BottomNav';
import useHomeCalendar from '../hooks/home/useHomeCalendar';

const HomePage = () => {
  const {
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
  } = useHomeCalendar();

  return (
    <main className="flex min-h-dvh flex-col">
      <div className="flex-1 px-4 pt-2">
        <AppHeader />

        <HomeCalendar
          currentMonth={currentMonth}
          calendarPhotoByDate={
            calendarPhotoByDate
          }
          selectedDate={selectedDate}
          recordedDayCount={recordedDayCount}
          isLoading={isLoading}
          calendarError={calendarError}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
          onDateSelect={handleDateSelect}
        />

        <HomeBestPicks
          selectedDate={selectedDate}
          bestPicks={selectedBestPicks}
        />
      </div>

      <BottomNav activeTab="home" />
    </main>
  );
};

export default HomePage;