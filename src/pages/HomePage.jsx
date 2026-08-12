import HomeBestPicks from '../components/home/HomeBestPicks';
import HomeCalendar from '../components/home/HomeCalendar';
import AppHeader from '../components/layout/AppHeader';
import BottomNav from '../components/layout/BottomNav';

const HomePage = () => {
  return (
    <main className="flex min-h-dvh flex-col">
      <div className="flex-1 px-4 pt-4">
        <AppHeader />

        <HomeCalendar />

        <HomeBestPicks />
      </div>

      <BottomNav activeTab="home" />
    </main>
  );
};

export default HomePage;
