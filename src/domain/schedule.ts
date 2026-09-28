import type { UserProfile } from './profile.ts';
import { fromMinutes, toMinutes } from './time.ts';

export type ScheduleKind = 'wake' | 'workout' | 'meal' | 'commute' | 'walk' | 'routine' | 'sleep';
export type ScheduleItem = { id: string; time: string; label: string; kind: ScheduleKind };

type Times = Pick<UserProfile, 'wakeTime' | 'leaveHomeTime' | 'returnHomeTime' | 'bedTime'>;
export type DayOptions = { training: boolean; officeDay: boolean; reviewDay: boolean };

/**
 * Derive the day from four anchor times, so changing office hours regenerates
 * everything instead of editing each task. Defaults reproduce the Winter Arc table.
 */
export function generateSchedule(t: Times, o: DayOptions): ScheduleItem[] {
  const W = toMinutes(t.wakeTime);
  const L = toMinutes(t.leaveHomeTime);
  const R = toMinutes(t.returnHomeTime);
  const B = toMinutes(t.bedTime);
  const at = (id: string, min: number, label: string, kind: ScheduleKind): ScheduleItem => ({ id, time: fromMinutes(min), label, kind });

  const items: ScheduleItem[] = [at('wake', W, 'Wake up', 'wake')];
  if (o.training) {
    items.push(at('workout', W + 20, 'Morning workout', 'workout'), at('cooldown', W + 65, 'Cool down + bath', 'routine'));
  }
  items.push(at('breakfast', o.officeDay ? Math.min(W + 105, L - 30) : W + 105, 'Breakfast', 'meal'));
  if (o.officeDay) items.push(at('leave', L, 'Leave home', 'commute'));
  if (!o.officeDay) items.push(at('meal-prep', W + 285, 'Meal prep for the week', 'routine'));
  items.push(at('snack-am', L + 120, 'Mid-morning snack', 'meal'), at('lunch', L + 300, 'Lunch', 'meal'), at('snack-pm', R - 210, 'Evening snack', 'meal'));
  if (o.officeDay) items.push(at('home', R, 'Home', 'commute'));
  if (o.reviewDay) items.push(at('review', R - 150, 'Weekly review', 'routine'));
  items.push(
    at('dinner', R + 15, 'Dinner', 'meal'),
    at('walk', R + 45, 'Evening walk', 'walk'),
    at('prep', R + 75, 'Prepare for tomorrow', 'routine'),
    at('phone-down', B - 15, 'Phone down', 'routine'),
    at('sleep', B, 'Sleep', 'sleep'),
  );
  // Order by time since waking so a bedtime after midnight still sorts last.
  const sinceWake = (i: ScheduleItem) => (toMinutes(i.time) - W + 1440) % 1440;
  return items.sort((a, b) => sinceWake(a) - sinceWake(b));
}

/** Reduced plan for exhausted days — continuity over perfection. */
export const minimalDay = (t: Pick<UserProfile, 'bedTime'>): ScheduleItem[] => [
  { id: 'min-mobility', time: '', label: '10-minute mobility', kind: 'workout' },
  { id: 'min-protein', time: '', label: 'One protein-focused meal', kind: 'meal' },
  { id: 'min-walk', time: '', label: 'Short walk', kind: 'walk' },
  { id: 'sleep', time: t.bedTime, label: 'Sleep on time', kind: 'sleep' },
];
