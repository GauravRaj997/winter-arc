import type { UserProfile } from './profile.ts';
import { generateSchedule, minimalDay, type ScheduleItem } from './schedule.ts';
import { daysBetween, weekdayOf } from './time.ts';
import { WEEKLY_SPLIT, type WorkoutId } from './workouts.ts';

export const PLAN_DAYS = 90;
export type Phase = 1 | 2 | 3;

export const PHASES: Record<Phase, { name: string; from: number; to: number; objective: string }> = {
  1: { name: 'Foundation', from: 1, to: 30, objective: 'Build the routine, learn technique, settle food and sleep.' },
  2: { name: 'Progression', from: 31, to: 60, objective: 'Progressive overload, steady surplus, better recovery.' },
  3: { name: 'Consolidation', from: 61, to: 90, objective: 'Keep progressing, review trends, lock in long-term habits.' },
};

export const dayNumber = (startDate: string, date: string) => daysBetween(startDate, date) + 1;
export const phaseFor = (day: number): Phase => (day <= 30 ? 1 : day <= 60 ? 2 : 3);

export type DailyPlan = {
  date: string;
  dayNumber: number;
  phase: Phase;
  status: 'upcoming' | 'active' | 'complete';
  workoutId: WorkoutId;
  tasks: ScheduleItem[];
};

export function dailyPlan(p: UserProfile, date: string, minimal = false): DailyPlan {
  const day = dayNumber(p.startDate, date);
  const weekday = weekdayOf(date);
  const workoutId = p.trainingDays.includes(weekday) ? WEEKLY_SPLIT[weekday] : 'rest';
  const tasks = minimal
    ? minimalDay(p)
    : generateSchedule(p, { training: workoutId !== 'rest', officeDay: weekday !== 0, reviewDay: weekday === 0 });
  return {
    date,
    dayNumber: day,
    phase: phaseFor(Math.max(day, 1)),
    status: day < 1 ? 'upcoming' : day > PLAN_DAYS ? 'complete' : 'active',
    workoutId,
    tasks,
  };
}

/** Tasks the user can tick. Wake/commute are anchors, not tasks. */
export const checkable = (tasks: ScheduleItem[]) => tasks.filter((t) => t.kind !== 'wake' && t.kind !== 'commute');

export function completion(tasks: ScheduleItem[], done: string[]) {
  const list = checkable(tasks);
  const n = list.filter((t) => done.includes(t.id)).length;
  return { done: n, total: list.length, ratio: list.length ? n / list.length : 0 };
}

export type Pillar = 'train' | 'food' | 'sleep' | 'move';
export const PILLARS: Pillar[] = ['train', 'food', 'sleep', 'move'];

/** Which of the four daily pillars a task counts toward; routine tasks count only toward the total. */
export function pillarOf(t: ScheduleItem): Pillar | undefined {
  if (t.kind === 'workout' || t.id === 'cooldown') return 'train';
  if (t.kind === 'meal' || t.id === 'meal-prep') return 'food';
  if (t.kind === 'sleep' || t.id === 'phone-down') return 'sleep';
  if (t.kind === 'walk') return 'move';
}

export function pillarCompletion(tasks: ScheduleItem[], done: string[]) {
  return Object.fromEntries(PILLARS.map((p) => [p, completion(tasks.filter((t) => pillarOf(t) === p), done)])) as Record<Pillar, ReturnType<typeof completion>>;
}

/** 90-day map cell. Partial days are shown softly, never as failures. */
export const dayMark = (ratio: number | undefined): 'none' | 'partial' | 'full' =>
  !ratio ? 'none' : ratio >= 0.7 ? 'full' : 'partial';
