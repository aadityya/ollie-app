import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { DateSelector } from './DateSelector';
import { QuickLogButton } from './QuickLogButton';
import { FeedingModal } from './FeedingModal';
import { SleepModal } from './SleepModal';
import { DiaperModal } from './DiaperModal';
import { ColicModal } from './ColicModal';
import { MedicationModal } from './MedicationModal';
import { ActivityTimeline } from './ActivityTimeline';
import { NotesSection } from './NotesSection';
import { DropletIcon, PoopIcon, BreastFeedIcon, DiaperIcon, MoonIcon, ColicIcon } from './Icons';

export function DailyTracker() {
  const { addPee, addPoop, getDay, selectedDate, getActiveBaby, logs } = useStore(useShallow((s) => ({ addPee: s.addPee, addPoop: s.addPoop, getDay: s.getDay, selectedDate: s.selectedDate, getActiveBaby: s.getActiveBaby, logs: s.logs })));
  void logs; // subscribed so DailyTracker re-renders when log data changes
  const baby = getActiveBaby();
  const day = getDay(selectedDate);

  const [feedingOpen, setFeedingOpen] = useState(false);
  const [sleepOpen, setSleepOpen] = useState(false);
  const [diaperOpen, setDiaperOpen] = useState(false);
  const [colicOpen, setColicOpen] = useState(false);
  const [medicationOpen, setMedicationOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const activeSleep = day.sleeps.find((s) => !s.endTime);

  if (!baby) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <p className="text-warm-brown font-bold text-base mb-2">Welcome to Ollie!</p>
        <p className="text-warm-gray text-sm">
          Head to the <strong>Profile</strong> tab to add your baby and start tracking.
        </p>
      </div>
    );
  }

  const totalEntries = day.pee.length + day.poop.length + day.feedings.length
    + day.diaperChanges.length + day.sleeps.length + (day.colic || []).length
    + (day.medications || []).length + (day.customActivities || []).length;

  return (
    <div>
      <DateSelector />

      {/* Quick Log */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-blush/10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-warm-brown">Quick Log</h2>
            <span className="text-xs text-warm-gray bg-cream px-2.5 py-0.5 rounded-full font-medium">
              {totalEntries} entries
            </span>
          </div>

          <div className="grid grid-cols-6 gap-1.5">
            <QuickLogButton
              icon={<DropletIcon size={24} />}
              label="Pee"
              count={day.pee.length}
              bgColor="bg-sky/20"
              borderColor="border-sky/30"
              onClick={() => addPee()}
            />
            <QuickLogButton
              icon={<PoopIcon size={24} />}
              label="Poop"
              count={day.poop.length}
              bgColor="bg-peach/30"
              borderColor="border-peach/40"
              onClick={() => addPoop({})}
            />
            <QuickLogButton
              icon={<BreastFeedIcon size={24} />}
              label="Feed"
              count={day.feedings.length}
              bgColor="bg-lavender/20"
              borderColor="border-lavender/30"
              onClick={() => setFeedingOpen(true)}
            />
            <QuickLogButton
              icon={<DiaperIcon size={24} />}
              label="Diaper"
              count={day.diaperChanges.length}
              bgColor="bg-sky/15"
              borderColor="border-sky/25"
              onClick={() => setDiaperOpen(true)}
            />
            <QuickLogButton
              icon={<MoonIcon size={24} />}
              label={activeSleep ? 'Zzz...' : 'Sleep'}
              count={day.sleeps.length}
              bgColor={activeSleep ? 'bg-sunshine/40' : 'bg-sunshine/20'}
              borderColor={activeSleep ? 'border-sunshine-dark/50' : 'border-sunshine/30'}
              onClick={() => setSleepOpen(true)}
            />
            <QuickLogButton
              icon={<ColicIcon size={24} />}
              label="Colic"
              count={(day.colic || []).length}
              bgColor="bg-blush/20"
              borderColor="border-blush/30"
              onClick={() => setColicOpen(true)}
            />
          </div>

          {/* More section */}
          <div className="mt-3">
            <button
              onClick={() => setShowMore(!showMore)}
              className="flex items-center gap-1.5 text-xs font-semibold text-warm-gray hover:text-warm-brown transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transition-transform ${showMore ? 'rotate-180' : ''}`}>
                <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              More
              {(day.medications || []).length > 0 && (
                <span className="text-[10px] text-warm-gray bg-cream px-1.5 py-0.5 rounded-full">
                  {(day.medications || []).length}
                </span>
              )}
            </button>
            {showMore && (
              <div className="grid grid-cols-3 gap-1.5 mt-2">
                <QuickLogButton
                  icon={<MedicationIcon size={24} />}
                  label="Meds"
                  count={(day.medications || []).length}
                  bgColor="bg-lavender/15"
                  borderColor="border-lavender/25"
                  onClick={() => setMedicationOpen(true)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-4 mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <SummaryCard
            label="Feedings"
            value={`${day.feedings.length}`}
            detail={
              day.feedings.length > 0
                ? `${day.feedings.reduce((a, f) => a + f.durationMinutes, 0)} min total`
                : 'No feedings yet'
            }
            bgColor="bg-lavender/15"
            accentColor="text-lavender-dark"
          />
          <SummaryCard
            label="Sleep"
            value={
              day.sleeps.reduce((a, s) => a + (s.durationMinutes || 0), 0) > 0
                ? `${Math.floor(day.sleeps.reduce((a, s) => a + (s.durationMinutes || 0), 0) / 60)}h ${day.sleeps.reduce((a, s) => a + (s.durationMinutes || 0), 0) % 60}m`
                : '0m'
            }
            detail={
              activeSleep
                ? 'Currently sleeping'
                : `${day.sleeps.length} nap${day.sleeps.length !== 1 ? 's' : ''}`
            }
            bgColor="bg-sunshine/15"
            accentColor="text-sunshine-dark"
          />
          <SummaryCard
            label="Wet Diapers"
            value={`${day.pee.length + day.diaperChanges.filter((d) => d.type === 'wet' || d.type === 'both').length}`}
            detail="pee entries"
            bgColor="bg-sky/15"
            accentColor="text-sky-dark"
          />
          <SummaryCard
            label="Colic Level"
            value={
              (day.colic || []).length > 0
                ? `${(Math.round(((day.colic || []).reduce((a, c) => a + c.level, 0) / (day.colic || []).length) * 10) / 10)}/5`
                : '—'
            }
            detail={
              (day.colic || []).length > 0
                ? `${(day.colic || []).length} reading${(day.colic || []).length !== 1 ? 's' : ''}`
                : 'No readings today'
            }
            bgColor="bg-blush/15"
            accentColor="text-rose"
          />
        </div>
      </div>

      {/* Notes */}
      <NotesSection />

      {/* Activity Timeline */}
      <ActivityTimeline />

      {/* Modals */}
      <FeedingModal open={feedingOpen} onClose={() => setFeedingOpen(false)} />
      <SleepModal open={sleepOpen} onClose={() => setSleepOpen(false)} />
      <DiaperModal open={diaperOpen} onClose={() => setDiaperOpen(false)} />
      <ColicModal open={colicOpen} onClose={() => setColicOpen(false)} />
      <MedicationModal open={medicationOpen} onClose={() => setMedicationOpen(false)} />
    </div>
  );
}

function MedicationIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect x="18" y="8" width="28" height="48" rx="8" fill="#E8D5F5" stroke="#D9B3FF" strokeWidth="2"/>
      <rect x="18" y="28" width="28" height="28" rx="0" fill="#D9B3FF" opacity="0.4"/>
      <line x1="32" y1="18" x2="32" y2="26" stroke="#A855F7" strokeWidth="3" strokeLinecap="round"/>
      <line x1="28" y1="22" x2="36" y2="22" stroke="#A855F7" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

function SummaryCard({
  label,
  value,
  detail,
  bgColor,
  accentColor,
}: {
  label: string;
  value: string;
  detail: string;
  bgColor: string;
  accentColor: string;
}) {
  return (
    <div className={`${bgColor} rounded-xl p-3`}>
      <p className="text-xs text-warm-gray font-medium mb-0.5">{label}</p>
      <p className={`text-xl font-bold ${accentColor}`}>{value}</p>
      <p className="text-xs text-warm-gray">{detail}</p>
    </div>
  );
}
