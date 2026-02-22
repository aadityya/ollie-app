import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format } from 'date-fns';
import type {
  DailyLog,
  PeeEntry,
  PoopEntry,
  FeedingEntry,
  DiaperChangeEntry,
  SleepEntry,
  ColicEntry,
  NoteEntry,
  Appointment,
  BabyProfile,
  ActivePage,
} from '../types';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function todayKey(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

function emptyDay(date: string): DailyLog {
  return { date, pee: [], poop: [], feedings: [], diaperChanges: [], sleeps: [], colic: [], notes: [] };
}

interface BabyStore {
  // Multi-baby profiles
  profiles: BabyProfile[];
  activeBabyId: string | null;
  addProfile: (profile: Omit<BabyProfile, 'id'>) => void;
  updateProfile: (id: string, updates: Partial<Omit<BabyProfile, 'id'>>) => void;
  removeProfile: (id: string) => void;
  setActiveBaby: (id: string) => void;
  getActiveBaby: () => BabyProfile | null;

  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;

  selectedDate: string;
  setSelectedDate: (date: string) => void;

  // Logs keyed by babyId -> date
  logs: Record<string, Record<string, DailyLog>>;

  getDay: (date: string) => DailyLog;
  getToday: () => DailyLog;
  getBabyLogs: () => Record<string, DailyLog>;

  addPee: (note?: string) => void;
  removePee: (id: string) => void;

  addPoop: (entry: Omit<PoopEntry, 'id' | 'timestamp'>) => void;
  removePoop: (id: string) => void;

  addFeeding: (entry: Omit<FeedingEntry, 'id' | 'timestamp'>) => void;
  removeFeeding: (id: string) => void;

  addDiaperChange: (entry: Omit<DiaperChangeEntry, 'id' | 'timestamp'>) => void;
  removeDiaperChange: (id: string) => void;

  addSleep: (entry: Omit<SleepEntry, 'id'>) => void;
  removeSleep: (id: string) => void;
  endSleep: (id: string) => void;

  addColic: (level: 1 | 2 | 3 | 4 | 5, note?: string) => void;
  removeColic: (id: string) => void;

  addNote: (text: string) => void;
  removeNote: (id: string) => void;

  // Appointments keyed by babyId
  appointments: Record<string, Appointment[]>;
  addAppointment: (entry: Omit<Appointment, 'id' | 'completed'>) => void;
  updateAppointment: (id: string, updates: Partial<Omit<Appointment, 'id'>>) => void;
  removeAppointment: (id: string) => void;
  toggleAppointmentComplete: (id: string) => void;
}

export const useStore = create<BabyStore>()(
  persist(
    (set, get) => {
      // Helper to get the active baby's logs
      function getBabyDate() {
        const babyId = get().activeBabyId;
        const date = get().selectedDate;
        if (!babyId) return { babyId: '', date };
        return { babyId, date };
      }

      function ensureDay(logs: Record<string, Record<string, DailyLog>>, babyId: string, date: string) {
        const updated = { ...logs };
        if (!updated[babyId]) updated[babyId] = {};
        if (!updated[babyId][date]) updated[babyId][date] = emptyDay(date);
        else updated[babyId] = { ...updated[babyId] };
        updated[babyId][date] = { ...updated[babyId][date] };
        return updated;
      }

      return {
        profiles: [],
        activeBabyId: null,

        addProfile: (profile) => {
          const id = generateId();
          const newProfile = { ...profile, id };
          const profiles = [...get().profiles, newProfile];
          // If first baby, set as active
          const activeBabyId = get().activeBabyId || id;
          set({ profiles, activeBabyId });
        },

        updateProfile: (id, updates) => {
          const profiles = get().profiles.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          );
          set({ profiles });
        },

        removeProfile: (id) => {
          const profiles = get().profiles.filter((p) => p.id !== id);
          const activeBabyId = get().activeBabyId === id
            ? (profiles[0]?.id || null)
            : get().activeBabyId;
          set({ profiles, activeBabyId });
        },

        setActiveBaby: (id) => set({ activeBabyId: id }),

        getActiveBaby: () => {
          const { profiles, activeBabyId } = get();
          return profiles.find((p) => p.id === activeBabyId) || null;
        },

        activePage: 'tracker',
        setActivePage: (page) => set({ activePage: page }),

        selectedDate: todayKey(),
        setSelectedDate: (date) => set({ selectedDate: date }),

        logs: {},

        getDay: (date: string) => {
          const babyId = get().activeBabyId;
          if (!babyId) return emptyDay(date);
          const babyLogs = get().logs[babyId];
          if (!babyLogs) return emptyDay(date);
          return babyLogs[date] || emptyDay(date);
        },

        getToday: () => {
          const today = todayKey();
          return get().getDay(today);
        },

        getBabyLogs: () => {
          const babyId = get().activeBabyId;
          if (!babyId) return {};
          return get().logs[babyId] || {};
        },

        addPee: (note?: string) => {
          const { babyId, date } = getBabyDate();
          if (!babyId) return;
          const logs = ensureDay(get().logs, babyId, date);
          const entry: PeeEntry = { id: generateId(), timestamp: new Date().toISOString(), note };
          logs[babyId][date].pee = [...logs[babyId][date].pee, entry];
          set({ logs });
        },

        removePee: (id) => {
          const { babyId, date } = getBabyDate();
          if (!babyId) return;
          const logs = ensureDay(get().logs, babyId, date);
          logs[babyId][date].pee = logs[babyId][date].pee.filter((e) => e.id !== id);
          set({ logs });
        },

        addPoop: (entry) => {
          const { babyId, date } = getBabyDate();
          if (!babyId) return;
          const logs = ensureDay(get().logs, babyId, date);
          const newEntry: PoopEntry = { id: generateId(), timestamp: new Date().toISOString(), ...entry };
          logs[babyId][date].poop = [...logs[babyId][date].poop, newEntry];
          set({ logs });
        },

        removePoop: (id) => {
          const { babyId, date } = getBabyDate();
          if (!babyId) return;
          const logs = ensureDay(get().logs, babyId, date);
          logs[babyId][date].poop = logs[babyId][date].poop.filter((e) => e.id !== id);
          set({ logs });
        },

        addFeeding: (entry) => {
          const { babyId, date } = getBabyDate();
          if (!babyId) return;
          const logs = ensureDay(get().logs, babyId, date);
          const newEntry: FeedingEntry = { id: generateId(), timestamp: new Date().toISOString(), ...entry };
          logs[babyId][date].feedings = [...logs[babyId][date].feedings, newEntry];
          set({ logs });
        },

        removeFeeding: (id) => {
          const { babyId, date } = getBabyDate();
          if (!babyId) return;
          const logs = ensureDay(get().logs, babyId, date);
          logs[babyId][date].feedings = logs[babyId][date].feedings.filter((e) => e.id !== id);
          set({ logs });
        },

        addDiaperChange: (entry) => {
          const { babyId, date } = getBabyDate();
          if (!babyId) return;
          const logs = ensureDay(get().logs, babyId, date);
          const newEntry: DiaperChangeEntry = { id: generateId(), timestamp: new Date().toISOString(), ...entry };
          logs[babyId][date].diaperChanges = [...logs[babyId][date].diaperChanges, newEntry];
          set({ logs });
        },

        removeDiaperChange: (id) => {
          const { babyId, date } = getBabyDate();
          if (!babyId) return;
          const logs = ensureDay(get().logs, babyId, date);
          logs[babyId][date].diaperChanges = logs[babyId][date].diaperChanges.filter((e) => e.id !== id);
          set({ logs });
        },

        addSleep: (entry) => {
          const { babyId, date } = getBabyDate();
          if (!babyId) return;
          const logs = ensureDay(get().logs, babyId, date);
          const newEntry: SleepEntry = { id: generateId(), ...entry };
          logs[babyId][date].sleeps = [...logs[babyId][date].sleeps, newEntry];
          set({ logs });
        },

        removeSleep: (id) => {
          const { babyId, date } = getBabyDate();
          if (!babyId) return;
          const logs = ensureDay(get().logs, babyId, date);
          logs[babyId][date].sleeps = logs[babyId][date].sleeps.filter((e) => e.id !== id);
          set({ logs });
        },

        endSleep: (id) => {
          const { babyId, date } = getBabyDate();
          if (!babyId) return;
          const logs = ensureDay(get().logs, babyId, date);
          logs[babyId][date].sleeps = logs[babyId][date].sleeps.map((s) => {
            if (s.id === id && !s.endTime) {
              const endTime = new Date().toISOString();
              const start = new Date(s.startTime).getTime();
              const end = new Date(endTime).getTime();
              const durationMinutes = Math.round((end - start) / 60000);
              return { ...s, endTime, durationMinutes };
            }
            return s;
          });
          set({ logs });
        },

        addColic: (level, note) => {
          const { babyId, date } = getBabyDate();
          if (!babyId) return;
          const logs = ensureDay(get().logs, babyId, date);
          const entry: ColicEntry = { id: generateId(), timestamp: new Date().toISOString(), level, note };
          logs[babyId][date].colic = [...logs[babyId][date].colic, entry];
          set({ logs });
        },

        removeColic: (id) => {
          const { babyId, date } = getBabyDate();
          if (!babyId) return;
          const logs = ensureDay(get().logs, babyId, date);
          logs[babyId][date].colic = logs[babyId][date].colic.filter((e) => e.id !== id);
          set({ logs });
        },

        addNote: (text) => {
          const { babyId, date } = getBabyDate();
          if (!babyId) return;
          const logs = ensureDay(get().logs, babyId, date);
          const entry: NoteEntry = { id: generateId(), timestamp: new Date().toISOString(), text };
          logs[babyId][date].notes = [...logs[babyId][date].notes, entry];
          set({ logs });
        },

        removeNote: (id) => {
          const { babyId, date } = getBabyDate();
          if (!babyId) return;
          const logs = ensureDay(get().logs, babyId, date);
          logs[babyId][date].notes = logs[babyId][date].notes.filter((e) => e.id !== id);
          set({ logs });
        },

        appointments: {},

        addAppointment: (entry) => {
          const babyId = get().activeBabyId;
          if (!babyId) return;
          const appointments = { ...get().appointments };
          if (!appointments[babyId]) appointments[babyId] = [];
          const newEntry: Appointment = { id: generateId(), completed: false, ...entry };
          appointments[babyId] = [...appointments[babyId], newEntry];
          set({ appointments });
        },

        updateAppointment: (id, updates) => {
          const babyId = get().activeBabyId;
          if (!babyId) return;
          const appointments = { ...get().appointments };
          if (!appointments[babyId]) return;
          appointments[babyId] = appointments[babyId].map((a) =>
            a.id === id ? { ...a, ...updates } : a
          );
          set({ appointments });
        },

        removeAppointment: (id) => {
          const babyId = get().activeBabyId;
          if (!babyId) return;
          const appointments = { ...get().appointments };
          if (!appointments[babyId]) return;
          appointments[babyId] = appointments[babyId].filter((a) => a.id !== id);
          set({ appointments });
        },

        toggleAppointmentComplete: (id) => {
          const babyId = get().activeBabyId;
          if (!babyId) return;
          const appointments = { ...get().appointments };
          if (!appointments[babyId]) return;
          appointments[babyId] = appointments[babyId].map((a) =>
            a.id === id ? { ...a, completed: !a.completed } : a
          );
          set({ appointments });
        },
      };
    },
    {
      name: 'ollie-baby-tracker',
    }
  )
);
