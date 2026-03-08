import { useState } from 'react';
import { useStore } from '../store/useStore';
import { BreastFeedIcon } from './Icons';
import type { BreastSide } from '../types';

interface FeedingModalProps {
  open: boolean;
  onClose: () => void;
}

function nowTimeString(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

export function FeedingModal({ open, onClose }: FeedingModalProps) {
  const addFeeding = useStore((s) => s.addFeeding);
  const [side, setSide] = useState<BreastSide>('left');
  const [duration, setDuration] = useState(10);
  const [timeMode, setTimeMode] = useState<'now' | 'startStop'>('now');
  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - 10);
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });
  const [endTime, setEndTime] = useState(nowTimeString);

  if (!open) return null;

  const handleSave = () => {
    if (timeMode === 'startStop') {
      const [sh, sm] = startTime.split(':').map(Number);
      const [eh, em] = endTime.split(':').map(Number);
      const start = new Date();
      start.setHours(sh, sm, 0, 0);
      const end = new Date();
      end.setHours(eh, em, 0, 0);
      if (end <= start) return;
      const durationMinutes = Math.round((end.getTime() - start.getTime()) / 60000);
      addFeeding({ side, durationMinutes, timestamp: start.toISOString() } as any);
    } else {
      addFeeding({ side, durationMinutes: duration });
    }
    setDuration(10);
    setTimeMode('now');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-warm-brown/20 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl w-full max-w-md p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-blush rounded-full mx-auto mb-4" />

        <div className="flex items-center gap-3 mb-5">
          <BreastFeedIcon size={40} />
          <div>
            <h3 className="text-lg font-bold text-warm-brown">Log Feeding</h3>
            <p className="text-xs text-warm-gray">Track breastfeeding session</p>
          </div>
        </div>

        {/* Side Selection */}
        <div className="mb-5">
          <label className="text-sm font-semibold text-warm-brown mb-2 block">Which side?</label>
          <div className="flex gap-3">
            <button
              onClick={() => setSide('left')}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
                side === 'left'
                  ? 'bg-lavender border-2 border-lavender-dark text-warm-brown shadow-sm'
                  : 'bg-cream border-2 border-transparent text-warm-gray hover:border-lavender/50'
              }`}
            >
              Left
            </button>
            <button
              onClick={() => setSide('right')}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
                side === 'right'
                  ? 'bg-lavender border-2 border-lavender-dark text-warm-brown shadow-sm'
                  : 'bg-cream border-2 border-transparent text-warm-gray hover:border-lavender/50'
              }`}
            >
              Right
            </button>
          </div>
        </div>

        {/* Time mode toggle */}
        <div className="flex gap-2 mb-4 bg-cream/60 rounded-lg p-0.5">
          <button
            onClick={() => setTimeMode('now')}
            className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${
              timeMode === 'now' ? 'bg-white text-warm-brown shadow-sm' : 'text-warm-gray'
            }`}
          >
            Duration
          </button>
          <button
            onClick={() => setTimeMode('startStop')}
            className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${
              timeMode === 'startStop' ? 'bg-white text-warm-brown shadow-sm' : 'text-warm-gray'
            }`}
          >
            Start / Stop Time
          </button>
        </div>

        {timeMode === 'now' ? (
          <div className="mb-6">
            <label className="text-sm font-semibold text-warm-brown mb-2 block">
              Duration: <span className="text-rose">{duration} min</span>
            </label>
            <input
              type="range"
              min={1}
              max={60}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full h-2 bg-blush/30 rounded-full appearance-none cursor-pointer accent-rose"
            />
            <div className="flex justify-between text-xs text-warm-gray mt-1">
              <span>1 min</span>
              <span>30 min</span>
              <span>60 min</span>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <label className="text-sm font-semibold text-warm-brown mb-3 block">
              Enter start and stop times
            </label>
            <div className="flex gap-3 items-center">
              <div className="flex-1">
                <label className="text-xs text-warm-gray mb-1 block">Start</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full text-center text-lg font-bold text-warm-brown bg-cream rounded-xl py-2 border-2 border-transparent focus:border-lavender-dark outline-none"
                />
              </div>
              <span className="text-warm-gray font-bold mt-4">to</span>
              <div className="flex-1">
                <label className="text-xs text-warm-gray mb-1 block">End</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full text-center text-lg font-bold text-warm-brown bg-cream rounded-xl py-2 border-2 border-transparent focus:border-lavender-dark outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border-2 border-blush/40 text-warm-gray font-semibold text-sm hover:bg-cream transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl bg-rose text-white font-semibold text-sm hover:bg-rose-dark transition-colors shadow-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
