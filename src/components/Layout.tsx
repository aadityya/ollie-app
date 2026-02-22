import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { BabyFaceIcon, ChartIcon, CalendarIcon, ProfileIcon, StarIcon, ChecklistIcon, OllieBadge } from './Icons';
import { formatBabyAge, getDailyTip } from '../utils/helpers';
import { APP_VERSION } from '../version';

export function Layout({ children }: { children: React.ReactNode }) {
  const { activePage, setActivePage, getActiveBaby, profiles, activeBabyId } = useStore(useShallow((s) => ({ activePage: s.activePage, setActivePage: s.setActivePage, getActiveBaby: s.getActiveBaby, profiles: s.profiles, activeBabyId: s.activeBabyId })));
  void profiles; void activeBabyId; // subscribed so Layout re-renders on profile/theme changes
  const baby = getActiveBaby();
  const theme = baby?.theme || 'default';

  // Apply theme to document root so CSS overrides cascade everywhere
  useEffect(() => {
    if (theme === 'default') {
      delete document.documentElement.dataset.theme;
    } else {
      document.documentElement.dataset.theme = theme;
    }
    return () => { delete document.documentElement.dataset.theme; };
  }, [theme]);

  const tip = baby ? getDailyTip(baby.dateOfBirth, baby.name) : null;

  return (
    <div className="h-screen bg-cream flex flex-col sm:flex-row max-w-[880px] mx-auto relative">
      {/* Left Sidebar Navigation (desktop) / Bottom Nav (mobile) */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full bg-white/90 backdrop-blur-sm border-t border-blush/20 z-10 sm:static sm:translate-x-0 sm:w-20 sm:min-w-20 sm:h-screen sm:border-t-0 sm:border-r sm:border-blush/20 sm:bg-white sm:flex sm:flex-col sm:items-center sm:pt-4 sm:order-first sm:shrink-0">
        <div className="flex sm:flex-col sm:gap-1 sm:w-full">
          <NavButton
            active={activePage === 'profile'}
            onClick={() => setActivePage('profile')}
            label="Profile"
            icon={<ProfileIcon size={18} />}
          />
          <NavButton
            active={activePage === 'tracker'}
            onClick={() => setActivePage('tracker')}
            label="Tracker"
            icon={<BabyFaceIcon size={18} />}
          />
          <NavButton
            active={activePage === 'checklist'}
            onClick={() => setActivePage('checklist')}
            label="Check"
            icon={<ChecklistIcon size={18} />}
          />
          <NavButton
            active={activePage === 'insights'}
            onClick={() => setActivePage('insights')}
            label="Insights"
            icon={<ChartIcon size={18} />}
          />
          <NavButton
            active={activePage === 'appointments'}
            onClick={() => setActivePage('appointments')}
            label="Appts"
            icon={<CalendarIcon size={18} />}
          />
        </div>
      </nav>

      {/* Main content column */}
      <div className="flex flex-col flex-1 min-w-0 h-screen">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-blush/30 px-4 py-2 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <OllieBadge size={32} />
              <h1 className="text-base font-bold text-warm-brown leading-tight">
                {baby ? `${baby.name}'s Day` : 'Ollie'}
              </h1>
              {baby && (
                <span className="text-xs text-warm-gray font-medium flex items-center gap-1">
                  {formatBabyAge(baby.dateOfBirth)}
                  <StarIcon size={9} className="-mt-0.5" />
                </span>
              )}
            </div>
            <span className="text-[10px] text-warm-gray/50 font-mono font-medium">v{APP_VERSION}</span>
          </div>
        </header>

        {/* Tip of the Day */}
        {tip && (
          <div className="bg-sunshine/30 border-b border-sunshine/40 px-4 py-1.5">
            <p className="text-[11px] text-warm-brown font-medium text-center leading-snug">{tip}</p>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto pb-20 sm:pb-4">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavButton({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 sm:flex-none relative flex flex-col items-center gap-0.5 py-2 sm:py-2.5 sm:px-1 sm:rounded-xl sm:mx-1 transition-all duration-200 ${
        active
          ? 'text-rose-dark bg-blush/20'
          : 'text-warm-gray hover:text-warm-brown hover:bg-cream-dark/50'
      }`}
    >
      {icon}
      <span className={`text-[9px] sm:text-[10px] font-semibold ${active ? 'text-rose-dark' : ''}`}>{label}</span>
      {active && <div className="w-5 h-0.5 sm:w-1 sm:h-5 sm:absolute sm:left-0 sm:top-1/2 sm:-translate-y-1/2 bg-rose rounded-full mt-0.5 sm:mt-0" />}
    </button>
  );
}
