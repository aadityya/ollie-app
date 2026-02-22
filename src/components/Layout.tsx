import { useStore } from '../store/useStore';
import { BabyFaceIcon, ChartIcon, CalendarIcon, ProfileIcon, BoyIcon, GirlIcon, StarIcon } from './Icons';
import { formatBabyAge } from '../utils/helpers';

export function Layout({ children }: { children: React.ReactNode }) {
  const { activePage, setActivePage, getActiveBaby } = useStore();
  const baby = getActiveBaby();

  return (
    <div className="h-screen bg-cream flex flex-col max-w-lg mx-auto relative">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blush/30 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {baby ? (
              baby.gender === 'boy' ? <BoyIcon size={36} /> : <GirlIcon size={36} />
            ) : (
              <BabyFaceIcon size={36} />
            )}
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
                    Add a baby to get started
                    <StarIcon size={10} className="inline-block ml-1 -mt-0.5" />
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white/90 backdrop-blur-sm border-t border-blush/20 z-10">
        <div className="flex">
          <NavButton
            active={activePage === 'tracker'}
            onClick={() => setActivePage('tracker')}
            label="Tracker"
            icon={<BabyFaceIcon size={20} />}
          />
          <NavButton
            active={activePage === 'insights'}
            onClick={() => setActivePage('insights')}
            label="Insights"
            icon={<ChartIcon size={20} />}
          />
          <NavButton
            active={activePage === 'appointments'}
            onClick={() => setActivePage('appointments')}
            label="Appts"
            icon={<CalendarIcon size={20} />}
          />
          <NavButton
            active={activePage === 'profile'}
            onClick={() => setActivePage('profile')}
            label="Profile"
            icon={<ProfileIcon size={20} />}
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
      className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-all duration-200 ${
        active
          ? 'text-rose-dark bg-blush/20'
          : 'text-warm-gray hover:text-warm-brown hover:bg-cream-dark/50'
      }`}
    >
      {icon}
      <span className={`text-[10px] font-semibold ${active ? 'text-rose-dark' : ''}`}>{label}</span>
      {active && <div className="w-6 h-0.5 bg-rose rounded-full mt-0.5" />}
    </button>
  );
}
