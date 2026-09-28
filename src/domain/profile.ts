import { isValidDateKey, isValidTime, toMinutes } from './time.ts';

export type Goal = 'muscle_gain' | 'recomposition';
export type Equipment = 'bodyweight' | 'backpack' | 'chair';

export type UserProfile = {
  name?: string;
  startDate: string;
  startWeightKg: number;
  goal: Goal;
  diet: 'vegetarian';
  budget: 'low' | 'moderate';
  equipment: Equipment[];
  /** Weekdays with a planned workout, 0 = Sunday. */
  trainingDays: number[];
  wakeTime: string;
  leaveHomeTime: string;
  returnHomeTime: string;
  bedTime: string;
  /** Beeps at workout start, rest end and finish. 0 = off. Optional for profiles saved before it existed. */
  beeps?: number;
};

export const beepCount = (p: Pick<UserProfile, 'beeps'>) => p.beeps ?? 3;

export const DEFAULT_PROFILE: Omit<UserProfile, 'startDate' | 'startWeightKg'> = {
  goal: 'muscle_gain',
  diet: 'vegetarian',
  budget: 'low',
  equipment: ['bodyweight', 'backpack', 'chair'],
  trainingDays: [1, 2, 3, 4, 5, 6],
  wakeTime: '05:15',
  leaveHomeTime: '08:30',
  returnHomeTime: '20:30',
  bedTime: '22:30',
  beeps: 3,
};

export const sleepMinutes = (p: Pick<UserProfile, 'bedTime' | 'wakeTime'>) =>
  (toMinutes(p.wakeTime) - toMinutes(p.bedTime) + 1440) % 1440;

export type ProfileErrors = Partial<Record<keyof UserProfile, string>>;

export function validateProfile(p: UserProfile): ProfileErrors {
  const e: ProfileErrors = {};
  if (!isValidDateKey(p.startDate)) e.startDate = 'Use YYYY-MM-DD.';
  if (!(p.startWeightKg >= 25 && p.startWeightKg <= 300)) e.startWeightKg = 'Enter weight in kg (25–300).';
  for (const k of ['wakeTime', 'leaveHomeTime', 'returnHomeTime', 'bedTime'] as const) {
    if (!isValidTime(p[k])) e[k] = 'Use 24h HH:MM, e.g. 05:15.';
  }
  if (!e.leaveHomeTime && !e.returnHomeTime && toMinutes(p.returnHomeTime) <= toMinutes(p.leaveHomeTime)) {
    e.returnHomeTime = 'Return time should be after departure.';
  }
  if (p.equipment.length === 0) e.equipment = 'Select at least bodyweight.';
  return e;
}
