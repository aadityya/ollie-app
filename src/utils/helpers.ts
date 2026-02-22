import { format, subDays, parseISO, differenceInMonths, differenceInYears } from 'date-fns';
import type { DailyLog, DailySummary } from '../types';

export function formatTime(isoString: string): string {
  return format(parseISO(isoString), 'h:mm a');
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function formatBabyAge(dobString: string): string {
  const dob = parseISO(dobString);
  const now = new Date();
  const years = differenceInYears(now, dob);
  const totalMonths = differenceInMonths(now, dob);
  const months = totalMonths % 12;

  if (years === 0 && months === 0) {
    const days = Math.floor((now.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24));
    return `${days} day${days !== 1 ? 's' : ''} old`;
  }
  if (years === 0) return `${months} month${months !== 1 ? 's' : ''} old`;
  if (months === 0) return `${years} year${years !== 1 ? 's' : ''} old`;
  return `${years}y ${months}m old`;
}

export function getDailySummary(log: DailyLog): DailySummary {
  const totalFeedingMinutes = log.feedings.reduce((acc, f) => acc + f.durationMinutes, 0);
  const leftFeedingMinutes = log.feedings
    .filter((f) => f.side === 'left')
    .reduce((acc, f) => acc + f.durationMinutes, 0);
  const rightFeedingMinutes = log.feedings
    .filter((f) => f.side === 'right')
    .reduce((acc, f) => acc + f.durationMinutes, 0);
  const totalSleepMinutes = log.sleeps.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);

  const colicLevels = (log.colic || []).map((c) => c.level);
  const avgColicLevel = colicLevels.length > 0
    ? Math.round((colicLevels.reduce((a, b) => a + b, 0) / colicLevels.length) * 10) / 10
    : 0;

  return {
    date: log.date,
    peeCount: log.pee.length,
    poopCount: log.poop.length,
    feedingCount: log.feedings.length,
    totalFeedingMinutes,
    leftFeedingMinutes,
    rightFeedingMinutes,
    diaperChangeCount: log.diaperChanges.length,
    sleepCount: log.sleeps.length,
    totalSleepMinutes,
    avgColicLevel,
    colicCount: (log.colic || []).length,
  };
}

export function getLast7DaysSummaries(
  logs: Record<string, DailyLog>
): DailySummary[] {
  const summaries: DailySummary[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    const log = logs[date] || {
      date,
      pee: [],
      poop: [],
      feedings: [],
      diaperChanges: [],
      sleeps: [],
      colic: [],
      notes: [],
    };
    summaries.push(getDailySummary(log));
  }
  return summaries;
}

export function getAverage(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
}

export function getHigh(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.max(...values);
}

export function getLow(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.min(...values);
}

export function getDayLabel(dateStr: string): string {
  const date = parseISO(dateStr);
  return format(date, 'EEE');
}
