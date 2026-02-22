import { useState } from 'react';
import { format, parseISO, isPast, isToday } from 'date-fns';
import { useStore } from '../store/useStore';
import { CalendarIcon } from './Icons';

export function AppointmentsPage() {
  const { appointments, activeBabyId, addAppointment, removeAppointment, toggleAppointmentComplete, getActiveBaby } = useStore();
  const baby = getActiveBaby();
  const babyAppts = activeBabyId ? (appointments[activeBabyId] || []) : [];

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [time, setTime] = useState('');
  const [doctor, setDoctor] = useState('');
  const [location, setLocation] = useState('');

  const upcoming = [...babyAppts]
    .filter((a) => !a.completed)
    .sort((a, b) => a.date.localeCompare(b.date));
  const completed = babyAppts.filter((a) => a.completed);

  const handleAdd = () => {
    if (!title.trim() || !date) return;
    addAppointment({
      title: title.trim(),
      date,
      time: time || undefined,
      doctor: doctor.trim() || undefined,
      location: location.trim() || undefined,
    });
    setTitle('');
    setTime('');
    setDoctor('');
    setLocation('');
    setShowForm(false);
  };

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-warm-brown">Appointments</h2>
          <p className="text-xs text-warm-gray">{baby?.name}'s upcoming visits</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3 py-1.5 rounded-xl bg-rose text-white font-semibold text-xs hover:bg-rose-dark transition-colors shadow-sm"
        >
          {showForm ? 'Cancel' : '+ New'}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-blush/10 space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Appointment title *"
            className="w-full bg-cream rounded-xl px-3 py-2.5 text-sm text-warm-brown placeholder:text-warm-gray/50 border-2 border-transparent focus:border-rose/40 outline-none"
          />
          <div className="flex gap-2">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1 bg-cream rounded-xl px-3 py-2.5 text-sm text-warm-brown border-2 border-transparent focus:border-rose/40 outline-none"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="flex-1 bg-cream rounded-xl px-3 py-2.5 text-sm text-warm-brown border-2 border-transparent focus:border-rose/40 outline-none"
            />
          </div>
          <input
            type="text"
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
            placeholder="Doctor / Provider"
            className="w-full bg-cream rounded-xl px-3 py-2.5 text-sm text-warm-brown placeholder:text-warm-gray/50 border-2 border-transparent focus:border-rose/40 outline-none"
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="w-full bg-cream rounded-xl px-3 py-2.5 text-sm text-warm-brown placeholder:text-warm-gray/50 border-2 border-transparent focus:border-rose/40 outline-none"
          />
          <button
            onClick={handleAdd}
            disabled={!title.trim()}
            className="w-full py-2.5 rounded-xl bg-rose text-white font-semibold text-sm hover:bg-rose-dark transition-colors shadow-md disabled:opacity-40"
          >
            Save Appointment
          </button>
        </div>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 ? (
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-warm-gray uppercase tracking-wider">Upcoming</h3>
          {upcoming.map((appt) => (
            <AppointmentCard
              key={appt.id}
              appt={appt}
              onToggle={() => toggleAppointmentComplete(appt.id)}
              onRemove={() => removeAppointment(appt.id)}
            />
          ))}
        </div>
      ) : (
        !showForm && (
          <div className="text-center py-8">
            <CalendarIcon size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-warm-gray text-sm font-medium">No upcoming appointments</p>
            <p className="text-warm-gray/60 text-xs mt-1">Tap "+ New" to add one</p>
          </div>
        )
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-warm-gray uppercase tracking-wider">Completed</h3>
          {completed.map((appt) => (
            <AppointmentCard
              key={appt.id}
              appt={appt}
              onToggle={() => toggleAppointmentComplete(appt.id)}
              onRemove={() => removeAppointment(appt.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AppointmentCard({
  appt,
  onToggle,
  onRemove,
}: {
  appt: { id: string; title: string; date: string; time?: string; doctor?: string; location?: string; completed: boolean };
  onToggle: () => void;
  onRemove: () => void;
}) {
  const apptDate = parseISO(appt.date);
  const past = isPast(apptDate) && !isToday(apptDate);
  const today = isToday(apptDate);

  return (
    <div
      className={`bg-white rounded-xl p-3 shadow-sm border group ${
        appt.completed
          ? 'border-mint/30 opacity-60'
          : today
          ? 'border-rose/30 bg-blush/10'
          : past
          ? 'border-warm-gray/20'
          : 'border-blush/10'
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={onToggle}
          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
            appt.completed
              ? 'bg-mint border-mint-dark'
              : 'border-blush-dark hover:bg-blush/20'
          }`}
        >
          {appt.completed && (
            <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
              <path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${appt.completed ? 'line-through text-warm-gray' : 'text-warm-brown'}`}>
            {appt.title}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
            <span className={`text-xs ${today ? 'text-rose font-semibold' : 'text-warm-gray'}`}>
              {today ? 'Today' : format(apptDate, 'MMM d, yyyy')}
              {appt.time ? ` at ${appt.time}` : ''}
            </span>
            {appt.doctor && (
              <span className="text-xs text-warm-gray">Dr. {appt.doctor}</span>
            )}
            {appt.location && (
              <span className="text-xs text-warm-gray">{appt.location}</span>
            )}
          </div>
        </div>
        <button
          onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-full bg-cream flex items-center justify-center text-warm-gray hover:text-rose-dark"
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M4 4L10 10M10 4L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
