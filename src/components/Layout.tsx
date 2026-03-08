import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { BabyFaceIcon, ChartIcon, CalendarIcon, ProfileIcon, StarIcon, ChecklistIcon, OllieBadge } from './Icons';
import { formatBabyAge, getDailyTip } from '../utils/helpers';

export function Layout({ children }: { children: React.ReactNode }) {
  const { activePage, setActivePage, getActiveBaby, profiles, activeBabyId, setActiveBaby } = useStore(useShallow((s) => ({ activePage: s.activePage, setActivePage: s.setActivePage, getActiveBaby: s.getActiveBaby, profiles: s.profiles, activeBabyId: s.activeBabyId, setActiveBaby: s.setActiveBaby })));
  const baby = getActiveBaby();
  const theme = baby?.theme || 'mono';
  const [showBabySwitcher, setShowBabySwitcher] = useState(false);

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

  const handleSwitchBaby = (id: string) => {
    setActiveBaby(id);
    setShowBabySwitcher(false);
  };

  return (
    <div className="h-screen bg-cream flex flex-col sm:flex-row max-w-[880px] mx-auto relative">
      {/* Left Sidebar Navigation (desktop) / Bottom Nav (mobile) */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full bg-white/90 backdrop-blur-sm border-t border-blush/20 z-10 sm:static sm:translate-x-0 sm:w-20 sm:min-w-20 sm:h-screen sm:border-t-0 sm:border-r sm:border-blush/20 sm:bg-white sm:flex sm:flex-col sm:items-center sm:pt-4 sm:order-first sm:shrink-0">
        <div className="flex sm:flex-col sm:gap-1 sm:w-full">
          <NavButton
            active={activePage === 'profile'}
            onClick={() => setActivePage('profile')}
            label="Settings"
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
                {baby ? `How's ${baby.name}'s day?` : 'Ollie'}
              </h1>
              {baby && (
                <span className="text-xs text-warm-gray font-medium flex items-center gap-1">
                  {formatBabyAge(baby.dateOfBirth)}
                  <StarIcon size={9} className="-mt-0.5" />
                </span>
              )}
            </div>
            {/* Baby Switcher */}
            {profiles.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowBabySwitcher(!showBabySwitcher)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cream border border-blush/20 hover:border-blush/40 transition-colors"
                >
                  <span className="text-xs font-semibold text-warm-brown truncate max-w-[80px]">
                    {baby?.name || 'Select'}
                  </span>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`transition-transform ${showBabySwitcher ? 'rotate-180' : ''}`}>
                    <path d="M2 4L5 7L8 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {showBabySwitcher && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setShowBabySwitcher(false)} />
                    <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-blush/20 py-1 min-w-[160px] z-30">
                      {profiles.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => handleSwitchBaby(p.id)}
                          className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-cream transition-colors ${
                            p.id === activeBabyId ? 'text-rose-dark font-bold' : 'text-warm-brown'
                          }`}
                        >
                          <span className="text-xs">{p.gender === 'boy' ? '👦' : '👧'}</span>
                          <span className="truncate">{p.name}</span>
                          {p.id === activeBabyId && (
                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="ml-auto shrink-0">
                              <path d="M4 8L7 11L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
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
