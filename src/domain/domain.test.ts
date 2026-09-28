/// <reference types="node" />
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createRepo, type KV } from '../data/repo.ts';
import { completion, dailyPlan, dayNumber, phaseFor } from './plan.ts';
import { DEFAULT_PROFILE, sleepMinutes, validateProfile, type UserProfile } from './profile.ts';
import { suggestProgression } from './progression.ts';
import { generateSchedule } from './schedule.ts';
import { addSet, createSession, finishSession, removeLastSet, sessionProgress, updateSet } from './session.ts';
import { addDays, isValidDateKey, weekdayOf } from './time.ts';
import { EXERCISES, exercisesFor } from './workouts.ts';

const profile: UserProfile = { ...DEFAULT_PROFILE, startDate: '2026-10-05', startWeightKg: 62 }; // a Monday

test('day number and phase come from the start date', () => {
  assert.equal(dayNumber('2026-10-05', '2026-10-05'), 1);
  assert.equal(dayNumber('2026-10-05', '2026-10-04'), 0);
  assert.equal(dayNumber('2026-10-05', addDays('2026-10-05', 89)), 90);
  assert.deepEqual([1, 30, 31, 60, 61, 90].map(phaseFor), [1, 1, 2, 2, 3, 3]);
  assert.equal(dailyPlan(profile, '2026-10-04').status, 'upcoming');
  assert.equal(dailyPlan(profile, addDays('2026-10-05', 90)).status, 'complete');
  assert.equal(dailyPlan(profile, addDays('2026-10-05', 45)).phase, 2);
});

test('dates', () => {
  assert.equal(weekdayOf('2026-10-05'), 1);
  assert.equal(addDays('2026-12-31', 1), '2027-01-01');
  assert.ok(isValidDateKey('2026-02-28'));
  assert.ok(!isValidDateKey('2026-02-30'));
});

test('default schedule reproduces the Winter Arc day', () => {
  const s = generateSchedule(profile, { training: true, officeDay: true, reviewDay: false });
  assert.deepEqual(s.map((i) => `${i.time} ${i.id}`), [
    '05:15 wake', '05:35 workout', '06:20 cooldown', '07:00 breakfast', '08:30 leave', '10:30 snack-am',
    '13:30 lunch', '17:00 snack-pm', '20:30 home', '20:45 dinner', '21:15 walk', '21:45 prep', '22:15 phone-down', '22:30 sleep',
  ]);
  assert.equal(sleepMinutes(profile), 405);
});

test('changing office hours regenerates the schedule', () => {
  const s = generateSchedule({ ...profile, leaveHomeTime: '09:30', returnHomeTime: '19:00' }, { training: true, officeDay: true, reviewDay: false });
  const t = Object.fromEntries(s.map((i) => [i.id, i.time]));
  assert.equal(t.lunch, '14:30');
  assert.equal(t.dinner, '19:15');
  assert.equal(t.walk, '19:45');
});

test('bedtime after midnight still sorts last', () => {
  const s = generateSchedule({ ...profile, bedTime: '00:15' }, { training: false, officeDay: true, reviewDay: false });
  assert.equal(s.at(-1)!.id, 'sleep');
});

test('weekly split follows the adapted home plan', () => {
  const names = [0, 1, 2, 3, 4, 5, 6].map((i) => dailyPlan(profile, addDays('2026-10-04', i)).workoutId);
  assert.deepEqual(names, ['rest', 'push_legs', 'pull_posterior', 'recovery', 'upper', 'legs_core', 'full_body']);
  const sunday = dailyPlan(profile, '2026-10-04');
  assert.ok(!sunday.tasks.some((t) => t.id === 'workout' || t.id === 'leave'));
  assert.ok(sunday.tasks.some((t) => t.id === 'review'));
  assert.equal(dailyPlan({ ...profile, trainingDays: [2] }, '2026-10-05').workoutId, 'rest');
});

test('missing equipment swaps in alternatives', () => {
  const ids = exercisesFor('upper', ['bodyweight']).map((e) => e.id);
  assert.ok(!ids.includes('backpack-row') && !ids.includes('chair-dip') && !ids.includes('backpack-curl'));
  assert.ok(ids.includes('prone-ytw') && ids.includes('close-grip-push-up'));
  assert.equal(new Set(ids).size, ids.length);
});

