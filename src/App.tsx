import { useStore } from './store/useStore';
import { Layout } from './components/Layout';
import { DailyTracker } from './components/DailyTracker';
import { InsightsPage } from './components/InsightsPage';

function App() {
  const activePage = useStore((s) => s.activePage);

  return (
    <Layout>
      {activePage === 'tracker' && <DailyTracker />}
      {activePage === 'insights' && <InsightsPage />}
    </Layout>
  );
}

export default App;
