import { useState } from 'react';
import { useStore } from '../store/useStore';
import { BreastFeedIcon } from './Icons';
import type { BreastSide } from '../types';

interface FeedingModalProps {
  open: boolean;
  onClose: () => void;
}

export function FeedingModal({ open, onClose }: FeedingModalProps) {
  const addFeeding = useStore((s) => s.addFeeding);
  const [side, setSide] = useState<BreastSide>('left');
  const [duration, setDuration] = useState(10);

  if (!open) return null;

  const handleSave = () => {
    addFeeding({ side, durationMinutes: duration });
    setDuration(10);
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

        {/* Duration */}
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
