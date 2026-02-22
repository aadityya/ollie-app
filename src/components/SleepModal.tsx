import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { MoonIcon } from './Icons';

interface SleepModalProps {
  open: boolean;
  onClose: () => void;
}

export function SleepModal({ open, onClose }: SleepModalProps) {
  const { addSleep, endSleep, getDay, selectedDate } = useStore(useShallow((s) => ({ addSleep: s.addSleep, endSleep: s.endSleep, getDay: s.getDay, selectedDate: s.selectedDate })));
  const day = getDay(selectedDate);
  const activeSleep = day.sleeps.find((s) => !s.endTime);

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);
  const [mode, setMode] = useState<'timer' | 'manual'>('timer');

  if (!open) return null;

  const handleStartSleep = () => {
    addSleep({ startTime: new Date().toISOString() });
    onClose();
  };

  const handleEndSleep = () => {
    if (activeSleep) {
      endSleep(activeSleep.id);
    }
    onClose();
  };

  const handleManualSleep = () => {
    const totalMinutes = hours * 60 + minutes;
    if (totalMinutes > 0) {
      const endTime = new Date();
      const startTime = new Date(endTime.getTime() - totalMinutes * 60000);
      addSleep({
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        durationMinutes: totalMinutes,
      });
    }
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
          <MoonIcon size={40} />
          <div>
            <h3 className="text-lg font-bold text-warm-brown">Log Sleep</h3>
            <p className="text-xs text-warm-gray">
              {activeSleep ? 'Baby is currently sleeping' : 'Track a sleep session'}
            </p>
          </div>
        </div>

        {activeSleep ? (
          <div className="text-center mb-6">
            <div className="bg-lavender/30 rounded-2xl p-4 mb-4">
              <p className="text-sm text-warm-gray mb-1">Sleep started at</p>
              <p className="text-2xl font-bold text-warm-brown">
                {new Date(activeSleep.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <div className="mt-2 flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-mint-dark animate-pulse" />
                <span className="text-xs text-mint-dark font-semibold">Sleeping now...</span>
              </div>
            </div>
            <button
              onClick={handleEndSleep}
              className="w-full py-3 rounded-xl bg-lavender-dark text-warm-brown font-semibold text-sm hover:bg-lavender transition-colors shadow-md"
            >
              End Sleep
            </button>
          </div>
        ) : (
          <>
            {/* Mode Toggle */}
            <div className="flex gap-2 mb-5 bg-cream rounded-xl p-1">
              <button
                onClick={() => setMode('timer')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  mode === 'timer'
                    ? 'bg-white text-warm-brown shadow-sm'
                    : 'text-warm-gray'
                }`}
              >
                Start Timer
              </button>
              <button
                onClick={() => setMode('manual')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  mode === 'manual'
                    ? 'bg-white text-warm-brown shadow-sm'
                    : 'text-warm-gray'
                }`}
              >
                Log Manually
              </button>
            </div>

            {mode === 'timer' ? (
              <div className="mb-6">
                <p className="text-sm text-warm-gray text-center mb-4">
                  Start a timer when baby falls asleep
                </p>
                <button
                  onClick={handleStartSleep}
                  className="w-full py-3 rounded-xl bg-lavender text-warm-brown font-semibold text-sm hover:bg-lavender-dark transition-colors shadow-md"
                >
                  Start Sleep Timer
                </button>
              </div>
            ) : (
              <div className="mb-6">
                <label className="text-sm font-semibold text-warm-brown mb-3 block">
                  How long did baby sleep?
                </label>
                <div className="flex gap-4 items-center justify-center mb-4">
                  <div className="flex flex-col items-center">
                    <input
                      type="number"
                      min={0}
                      max={23}
                      value={hours}
                      onChange={(e) => setHours(Math.max(0, Number(e.target.value)))}
                      className="w-16 text-center text-2xl font-bold text-warm-brown bg-cream rounded-xl py-2 border-2 border-transparent focus:border-lavender-dark outline-none"
                    />
                    <span className="text-xs text-warm-gray mt-1">hours</span>
                  </div>
                  <span className="text-2xl font-bold text-warm-gray">:</span>
                  <div className="flex flex-col items-center">
                    <input
                      type="number"
                      min={0}
                      max={59}
                      value={minutes}
                      onChange={(e) => setMinutes(Math.max(0, Math.min(59, Number(e.target.value))))}
                      className="w-16 text-center text-2xl font-bold text-warm-brown bg-cream rounded-xl py-2 border-2 border-transparent focus:border-lavender-dark outline-none"
                    />
                    <span className="text-xs text-warm-gray mt-1">minutes</span>
                  </div>
                </div>
                <button
                  onClick={handleManualSleep}
                  className="w-full py-3 rounded-xl bg-lavender text-warm-brown font-semibold text-sm hover:bg-lavender-dark transition-colors shadow-md"
                >
                  Save Sleep
                </button>
              </div>
            )}
          </>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl border-2 border-blush/40 text-warm-gray font-semibold text-sm hover:bg-cream transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
