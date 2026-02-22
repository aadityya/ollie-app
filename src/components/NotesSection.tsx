import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { formatTime } from '../utils/helpers';

export function NotesSection() {
  const { getDay, selectedDate, addNote, removeNote, logs } = useStore(useShallow((s) => ({ getDay: s.getDay, selectedDate: s.selectedDate, addNote: s.addNote, removeNote: s.removeNote, logs: s.logs })));
  void logs; // subscribed so NotesSection re-renders when log data changes
  const day = getDay(selectedDate);
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (text.trim()) {
      addNote(text.trim());
      setText('');
    }
  };

  return (
    <div className="px-4 mb-4">
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-blush/10">
        <h3 className="text-sm font-bold text-warm-brown mb-3">Notes</h3>

        {/* Input */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Add a note for today..."
            className="flex-1 bg-cream rounded-xl px-3 py-2 text-sm text-warm-brown placeholder:text-warm-gray/50 border-2 border-transparent focus:border-lavender-dark outline-none"
          />
          <button
            onClick={handleAdd}
            disabled={!text.trim()}
            className="px-3 py-2 rounded-xl bg-lavender text-warm-brown font-semibold text-sm hover:bg-lavender-dark transition-colors disabled:opacity-40 disabled:hover:bg-lavender"
          >
            Add
          </button>
        </div>

        {/* Notes list */}
        {(day.notes || []).length > 0 ? (
          <div className="space-y-2">
            {[...(day.notes || [])].reverse().map((note) => (
              <div
                key={note.id}
                className="bg-cream/60 rounded-lg px-3 py-2 flex items-start gap-2 group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-warm-brown">{note.text}</p>
                  <p className="text-xs text-warm-gray mt-0.5">{formatTime(note.timestamp)}</p>
                </div>
                <button
                  onClick={() => removeNote(note.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 w-6 h-6 rounded-full bg-white/80 flex items-center justify-center text-warm-gray hover:text-rose-dark"
                >
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M4 4L10 10M10 4L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-warm-gray/50 text-center py-2">No notes yet</p>
        )}
      </div>
    </div>
  );
}
