import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { repo, type DayLog } from '../data';
import type { Equipment } from '../domain/profile';
import { createSession, hasLoggedSets, type PreviousSets, type WorkoutSession } from '../domain/session';
import { toDateKey } from '../domain/time';
import { exercisesFor, type WorkoutId } from '../domain/workouts';

/** Today's date key, refreshed whenever a screen regains focus (app left open overnight). */
export function useToday() {
  const [today, setToday] = useState(() => toDateKey(new Date()));
  useFocusEffect(useCallback(() => setToday(toDateKey(new Date())), []));
  return today;
}

export function useDay(date: string) {
  const [log, setLog] = useState<DayLog>();
  const [session, setSession] = useState<WorkoutSession>();
  const [error, setError] = useState<string>();

  useFocusEffect(useCallback(() => {
    let live = true;
    Promise.all([repo.getDayLog(date), repo.getSession(date)]).then(
      ([l, s]) => { if (live) { setLog(l); setSession(s); setError(undefined); } },
      () => live && setError("Couldn't load today. Try again."),
    );
    return () => { live = false; };
  }, [date]));

  const save = (next: DayLog) => {
    const prev = log;
    setLog(next);
    repo.saveDayLog(next).catch(() => { setLog(prev); setError("Couldn't save. Try again."); });
  };

  return {
    log,
    session,
    error,
    toggle: (id: string) => log && save({ ...log, done: log.done.includes(id) ? log.done.filter((d) => d !== id) : [...log.done, id] }),
    setMinimal: (minimal: boolean) => log && save({ ...log, minimal }),
  };
}

export function useWorkout(date: string, plannedId: WorkoutId, equipment: Equipment[]) {
  const [session, setSession] = useState<WorkoutSession>();
  const [previous, setPrevious] = useState<PreviousSets>({});
  const [error, setError] = useState<string>();

  const plan = async (type: WorkoutId) => {
    const prev = await repo.getPreviousSets(exercisesFor(type, equipment).map((e) => e.id), date);
    setPrevious(prev);
    const s = createSession(date, type, equipment, prev);
    setSession(s);
    return s;
  };

  useFocusEffect(useCallback(() => {
    let live = true;
    repo.getSession(date).then(async (existing) => {
      if (!live) return;
      if (!existing) return void (await plan(plannedId));
      setPrevious(await repo.getPreviousSets(existing.exercises.map((e) => e.exerciseId), date));
      setSession(existing);
    }).catch(() => live && setError("Couldn't load your workout. Try again."));
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, plannedId, equipment.join()]));

  return {
    session,
    previous,
    error,
    /** State keeps the entered data even if a write fails; the next change retries. */
    update(next: WorkoutSession) {
      setSession(next);
      repo.saveSession(next).then(() => setError(undefined), () => setError("Couldn't save your workout. Try again."));
    },
    /** Only allowed before any set is logged, so history is never overwritten. */
    switchTo(type: WorkoutId) {
      if (session && hasLoggedSets(session)) return;
      plan(type).then(repo.saveSession).catch(() => setError("Couldn't load your workout. Try again."));
    },
  };
}
