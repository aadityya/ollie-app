import { useStore } from '../store/useStore';
import { DateSelector } from './DateSelector';

const activityEmojis: Record<string, string> = {
  'Tummy Time': '🤸',
  'Outdoor Time': '☀️',
  'Reading Time': '📖',
  'Bath Time': '🛁',
  'Vitamin Drops': '💊',
  'Skin-to-Skin': '🤗',
  'Music / Singing': '🎵',
};

function getEmoji(item: string): string {
  return activityEmojis[item] || '✨';
}

export function ChecklistPage() {
  const { getActiveBaby, getChecklistItems, getCompletedItems, toggleCheckItem, selectedDate } = useStore();
  const baby = getActiveBaby();
  const items = getChecklistItems();
  const completed = getCompletedItems(selectedDate);

  if (!baby) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <p className="text-warm-brown font-bold text-base mb-2">Daily Checklist</p>
        <p className="text-warm-gray text-sm">
          Add a baby in <strong>Profile</strong> to use the checklist.
        </p>
      </div>
    );
  }

  const completedCount = completed.length;
  const totalCount = items.length;
  const allDone = totalCount > 0 && completedCount === totalCount;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div>
      <DateSelector />

      <div className="px-4 mb-4">
        {/* Progress header */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-blush/10 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-warm-brown">
              {baby.name}'s Daily Activities
            </h2>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
              allDone ? 'bg-mint text-warm-brown' : 'bg-cream text-warm-gray'
            }`}>
              {completedCount}/{totalCount}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-cream rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                allDone ? 'bg-mint-dark' : 'bg-rose/70'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          {allDone && (
            <p className="text-xs text-mint-dark font-semibold mt-2 text-center">
              All done for today! Amazing job, mama!
            </p>
          )}
        </div>

        {/* Checklist items */}
        {totalCount > 0 ? (
          <div className="space-y-2">
            {items.map((item) => {
              const isDone = completed.includes(item);
              return (
                <button
                  key={item}
                  onClick={() => toggleCheckItem(item)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border transition-all duration-200 text-left ${
                    isDone
                      ? 'bg-mint/20 border-mint-dark/30'
                      : 'bg-white border-blush/10 hover:border-blush/30 shadow-sm'
                  }`}
                >
                  {/* Checkbox */}
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${
                    isDone
                      ? 'bg-mint-dark'
                      : 'bg-cream border-2 border-blush/30'
                  }`}>
                    {isDone && (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4 8L7 11L12 5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>

                  {/* Emoji */}
                  <span className="text-lg">{getEmoji(item)}</span>

                  {/* Label */}
                  <span className={`flex-1 text-sm font-semibold transition-all duration-200 ${
                    isDone ? 'text-warm-gray line-through' : 'text-warm-brown'
                  }`}>
                    {item}
                  </span>

                  {isDone && (
                    <span className="text-mint-dark text-xs font-bold">Done</span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-warm-gray text-sm font-medium">No checklist items yet</p>
            <p className="text-warm-gray/60 text-xs mt-1">
              Go to <strong>Profile</strong> to add activities
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
