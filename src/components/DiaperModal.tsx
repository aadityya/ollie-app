import { useState } from 'react';
import { useStore } from '../store/useStore';
import { DiaperIcon } from './Icons';

interface DiaperModalProps {
  open: boolean;
  onClose: () => void;
}

export function DiaperModal({ open, onClose }: DiaperModalProps) {
  const addDiaperChange = useStore((s) => s.addDiaperChange);
  const [type, setType] = useState<'wet' | 'soiled' | 'both' | 'dry'>('wet');

  if (!open) return null;

  const handleSave = () => {
    addDiaperChange({ type });
    setType('wet');
    onClose();
  };

  const types = [
    { value: 'wet' as const, label: 'Wet', emoji: '💧' },
    { value: 'soiled' as const, label: 'Soiled', emoji: '💩' },
    { value: 'both' as const, label: 'Both', emoji: '💧💩' },
    { value: 'dry' as const, label: 'Dry', emoji: '✨' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-warm-brown/20 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-t-3xl w-full max-w-lg p-6 pb-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-blush rounded-full mx-auto mb-4" />

        <div className="flex items-center gap-3 mb-5">
          <DiaperIcon size={40} />
          <div>
            <h3 className="text-lg font-bold text-warm-brown">Diaper Change</h3>
            <p className="text-xs text-warm-gray">What kind of diaper was it?</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {types.map((t) => (
            <button
              key={t.value}
              onClick={() => setType(t.value)}
              className={`py-4 rounded-xl font-semibold text-sm transition-all flex flex-col items-center gap-1 ${
                type === t.value
                  ? 'bg-sky border-2 border-sky-dark text-warm-brown shadow-sm'
                  : 'bg-cream border-2 border-transparent text-warm-gray hover:border-sky/50'
              }`}
            >
              <span className="text-xl">{t.emoji}</span>
              <span>{t.label}</span>
            </button>
          ))}
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
