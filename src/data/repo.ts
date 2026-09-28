import type { UserProfile } from '../domain/profile.ts';
import type { SetLog, WorkoutSession } from '../domain/session.ts';

/** Minimal key-value contract (AsyncStorage today, an API-backed store later). */
export type KV = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  clear(): Promise<void>;
};

export type DayLog = { date: string; done: string[]; minimal: boolean };

/** Latest completed sets per exercise, plus the one before so re-editing today never hides "previous". */
type LastSets = { date: string; sets: SetLog[]; prev?: { date: string; sets: SetLog[] } };

export function createRepo(kv: KV) {
  const get = async <T>(key: string): Promise<T | undefined> => {
    const raw = await kv.getItem(key);
    return raw ? (JSON.parse(raw) as T) : undefined;
  };
  const set = (key: string, value: unknown) => kv.setItem(key, JSON.stringify(value));

  return {
    getProfile: () => get<UserProfile>('profile'),
    saveProfile: (p: UserProfile) => set('profile', p),

    getDayLog: async (date: string): Promise<DayLog> => (await get<DayLog>(`day:${date}`)) ?? { date, done: [], minimal: false },
    saveDayLog: (log: DayLog) => set(`day:${log.date}`, log),

    getSession: (date: string) => get<WorkoutSession>(`session:${date}`),
    async saveSession(s: WorkoutSession) {
      await set(`session:${s.date}`, s);
      if (s.status !== 'completed') return;
      for (const e of s.exercises) {
        const sets = e.sets.filter((x) => x.completed);
        if (!sets.length) continue;
        const key = `last:${e.exerciseId}`;
        const old = await get<LastSets>(key);
        const prev = old && old.date !== s.date ? { date: old.date, sets: old.sets } : old?.prev;
        await set(key, { date: s.date, sets, prev } satisfies LastSets);
      }
    },
    /** Most recent completed sets for each exercise strictly before `date`. */
    async getPreviousSets(exerciseIds: string[], date: string) {
      const out: Record<string, SetLog[] | undefined> = {};
      for (const id of exerciseIds) {
        const last = await get<LastSets>(`last:${id}`);
        out[id] = last && last.date < date ? last.sets : last?.prev && last.prev.date < date ? last.prev.sets : undefined;
      }
      return out;
    },

    clearAll: () => kv.clear(),
  };
}

export type Repo = ReturnType<typeof createRepo>;
