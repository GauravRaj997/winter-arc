import type { Equipment } from './profile.ts';

export type ProgressionRule = 'reps_then_load' | 'reps_then_variation' | 'reps_then_tempo' | 'hold_time';

export type Exercise = {
  id: string;
  name: string;
  muscleGroup: string;
  instructions: string;
  equipment: Equipment;
  difficulty: 'beginner' | 'intermediate';
  unit: 'reps' | 'seconds';
  perSide?: boolean;
  sets: number;
  repMin: number;
  repMax: number;
  restSeconds: number;
  progression: ProgressionRule;
  /** Used when the required equipment isn't available. */
  alternativeId?: string;
};

const ex = (e: Omit<Exercise, 'difficulty' | 'unit' | 'restSeconds'> & Partial<Exercise>): Exercise => ({
  difficulty: 'beginner',
  unit: 'reps',
  restSeconds: 90,
  ...e,
});

const LIST: Exercise[] = [
  ex({ id: 'push-up', name: 'Push-up', muscleGroup: 'Chest', equipment: 'bodyweight', sets: 3, repMin: 8, repMax: 15, progression: 'reps_then_load',
    instructions: 'Hands under shoulders, body in one line. Lower chest to a fist above the floor, press up. Use knees or a bench if needed.' }),
  ex({ id: 'pike-push-up', name: 'Pike push-up', muscleGroup: 'Shoulders', equipment: 'bodyweight', sets: 3, repMin: 6, repMax: 12, progression: 'reps_then_variation',
    instructions: 'Hips high in an inverted V. Bend elbows to bring the head toward the floor between the hands, then press back.' }),
  ex({ id: 'close-grip-push-up', name: 'Close-grip push-up', muscleGroup: 'Triceps', equipment: 'bodyweight', sets: 3, repMin: 6, repMax: 12, progression: 'reps_then_variation',
    instructions: 'Hands narrower than shoulders, elbows close to the ribs. Lower under control and press up.' }),
  ex({ id: 'chair-dip', name: 'Chair dip', muscleGroup: 'Triceps', equipment: 'chair', sets: 3, repMin: 8, repMax: 15, progression: 'reps_then_tempo', alternativeId: 'close-grip-push-up',
    instructions: 'Use a stable chair against a wall. Lower until elbows reach about 90°, keep shoulders down, press up. Stop if shoulders ache.' }),
  ex({ id: 'squat', name: 'Squat', muscleGroup: 'Quads', equipment: 'bodyweight', sets: 3, repMin: 12, repMax: 20, progression: 'reps_then_load',
    instructions: 'Feet shoulder-width. Sit hips back and down, knees tracking over toes, chest tall. Wear a loaded backpack to progress.' }),
  ex({ id: 'reverse-lunge', name: 'Reverse lunge', muscleGroup: 'Legs', equipment: 'bodyweight', perSide: true, sets: 3, repMin: 8, repMax: 12, progression: 'reps_then_load',
    instructions: 'Step one foot back, lower until both knees are near 90°, drive through the front heel to stand.' }),
  ex({ id: 'bulgarian-split-squat', name: 'Bulgarian split squat', muscleGroup: 'Legs', equipment: 'chair', perSide: true, sets: 3, repMin: 8, repMax: 12, progression: 'reps_then_load', difficulty: 'intermediate', alternativeId: 'reverse-lunge',
    instructions: 'Rear foot on a stable chair or bed. Lower straight down on the front leg, then stand. Hold the wall for balance if needed.' }),
  ex({ id: 'calf-raise', name: 'Calf raise', muscleGroup: 'Calves', equipment: 'bodyweight', sets: 3, repMin: 15, repMax: 25, restSeconds: 60, progression: 'reps_then_load',
    instructions: 'Rise onto the balls of the feet, pause at the top, lower slowly. Use a step edge for more range.' }),
  ex({ id: 'glute-bridge', name: 'Glute bridge', muscleGroup: 'Glutes', equipment: 'bodyweight', sets: 3, repMin: 12, repMax: 20, restSeconds: 60, progression: 'reps_then_load',
    instructions: 'Lie on your back, knees bent. Drive hips up by squeezing glutes, pause, lower. Place a backpack on the hips to progress.' }),
  ex({ id: 'single-leg-rdl', name: 'Single-leg Romanian deadlift', muscleGroup: 'Hamstrings', equipment: 'bodyweight', perSide: true, sets: 3, repMin: 8, repMax: 12, progression: 'reps_then_load',
    instructions: 'Hinge at the hip on one leg, free leg extends back, back flat. Lower until you feel the hamstring stretch, return.' }),
  ex({ id: 'superman', name: 'Superman hold', muscleGroup: 'Lower back', equipment: 'bodyweight', sets: 3, repMin: 10, repMax: 15, restSeconds: 60, progression: 'reps_then_tempo',
    instructions: 'Lie face down. Lift arms, chest and legs slightly, pause for a second, lower with control.' }),
  ex({ id: 'prone-ytw', name: 'Prone Y-T-W raise', muscleGroup: 'Upper back', equipment: 'bodyweight', sets: 3, repMin: 8, repMax: 12, restSeconds: 60, progression: 'reps_then_tempo',
    instructions: 'Face down, lift arms into a Y, then T, then W shape, squeezing shoulder blades. One Y-T-W is one rep.' }),
  ex({ id: 'backpack-row', name: 'Backpack row', muscleGroup: 'Back', equipment: 'backpack', sets: 3, repMin: 10, repMax: 15, progression: 'reps_then_load', alternativeId: 'prone-ytw',
    instructions: 'Hinge forward with a flat back, hold the backpack by its straps, pull it to your lower ribs, lower slowly.' }),
  ex({ id: 'backpack-press', name: 'Backpack overhead press', muscleGroup: 'Shoulders', equipment: 'backpack', sets: 3, repMin: 8, repMax: 12, progression: 'reps_then_load', alternativeId: 'pike-push-up',
    instructions: 'Hold the backpack at chest height, brace your core, press it overhead without arching your back, lower.' }),
  ex({ id: 'backpack-curl', name: 'Backpack curl', muscleGroup: 'Biceps', equipment: 'backpack', sets: 3, repMin: 10, repMax: 15, restSeconds: 60, progression: 'reps_then_load',
    instructions: 'Hold the top handle, elbows at your sides. Curl up, pause, lower slowly without swinging.' }),
  ex({ id: 'plank', name: 'Plank', muscleGroup: 'Core', equipment: 'bodyweight', unit: 'seconds', sets: 3, repMin: 30, repMax: 60, restSeconds: 60, progression: 'hold_time',
    instructions: 'Forearms under shoulders, body in one straight line, glutes tight. Breathe steadily.' }),
  ex({ id: 'dead-bug', name: 'Dead bug', muscleGroup: 'Core', equipment: 'bodyweight', perSide: true, sets: 3, repMin: 8, repMax: 12, restSeconds: 60, progression: 'reps_then_tempo',
    instructions: 'On your back, arms up, knees at 90°. Lower opposite arm and leg while keeping the lower back on the floor.' }),
  ex({ id: 'cat-cow', name: 'Cat-cow', muscleGroup: 'Spine', equipment: 'bodyweight', sets: 2, repMin: 10, repMax: 15, restSeconds: 30, progression: 'reps_then_tempo',
    instructions: 'On hands and knees, slowly round then arch the spine with your breath.' }),
  ex({ id: 'worlds-greatest-stretch', name: "World's greatest stretch", muscleGroup: 'Hips / T-spine', equipment: 'bodyweight', perSide: true, sets: 2, repMin: 5, repMax: 8, restSeconds: 30, progression: 'reps_then_tempo',
    instructions: 'Lunge forward, place the same-side hand inside the front foot, rotate the other arm to the ceiling.' }),
  ex({ id: 'hip-flexor-stretch', name: 'Hip flexor stretch', muscleGroup: 'Hips', equipment: 'bodyweight', unit: 'seconds', perSide: true, sets: 2, repMin: 30, repMax: 45, restSeconds: 30, progression: 'hold_time',
    instructions: 'Half-kneel, tuck the pelvis and gently shift forward until you feel a stretch in the front of the back hip.' }),
];

