import type { Equipment } from './profile.ts';
import { exercisesFor, type WorkoutId } from './workouts.ts';

export type SetLog = { setNumber: number; reps: number; loadKg: number; rir?: number; completed: boolean };
export type ExerciseLog = { exerciseId: string; sets: SetLog[] };
export type WorkoutSession = {
  id: string;
  date: string;
  workoutType: WorkoutId;
  status: 'planned' | 'in_progress' | 'completed' | 'skipped';
  exercises: ExerciseLog[];
  notes?: string;
};

export type PreviousSets = Record<string, SetLog[] | undefined>;

/** Plan a session, prefilling each set from last time so logging is one tap. */
export function createSession(date: string, workoutType: WorkoutId, equipment: Equipment[], previous: PreviousSets): WorkoutSession {
  return {
    id: `${date}:${workoutType}`,
    date,
    workoutType,
    status: 'planned',
    exercises: exercisesFor(workoutType, equipment).map((e) => ({
      exerciseId: e.id,
      sets: Array.from({ length: e.sets }, (_, i) => {
        const prev = previous[e.id]?.[i] ?? previous[e.id]?.at(-1);
        return { setNumber: i + 1, reps: prev?.reps ?? e.repMin, loadKg: prev?.loadKg ?? 0, rir: prev?.rir ?? 2, completed: false };
      }),
    })),
  };
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

const touch = (s: WorkoutSession, exercises: ExerciseLog[]): WorkoutSession => ({
  ...s,
  exercises,
  status: s.status === 'planned' ? 'in_progress' : s.status,
});

export function updateSet(s: WorkoutSession, exIdx: number, setIdx: number, patch: Partial<SetLog>): WorkoutSession {
  return touch(s, s.exercises.map((e, i) => i !== exIdx ? e : {
    ...e,
    sets: e.sets.map((set, j) => {
      if (j !== setIdx) return set;
      const next = { ...set, ...patch };
      return {
        ...next,
        reps: clamp(Math.round(next.reps), 0, 999),
        loadKg: clamp(Math.round(next.loadKg * 2) / 2, 0, 200),
        rir: next.rir === undefined ? undefined : clamp(next.rir, 0, 5),
      };
    }),
  }));
}

export function addSet(s: WorkoutSession, exIdx: number): WorkoutSession {
  return touch(s, s.exercises.map((e, i) => {
    if (i !== exIdx) return e;
    const last = e.sets.at(-1);
    return { ...e, sets: [...e.sets, { setNumber: e.sets.length + 1, reps: last?.reps ?? 0, loadKg: last?.loadKg ?? 0, rir: last?.rir, completed: false }] };
  }));
}

export function removeLastSet(s: WorkoutSession, exIdx: number): WorkoutSession {
  return touch(s, s.exercises.map((e, i) => (i === exIdx && e.sets.length > 1 ? { ...e, sets: e.sets.slice(0, -1) } : e)));
}

export const finishSession = (s: WorkoutSession, status: 'completed' | 'skipped'): WorkoutSession => ({ ...s, status });
export const reopenSession = (s: WorkoutSession): WorkoutSession => ({ ...s, status: 'in_progress' });

export function sessionProgress(s: WorkoutSession) {
  const sets = s.exercises.flatMap((e) => e.sets);
  return { done: sets.filter((x) => x.completed).length, total: sets.length };
}

/** Which audio cue a status change deserves: starting (or resuming) and finishing. Editing a finished session is silent. */
export function statusCue(prev: WorkoutSession['status'], next: WorkoutSession['status']): 'start' | 'end' | undefined {
  if (next === 'in_progress' && (prev === 'planned' || prev === 'skipped')) return 'start';
  if (next === 'completed' && prev !== 'completed') return 'end';
}

export const hasLoggedSets =(s: WorkoutSession) => sessionProgress(s).done > 0;
