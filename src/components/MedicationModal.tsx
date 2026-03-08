import { useState } from 'react';
import { useStore } from '../store/useStore';

interface MedicationModalProps {
  open: boolean;
  onClose: () => void;
}

export function MedicationModal({ open, onClose }: MedicationModalProps) {
  const addMedication = useStore((s) => s.addMedication);
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [useManualTime, setUseManualTime] = useState(false);
  const [manualTime, setManualTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });

  if (!open) return null;

  const handleSave = () => {
    if (!name.trim()) return;
    let timestamp: string | undefined;
    if (useManualTime) {
      const [h, m] = manualTime.split(':').map(Number);
      const d = new Date();
      d.setHours(h, m, 0, 0);
      timestamp = d.toISOString();
    }
    addMedication(name.trim(), note.trim() || undefined, timestamp);
    setName('');
    setNote('');
    setUseManualTime(false);
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
          <svg width={40} height={40} viewBox="0 0 64 64" fill="none">
            <rect x="18" y="8" width="28" height="48" rx="8" fill="#E8D5F5" stroke="#D9B3FF" strokeWidth="2"/>
            <rect x="18" y="28" width="28" height="28" rx="0" fill="#D9B3FF" opacity="0.4"/>
            <line x1="32" y1="18" x2="32" y2="26" stroke="#A855F7" strokeWidth="3" strokeLinecap="round"/>
            <line x1="28" y1="22" x2="36" y2="22" stroke="#A855F7" strokeWidth="3" strokeLinecap="round"/>
          </svg>
          <div>
            <h3 className="text-lg font-bold text-warm-brown">Log Medication</h3>
            <p className="text-xs text-warm-gray">Track a medication or supplement</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm font-semibold text-warm-brown mb-1 block">Medication Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vitamin D, Tylenol..."
              className="w-full bg-cream rounded-xl px-3 py-2.5 text-sm text-warm-brown placeholder:text-warm-gray/50 border-2 border-transparent focus:border-rose/40 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-warm-brown mb-1 block">Notes (optional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Dosage, reason, etc."
              className="w-full bg-cream rounded-xl px-3 py-2.5 text-sm text-warm-brown placeholder:text-warm-gray/50 border-2 border-transparent focus:border-rose/40 outline-none"
            />
          </div>

          {/* Manual time */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useManualTime}
                onChange={(e) => setUseManualTime(e.target.checked)}
                className="w-4 h-4 rounded accent-rose"
              />
              <span className="text-sm text-warm-brown font-medium">Set time manually</span>
            </label>
            {useManualTime && (
              <input
                type="time"
                value={manualTime}
                onChange={(e) => setManualTime(e.target.value)}
                className="mt-2 w-full bg-cream rounded-xl px-3 py-2.5 text-sm text-warm-brown border-2 border-transparent focus:border-rose/40 outline-none"
              />
            )}
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
            disabled={!name.trim()}
            className="flex-1 py-3 rounded-xl bg-rose text-white font-semibold text-sm hover:bg-rose-dark transition-colors shadow-md disabled:opacity-40"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
