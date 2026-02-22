import { useState } from 'react';
import { useStore } from '../store/useStore';
import { ColicIcon } from './Icons';

interface ColicModalProps {
  open: boolean;
  onClose: () => void;
}

const levelLabels = ['', 'Calm', 'Fussy', 'Cranky', 'Very Cranky', 'Extreme'];
const levelEmojis = ['', '😊', '😕', '😣', '😭', '🔴'];

export function ColicModal({ open, onClose }: ColicModalProps) {
  const addColic = useStore((s) => s.addColic);
  const [level, setLevel] = useState<1 | 2 | 3 | 4 | 5>(3);

  if (!open) return null;

  const handleSave = () => {
    addColic(level);
    setLevel(3);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-warm-brown/20 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-t-3xl w-full max-w-lg p-6 pb-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-blush rounded-full mx-auto mb-4" />

        <div className="flex items-center gap-3 mb-5">
          <ColicIcon size={40} />
          <div>
            <h3 className="text-lg font-bold text-warm-brown">Colic / Crankiness</h3>
            <p className="text-xs text-warm-gray">How fussy is baby right now?</p>
          </div>
        </div>

        {/* Level selector */}
        <div className="mb-5">
          <div className="flex justify-between items-end mb-3">
            <span className="text-sm font-semibold text-warm-brown">Level: {level}/5</span>
            <span className="text-sm text-warm-gray">{levelLabels[level]} {levelEmojis[level]}</span>
          </div>

          <div className="flex gap-2">
            {([1, 2, 3, 4, 5] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all ${
                  level === l
                    ? l <= 2
                      ? 'bg-mint border-2 border-mint-dark text-warm-brown shadow-sm'
                      : l === 3
                      ? 'bg-sunshine border-2 border-sunshine-dark text-warm-brown shadow-sm'
                      : 'bg-blush border-2 border-blush-dark text-warm-brown shadow-sm'
                    : 'bg-cream border-2 border-transparent text-warm-gray'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="flex justify-between text-[10px] text-warm-gray mt-1.5 px-1">
            <span>Calm</span>
            <span>Moderate</span>
            <span>Extreme</span>
          </div>
        </div>

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
