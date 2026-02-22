import { useStore } from '../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { formatTime, formatDuration } from '../utils/helpers';
import { DropletIcon, PoopIcon, BreastFeedIcon, DiaperIcon, MoonIcon, ColicIcon } from './Icons';

interface TimelineEntry {
  id: string;
  timestamp: string;
  type: 'pee' | 'poop' | 'feeding' | 'diaper' | 'sleep' | 'colic';
  label: string;
  detail?: string;
  onRemove: () => void;
}

export function ActivityTimeline() {
  const { getDay, selectedDate, removePee, removePoop, removeFeeding, removeDiaperChange, removeSleep, removeColic, logs } = useStore(useShallow((s) => ({ getDay: s.getDay, selectedDate: s.selectedDate, removePee: s.removePee, removePoop: s.removePoop, removeFeeding: s.removeFeeding, removeDiaperChange: s.removeDiaperChange, removeSleep: s.removeSleep, removeColic: s.removeColic, logs: s.logs })));
  void logs; // subscribed so ActivityTimeline re-renders when log data changes
  const day = getDay(selectedDate);

  const entries: TimelineEntry[] = [
    ...day.pee.map((e) => ({
      id: e.id, timestamp: e.timestamp, type: 'pee' as const, label: 'Pee',
      onRemove: () => removePee(e.id),
    })),
    ...day.poop.map((e) => ({
      id: e.id, timestamp: e.timestamp, type: 'poop' as const, label: 'Poop',
      detail: e.color ? `${e.color}` : undefined,
      onRemove: () => removePoop(e.id),
    })),
    ...day.feedings.map((e) => ({
      id: e.id, timestamp: e.timestamp, type: 'feeding' as const, label: 'Feeding',
      detail: `${e.side} side, ${e.durationMinutes}min`,
      onRemove: () => removeFeeding(e.id),
    })),
    ...day.diaperChanges.map((e) => ({
      id: e.id, timestamp: e.timestamp, type: 'diaper' as const, label: 'Diaper',
      detail: e.type, onRemove: () => removeDiaperChange(e.id),
    })),
    ...day.sleeps.map((e) => ({
      id: e.id, timestamp: e.startTime, type: 'sleep' as const, label: 'Sleep',
      detail: e.endTime ? formatDuration(e.durationMinutes || 0) : 'sleeping...',
      onRemove: () => removeSleep(e.id),
    })),
    ...(day.colic || []).map((e) => ({
      id: e.id, timestamp: e.timestamp, type: 'colic' as const, label: 'Colic',
      detail: `level ${e.level}/5`,
      onRemove: () => removeColic(e.id),
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (entries.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <p className="text-warm-gray text-sm font-medium">No activities logged yet today</p>
        <p className="text-warm-gray/60 text-xs mt-1">Tap the buttons above to start tracking</p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-4">
      <h3 className="text-sm font-bold text-warm-brown mb-3">Today's Timeline</h3>
      <div className="space-y-2">
        {entries.map((entry) => (
          <TimelineItem key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}

function TimelineItem({ entry }: { entry: TimelineEntry }) {
  const iconMap = {
    pee: <DropletIcon size={24} />, poop: <PoopIcon size={24} />,
    feeding: <BreastFeedIcon size={24} />, diaper: <DiaperIcon size={24} />,
    sleep: <MoonIcon size={24} />, colic: <ColicIcon size={24} />,
  };
  const bgMap = {
    pee: 'bg-sky/20', poop: 'bg-peach/30', feeding: 'bg-lavender/20',
    diaper: 'bg-sky/15', sleep: 'bg-sunshine/30', colic: 'bg-blush/20',
  };

  return (
    <div className={`${bgMap[entry.type]} rounded-xl px-3 py-2.5 flex items-center gap-3 group`}>
      <div className="shrink-0">{iconMap[entry.type]}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-warm-brown">{entry.label}</span>
          {entry.detail && <span className="text-xs text-warm-gray capitalize">{entry.detail}</span>}
        </div>
        <span className="text-xs text-warm-gray">{formatTime(entry.timestamp)}</span>
      </div>
      <button
        onClick={entry.onRemove}
        className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-full bg-white/60 flex items-center justify-center text-warm-gray hover:text-rose-dark hover:bg-white"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M4 4L10 10M10 4L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}
