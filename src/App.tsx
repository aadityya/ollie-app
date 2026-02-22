import { useStore } from './store/useStore';
import { Layout } from './components/Layout';
import { DailyTracker } from './components/DailyTracker';
import { InsightsPage } from './components/InsightsPage';
import { AppointmentsPage } from './components/AppointmentsPage';
import { ProfilePage } from './components/ProfilePage';

function App() {
  const activePage = useStore((s) => s.activePage);

  return (
    <Layout>
      {activePage === 'tracker' && <DailyTracker />}
      {activePage === 'insights' && <InsightsPage />}
      {activePage === 'appointments' && <AppointmentsPage />}
      {activePage === 'profile' && <ProfilePage />}
    </Layout>
  );
}

export default App;
