import { useStore } from './store/useStore';
import { Layout } from './components/Layout';
import { DailyTracker } from './components/DailyTracker';
import { ChecklistPage } from './components/ChecklistPage';
import { InsightsPage } from './components/InsightsPage';
import { AppointmentsPage } from './components/AppointmentsPage';
import { ProfilePage } from './components/ProfilePage';

function App() {
  const activePage = useStore((s) => s.activePage);

  return (
    <Layout>
      {activePage === 'profile' && <ProfilePage />}
      {activePage === 'tracker' && <DailyTracker />}
      {activePage === 'checklist' && <ChecklistPage />}
      {activePage === 'insights' && <InsightsPage />}
      {activePage === 'appointments' && <AppointmentsPage />}
    </Layout>
  );
}

export default App;
