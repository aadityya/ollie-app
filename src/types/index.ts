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

export interface DailyLog {
  date: string; // YYYY-MM-DD
  pee: PeeEntry[];
  poop: PoopEntry[];
  feedings: FeedingEntry[];
  diaperChanges: DiaperChangeEntry[];
  sleeps: SleepEntry[];
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
}

export type TrackingCategory = 'pee' | 'poop' | 'feeding' | 'diaper' | 'sleep';

export type ActivePage = 'tracker' | 'insights';
