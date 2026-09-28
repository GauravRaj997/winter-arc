import type { SetLog } from './session.ts';
import type { Exercise } from './workouts.ts';

export type Suggestion = { kind: 'start' | 'reps' | 'load' | 'variation' | 'tempo' | 'hold'; message: string; targets?: number[] };

/**
 * Suggest the next target from last time's completed sets. Never applied
 * automatically — the user decides.
 */
export function suggestProgression(e: Exercise, previous: SetLog[] | undefined): Suggestion {
  const unit = e.unit === 'seconds' ? 's' : '';
  const range = `${e.repMin}–${e.repMax}${e.unit === 'seconds' ? ' s' : ' reps'}`;
  const done = (previous ?? []).filter((s) => s.completed);
  if (done.length === 0) return { kind: 'start', message: `Aim for ${range} with good form.` };

  const lower = `${e.repMin}–${Math.min(e.repMin + 2, e.repMax)} reps`;
  if (done.length >= e.sets && done.every((s) => s.reps >= e.repMax)) {
    switch (e.progression) {
      case 'reps_then_load': return { kind: 'load', message: `Top of the range reached. Add a small amount of backpack weight and target ${lower}.` };
      case 'reps_then_variation': return { kind: 'variation', message: `Top of the range reached. Try a harder variation and target ${lower}.` };
      case 'reps_then_tempo': return { kind: 'tempo', message: `Top of the range reached. Slow the lowering to 3 seconds and target ${lower}.` };
      case 'hold_time': return { kind: 'hold', message: `Top of the range reached. Try a harder variation, or add 5–10 s per set.` };
    }
  }

  // One more rep on the first set and on the weakest set, within the range.
  const targets = done.map((s) => s.reps);
  const weakest = targets.lastIndexOf(Math.min(...targets));
  targets[0] += 1;
  if (weakest !== 0) targets[weakest] += 1;
  const capped = targets.map((r) => Math.min(r, e.repMax));
  const load = done[0].loadKg > 0 ? `${done[0].loadKg} kg` : 'load';
  return { kind: 'reps', targets: capped, message: `Keep ${load} and attempt ${capped.map((r) => `${r}${unit}`).join(' / ')}.` };
}
