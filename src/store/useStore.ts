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
  ActivePage,
} from '../types';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function todayKey(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

function emptyDay(date: string): DailyLog {
  return { date, pee: [], poop: [], feedings: [], diaperChanges: [], sleeps: [] };
}

interface BabyStore {
  babyName: string;
  setBabyName: (name: string) => void;

  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;

  selectedDate: string;
  setSelectedDate: (date: string) => void;

  logs: Record<string, DailyLog>;

  getDay: (date: string) => DailyLog;
  getToday: () => DailyLog;

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
}

export const useStore = create<BabyStore>()(
  persist(
    (set, get) => ({
      babyName: 'Ollie',
      setBabyName: (name) => set({ babyName: name }),

      activePage: 'tracker',
      setActivePage: (page) => set({ activePage: page }),

      selectedDate: todayKey(),
      setSelectedDate: (date) => set({ selectedDate: date }),

      logs: {},

      getDay: (date: string) => {
        return get().logs[date] || emptyDay(date);
      },

      getToday: () => {
        const today = todayKey();
        return get().logs[today] || emptyDay(today);
      },

      addPee: (note?: string) => {
        const date = get().selectedDate;
        const logs = { ...get().logs };
        if (!logs[date]) logs[date] = emptyDay(date);
        const entry: PeeEntry = {
          id: generateId(),
          timestamp: new Date().toISOString(),
          note,
        };
        logs[date] = { ...logs[date], pee: [...logs[date].pee, entry] };
        set({ logs });
      },

      removePee: (id: string) => {
        const date = get().selectedDate;
        const logs = { ...get().logs };
        if (!logs[date]) return;
        logs[date] = { ...logs[date], pee: logs[date].pee.filter((e) => e.id !== id) };
        set({ logs });
      },

      addPoop: (entry) => {
        const date = get().selectedDate;
        const logs = { ...get().logs };
        if (!logs[date]) logs[date] = emptyDay(date);
        const newEntry: PoopEntry = {
          id: generateId(),
          timestamp: new Date().toISOString(),
          ...entry,
        };
        logs[date] = { ...logs[date], poop: [...logs[date].poop, newEntry] };
        set({ logs });
      },

      removePoop: (id: string) => {
        const date = get().selectedDate;
        const logs = { ...get().logs };
        if (!logs[date]) return;
        logs[date] = { ...logs[date], poop: logs[date].poop.filter((e) => e.id !== id) };
        set({ logs });
      },

      addFeeding: (entry) => {
        const date = get().selectedDate;
        const logs = { ...get().logs };
        if (!logs[date]) logs[date] = emptyDay(date);
        const newEntry: FeedingEntry = {
          id: generateId(),
          timestamp: new Date().toISOString(),
          ...entry,
        };
        logs[date] = { ...logs[date], feedings: [...logs[date].feedings, newEntry] };
        set({ logs });
      },

      removeFeeding: (id: string) => {
        const date = get().selectedDate;
        const logs = { ...get().logs };
        if (!logs[date]) return;
        logs[date] = { ...logs[date], feedings: logs[date].feedings.filter((e) => e.id !== id) };
        set({ logs });
      },

      addDiaperChange: (entry) => {
        const date = get().selectedDate;
        const logs = { ...get().logs };
        if (!logs[date]) logs[date] = emptyDay(date);
        const newEntry: DiaperChangeEntry = {
          id: generateId(),
          timestamp: new Date().toISOString(),
          ...entry,
        };
        logs[date] = { ...logs[date], diaperChanges: [...logs[date].diaperChanges, newEntry] };
        set({ logs });
      },

      removeDiaperChange: (id: string) => {
        const date = get().selectedDate;
        const logs = { ...get().logs };
        if (!logs[date]) return;
        logs[date] = {
          ...logs[date],
          diaperChanges: logs[date].diaperChanges.filter((e) => e.id !== id),
        };
        set({ logs });
      },

      addSleep: (entry) => {
        const date = get().selectedDate;
        const logs = { ...get().logs };
        if (!logs[date]) logs[date] = emptyDay(date);
        const newEntry: SleepEntry = {
          id: generateId(),
          ...entry,
        };
        logs[date] = { ...logs[date], sleeps: [...logs[date].sleeps, newEntry] };
        set({ logs });
      },

      removeSleep: (id: string) => {
        const date = get().selectedDate;
        const logs = { ...get().logs };
        if (!logs[date]) return;
        logs[date] = { ...logs[date], sleeps: logs[date].sleeps.filter((e) => e.id !== id) };
        set({ logs });
      },

      endSleep: (id: string) => {
        const date = get().selectedDate;
        const logs = { ...get().logs };
        if (!logs[date]) return;
        const sleeps = logs[date].sleeps.map((s) => {
          if (s.id === id && !s.endTime) {
            const endTime = new Date().toISOString();
            const start = new Date(s.startTime).getTime();
            const end = new Date(endTime).getTime();
            const durationMinutes = Math.round((end - start) / 60000);
            return { ...s, endTime, durationMinutes };
          }
          return s;
        });
        logs[date] = { ...logs[date], sleeps };
        set({ logs });
      },
    }),
    {
      name: 'ollie-baby-tracker',
    }
  )
);