test('completion counts only checkable tasks', () => {
  const plan = dailyPlan(profile, '2026-10-05');
  const c = completion(plan.tasks, ['workout', 'breakfast', 'wake']);
  assert.equal(c.done, 2);
  assert.equal(c.total, plan.tasks.length - 3); // wake, leave, home excluded
  assert.equal(completion(dailyPlan(profile, '2026-10-05', true).tasks, []).total, 4);
});

test('set logging and completion', () => {
  let s = createSession('2026-10-05', 'push_legs', profile.equipment, { 'push-up': [{ setNumber: 1, reps: 12, loadKg: 2, completed: true }] });
  assert.equal(s.exercises[0].sets[2].reps, 12); // prefilled from last time
  assert.equal(s.exercises[1].sets[0].reps, EXERCISES['pike-push-up'].repMin);
  s = updateSet(s, 0, 0, { reps: 13, completed: true });
  assert.equal(s.status, 'in_progress');
  s = updateSet(s, 0, 1, { loadKg: -3, rir: 9 });
  assert.equal(s.exercises[0].sets[1].loadKg, 0);
  assert.equal(s.exercises[0].sets[1].rir, 5);
  s = addSet(s, 0);
  assert.equal(s.exercises[0].sets.length, 4);
  s = removeLastSet(s, 0);
  assert.equal(s.exercises[0].sets.length, 3);
  assert.deepEqual(sessionProgress(s), { done: 1, total: 18 });
  assert.equal(finishSession(s, 'completed').status, 'completed');
});

test('progression suggestions', () => {
  const sets = (reps: number[], loadKg = 0) => reps.map((r, i) => ({ setNumber: i + 1, reps: r, loadKg, completed: true }));
  const pushUp = EXERCISES['push-up'];
  assert.equal(suggestProgression({ ...pushUp, repMax: 15 }, sets([12, 12, 11])).message, 'Keep load and attempt 13 / 12 / 12.');
  assert.equal(suggestProgression(pushUp, sets([12, 12, 11], 5)).message, 'Keep 5 kg and attempt 13 / 12 / 12.');
  assert.equal(suggestProgression(pushUp, sets([15, 15, 15])).kind, 'load');
  assert.equal(suggestProgression(EXERCISES['pike-push-up'], sets([12, 12, 12])).kind, 'variation');
  assert.equal(suggestProgression(pushUp, undefined).kind, 'start');
  assert.equal(suggestProgression(pushUp, sets([14, 15, 15])).message, 'Keep load and attempt 15 / 15 / 15.');
});

test('profile validation', () => {
  assert.deepEqual(validateProfile(profile), {});
  const e = validateProfile({ ...profile, startDate: 'x', startWeightKg: 0, wakeTime: '5:15', returnHomeTime: '08:00', equipment: [] });
  assert.deepEqual(Object.keys(e).sort(), ['equipment', 'returnHomeTime', 'startDate', 'startWeightKg', 'wakeTime']);
});

test('persistence keeps previous performance across edits', async () => {
  const m = new Map<string, string>();
  const kv: KV = { getItem: async (k) => m.get(k) ?? null, setItem: async (k, v) => void m.set(k, v), clear: async () => m.clear() };
  const repo = createRepo(kv);
  await repo.saveProfile(profile);
  assert.deepEqual(await repo.getProfile(), profile);

  const done = (date: string, reps: number) => {
    const s = createSession(date, 'push_legs', profile.equipment, {});
    return finishSession(updateSet(s, 0, 0, { reps, completed: true }), 'completed');
  };
  await repo.saveSession(done('2026-10-05', 10));
  await repo.saveSession(done('2026-10-12', 11));
  await repo.saveSession(done('2026-10-12', 12)); // edit today again
  assert.equal((await repo.getPreviousSets(['push-up'], '2026-10-12'))['push-up']![0].reps, 10);
  assert.equal((await repo.getPreviousSets(['push-up'], '2026-10-19'))['push-up']![0].reps, 12);
  assert.equal((await repo.getSession('2026-10-12'))!.exercises[0].sets[0].reps, 12);

  assert.deepEqual(await repo.getDayLog('2026-10-05'), { date: '2026-10-05', done: [], minimal: false });
  await repo.clearAll();
  assert.equal(await repo.getProfile(), undefined);
});
