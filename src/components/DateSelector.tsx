import { format, addDays, subDays, isToday, parseISO } from 'date-fns';
import { useStore } from '../store/useStore';
import { useShallow } from 'zustand/react/shallow';

export function DateSelector() {
  const { selectedDate, setSelectedDate } = useStore(useShallow((s) => ({ selectedDate: s.selectedDate, setSelectedDate: s.setSelectedDate })));
  const date = parseISO(selectedDate);

  const goBack = () => setSelectedDate(format(subDays(date, 1), 'yyyy-MM-dd'));
  const goForward = () => setSelectedDate(format(addDays(date, 1), 'yyyy-MM-dd'));
  const goToday = () => setSelectedDate(format(new Date(), 'yyyy-MM-dd'));

  const isCurrentDay = isToday(date);

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <button
        onClick={goBack}
        className="w-9 h-9 rounded-full bg-white border border-blush/40 flex items-center justify-center text-warm-brown hover:bg-blush/20 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div className="flex flex-col items-center">
        <span className="text-base font-bold text-warm-brown">
          {isCurrentDay ? 'Today' : format(date, 'EEEE')}
        </span>
        <span className="text-xs text-warm-gray font-medium">
          {format(date, 'MMMM d, yyyy')}
        </span>
      </div>

      <div className="flex gap-2">
        {!isCurrentDay && (
          <button
            onClick={goToday}
            className="px-2.5 py-1 rounded-full bg-rose/20 text-rose-dark text-xs font-semibold hover:bg-rose/30 transition-colors"
          >
            Today
          </button>
        )}
        <button
          onClick={goForward}
          className="w-9 h-9 rounded-full bg-white border border-blush/40 flex items-center justify-center text-warm-brown hover:bg-blush/20 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
