export interface PeeEntry {
  id: string;
  timestamp: string;
  note?: string;
}

export interface PoopEntry {
  id: string;
  timestamp: string;
  color?: 'yellow' | 'green' | 'brown' | 'black';
  consistency?: 'runny' | 'soft' | 'firm';
  note?: string;
}

export type BreastSide = 'left' | 'right';

export interface FeedingEntry {
  id: string;
  timestamp: string;
  side: BreastSide;
  durationMinutes: number;
  note?: string;
}

export interface DiaperChangeEntry {
  id: string;
  timestamp: string;
  type: 'wet' | 'soiled' | 'both' | 'dry';
  note?: string;
}

export interface SleepEntry {
  id: string;
  startTime: string;
  endTime?: string;
  durationMinutes?: number;
  note?: string;
}

export interface ColicEntry {
  id: string;
  timestamp: string;
  level: 1 | 2 | 3 | 4 | 5;
  note?: string;
}

export interface NoteEntry {
  id: string;
  timestamp: string;
  text: string;
}

export interface Appointment {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  doctor?: string;
  location?: string;
  note?: string;
  completed: boolean;
}

export type BabyGender = 'boy' | 'girl';
export type ThemeName = 'default' | 'pink' | 'blue' | 'green' | 'lavender' | 'mono';

export interface BabyProfile {
  id: string;
  name: string;
  gender: BabyGender;
  dateOfBirth: string; // YYYY-MM-DD
  theme: ThemeName;
  checklistItems: string[];
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  pee: PeeEntry[];
  poop: PoopEntry[];
  feedings: FeedingEntry[];
  diaperChanges: DiaperChangeEntry[];
  sleeps: SleepEntry[];
  colic: ColicEntry[];
  notes: NoteEntry[];
}

export interface DailySummary {
  date: string;
  peeCount: number;
  poopCount: number;
  feedingCount: number;
  totalFeedingMinutes: number;
  leftFeedingMinutes: number;
  rightFeedingMinutes: number;
  diaperChangeCount: number;
  sleepCount: number;
  totalSleepMinutes: number;
  avgColicLevel: number;
  colicCount: number;
}

export type TrackingCategory = 'pee' | 'poop' | 'feeding' | 'diaper' | 'sleep' | 'colic' | 'note';

export type ActivePage = 'profile' | 'tracker' | 'checklist' | 'insights' | 'appointments';