export const EXERCISES: Record<string, Exercise> = Object.fromEntries(LIST.map((e) => [e.id, e]));

export type WorkoutId = 'push_legs' | 'pull_posterior' | 'recovery' | 'upper' | 'legs_core' | 'full_body' | 'rest';

export type WorkoutTemplate = { id: WorkoutId; name: string; focus: string; exerciseIds: string[] };

export const WORKOUTS: Record<WorkoutId, WorkoutTemplate> = {
  push_legs: { id: 'push_legs', name: 'Push + Legs', focus: 'Chest, shoulders, triceps, quads',
    exerciseIds: ['push-up', 'pike-push-up', 'chair-dip', 'squat', 'reverse-lunge', 'calf-raise'] },
  pull_posterior: { id: 'pull_posterior', name: 'Pull + Posterior Chain', focus: 'Back, biceps, hamstrings, glutes',
    exerciseIds: ['backpack-row', 'prone-ytw', 'backpack-curl', 'single-leg-rdl', 'glute-bridge', 'superman'] },
  recovery: { id: 'recovery', name: 'Light Recovery', focus: 'Mobility and easy core work',
    exerciseIds: ['cat-cow', 'worlds-greatest-stretch', 'hip-flexor-stretch', 'dead-bug'] },
  upper: { id: 'upper', name: 'Upper Body', focus: 'Chest, back, shoulders, arms',
    exerciseIds: ['push-up', 'backpack-row', 'backpack-press', 'chair-dip', 'backpack-curl', 'prone-ytw'] },
  legs_core: { id: 'legs_core', name: 'Legs + Core', focus: 'Quads, hamstrings, calves, core',
    exerciseIds: ['bulgarian-split-squat', 'squat', 'single-leg-rdl', 'calf-raise', 'plank', 'dead-bug'] },
  full_body: { id: 'full_body', name: 'Full Body', focus: 'All major muscle groups',
    exerciseIds: ['push-up', 'squat', 'backpack-row', 'reverse-lunge', 'glute-bridge', 'plank'] },
  rest: { id: 'rest', name: 'Rest', focus: 'Recovery, meal prep, weekly review', exerciseIds: [] },
};

/** Adapted home plan, indexed by weekday (0 = Sunday). */
export const WEEKLY_SPLIT: WorkoutId[] = ['rest', 'push_legs', 'pull_posterior', 'recovery', 'upper', 'legs_core', 'full_body'];

/** Resolve a template to exercises the user can do with their equipment. */
export function exercisesFor(workoutId: WorkoutId, equipment: Equipment[]): Exercise[] {
  const out: Exercise[] = [];
  for (const id of WORKOUTS[workoutId].exerciseIds) {
    let e: Exercise | undefined = EXERCISES[id];
    while (e && !equipment.includes(e.equipment)) e = e.alternativeId ? EXERCISES[e.alternativeId] : undefined;
    if (e && !out.includes(e)) out.push(e);
  }
  return out;
}

/** Rough session length: ~40 s of work per set plus the prescribed rest. */
export const estimateMinutes = (exercises: Exercise[]) =>
  Math.round(exercises.reduce((m, e) => m + e.sets * (40 + e.restSeconds), 0) / 60);
