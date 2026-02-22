import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { BabyFaceIcon, ChartIcon, CalendarIcon, ProfileIcon, StarIcon, ChecklistIcon, OllieBadge } from './Icons';
import { formatBabyAge, getDailyTip } from '../utils/helpers';

export function Layout({ children }: { children: React.ReactNode }) {
  const { activePage, setActivePage, getActiveBaby } = useStore(useShallow((s) => ({ activePage: s.activePage, setActivePage: s.setActivePage, getActiveBaby: s.getActiveBaby })));
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
    <div className="h-screen bg-cream flex flex-col max-w-lg mx-auto relative">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blush/30 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <OllieBadge size={40} />
            <div>
              <h1 className="text-lg font-bold text-warm-brown leading-tight">
                {baby ? `${baby.name}'s Day` : 'Ollie'}
              </h1>
              <p className="text-xs text-warm-gray font-medium">
                {baby ? (
                  <>
                    {formatBabyAge(baby.dateOfBirth)}
                    <StarIcon size={10} className="inline-block ml-1 -mt-0.5" />
                  </>
                ) : (
                  <>
                    Baby Wellness Tracker
                    <StarIcon size={10} className="inline-block ml-1 -mt-0.5" />
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Tip of the Day */}
      {tip && (
        <div className="bg-sunshine/30 border-b border-sunshine/40 px-4 py-2">
          <p className="text-xs text-warm-brown font-medium text-center leading-relaxed">{tip}</p>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* Bottom Navigation — Order: Profile, Tracker, Checklist, Insights, Appts */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white/90 backdrop-blur-sm border-t border-blush/20 z-10">
        <div className="flex">
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
      className={`flex-1 flex flex-col items-center gap-0.5 py-2 transition-all duration-200 ${
        active
          ? 'text-rose-dark bg-blush/20'
          : 'text-warm-gray hover:text-warm-brown hover:bg-cream-dark/50'
      }`}
    >
      {icon}
      <span className={`text-[9px] font-semibold ${active ? 'text-rose-dark' : ''}`}>{label}</span>
      {active && <div className="w-5 h-0.5 bg-rose rounded-full mt-0.5" />}
    </button>
  );
}
