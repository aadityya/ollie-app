import { format, subDays, parseISO, differenceInMonths, differenceInYears, differenceInDays } from 'date-fns';
import type { DailyLog, DailySummary } from '../types';

export const DEFAULT_CHECKLIST_ITEMS = [
  'Tummy Time',
  'Outdoor Time',
  'Reading Time',
  'Bath Time',
  'Vitamin Drops',
  'Skin-to-Skin',
  'Music / Singing',
];

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

export function getDailyTip(dobString: string, babyName: string): string {
  const dob = parseISO(dobString);
  const now = new Date();
  const ageInDays = differenceInDays(now, dob);

  // Kindergarten: September 1 of the year baby turns 5
  const kinderYear = dob.getFullYear() + 5;
  const kinderDate = new Date(kinderYear, 8, 1); // Sept 1
  const daysToKinder = differenceInDays(kinderDate, now);

  // Use day-of-year as seed for tip rotation
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
  const name = babyName;

  const tips: string[] = [
    daysToKinder > 0
      ? `🎓 ${daysToKinder.toLocaleString()} days until ${name}'s first day of Kindergarten!`
      : `🎓 ${name} is getting ready for big adventures ahead!`,
    `🌱 ${name} has been growing for ${ageInDays} amazing days. You're doing great, mama!`,
    `💪 Tummy time builds strength! Every minute on the mat is progress for ${name}.`,
    `📖 Reading to ${name} now builds pathways for a lifetime of learning.`,
    `🎵 Babies who hear music develop stronger neural connections. Sing to ${name}!`,
    `🤗 Your touch is ${name}'s favorite thing in the whole world.`,
    `🌟 Every day, ${name} is learning something brand new. Celebrate the little wins!`,
    `💤 Sleep helps tiny brains process everything they've learned today.`,
    `🦋 Every milestone happens at its own perfect pace. ${name} is right on track.`,
    `☀️ A few minutes of outdoor time does wonders for both you and ${name}.`,
    `🫶 You know ${name} better than anyone in the world. Trust your instincts!`,
    `🎨 Bright colors and new textures spark ${name}'s curiosity and development.`,
    `👣 Those tiny feet will be running before you know it. Enjoy every step.`,
    `🧸 Play is baby's work — every giggle means something new just clicked!`,
    `🌈 ${name}'s brain is forming 1 million neural connections every second.`,
    `💕 Skin-to-skin contact reduces stress for both baby and mama.`,
    `🍼 Every feeding is a bonding moment. You're nourishing body and soul.`,
    `🎉 Celebrate the small wins — they all add up to big milestones!`,
    `🦁 Brave mama! Taking care of ${name} is truly heroic work.`,
    `🌻 ${name} is growing exactly as they should. You're an amazing parent.`,
    `🧠 Talking to ${name} — even about your day — boosts language development.`,
  ];

  return tips[dayOfYear % tips.length];
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
