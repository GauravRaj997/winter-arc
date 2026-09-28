import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, Switch, View } from 'react-native';
import { DayMap } from '../../components/DayMap';
import { PhaseArc } from '../../components/PhaseArc';
import { ProgressRing } from '../../components/ProgressRing';
import { Banner, Button, Card, CheckButton, Row, Screen, Txt, type IconName } from '../../components/ui';
import { repo } from '../../data';
import { checkable, completion, dailyPlan, dayNumber, PHASES, pillarCompletion, pillarOf, PILLARS, PLAN_DAYS, type Pillar } from '../../domain/plan';
import type { ScheduleItem, ScheduleKind } from '../../domain/schedule';
import { sessionProgress } from '../../domain/session';
import { addDays, formatDate, formatTime, toMinutes } from '../../domain/time';
import { estimateMinutes, exercisesFor, WORKOUTS } from '../../domain/workouts';
import { useDay, useToday } from '../../state/hooks';
import { useProfile } from '../../state/profile';
import { colors, phaseColor, pillarColor, radius, space, tint, type as t } from '../../theme';

const KIND_ICON: Record<ScheduleKind, IconName> = {
  wake: 'sunny-outline', workout: 'barbell-outline', meal: 'restaurant-outline', commute: 'bus-outline',
  walk: 'walk-outline', routine: 'checkbox-outline', sleep: 'moon-outline',
};
const PILLAR_UI: Record<Pillar, { label: string; icon: IconName }> = {
  train: { label: 'Train', icon: 'barbell-outline' },
  food: { label: 'Food', icon: 'restaurant-outline' },
  sleep: { label: 'Sleep', icon: 'moon-outline' },
  move: { label: 'Move', icon: 'walk-outline' },
};
const colorOf = (task: ScheduleItem) => { const p = pillarOf(task); return p ? pillarColor[p] : colors.muted; };

const inLabel = (min: number) =>
  min <= 0 ? 'Now' : min < 60 ? `In ${min} min` : `In ${Math.floor(min / 60)} h${min % 60 ? ` ${min % 60} min` : ''}`;

export default function Today() {
  const { profile } = useProfile();
  const today = useToday();
  const { log, session, error, toggle, setMinimal } = useDay(today);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [showAll, setShowAll] = useState(false);

  useFocusEffect(useCallback(() => { repo.getDayScores().then(setScores, () => {}); }, []));

  const plan = profile && dailyPlan(profile, today, log?.minimal);
  const workoutDone = session?.status === 'completed';
  const done = [...(log?.done ?? []), ...(workoutDone ? ['workout'] : [])];
  const c = plan ? completion(plan.tasks, done) : undefined;

  // Keep the 90-day map index in step with today's progress.
  useEffect(() => {
    if (log && c && plan?.status === 'active') repo.saveDayScore(today, c.ratio).catch(() => {});
  }, [log, c?.ratio, today, plan?.status]);

  if (!profile || !plan || !c) return null;

  const phase = PHASES[plan.phase];
  const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
  const open = checkable(plan.tasks).filter((x) => !done.includes(x.id));
  const nowIdx = Math.max(0, open.findIndex((x) => x.time && toMinutes(x.time) >= nowMin));
  const next = open[nowIdx];
  const upNext = open.filter((x) => x !== next).filter((x) => !x.time || toMinutes(x.time) >= nowMin).slice(0, 3);
  const workout = WORKOUTS[plan.workoutId];
  const exercises = exercisesFor(plan.workoutId, profile.equipment);
  const progress = session ? sessionProgress(session) : undefined;
  const workoutPending = plan.workoutId !== 'rest' && !workoutDone && !log?.minimal;
  const pillars = pillarCompletion(plan.tasks, done);
  const mapScores = { ...scores, [today]: c.ratio };
  const activeDays = Object.entries(mapScores).filter(([d, r]) => r > 0 && d >= profile.startDate && d <= addDays(profile.startDate, PLAN_DAYS - 1)).length;
  const workoutLabel = progress?.done ? `Continue · ${progress.done}/${progress.total} sets` : 'Start workout';

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between' }}>
        <Txt variant="label">Winter Arc</Txt>
        <Txt variant="caption">{formatDate(today)}{profile.name ? ` · ${profile.name}` : ''}</Txt>
      </Row>

      <PhaseArc day={plan.dayNumber}>
        {plan.status === 'upcoming' ? (
          <>
            <Txt style={t.hero}>{1 - plan.dayNumber} {1 - plan.dayNumber === 1 ? 'day' : 'days'}</Txt>
            <Txt variant="caption">until your arc begins</Txt>
          </>
        ) : (
          <>
            <Txt style={t.hero}>Day {Math.min(plan.dayNumber, PLAN_DAYS)}</Txt>
            <Txt variant="caption">
              {plan.status === 'complete' ? '90 days complete · keep the habits going' : <>of {PLAN_DAYS} · <Txt variant="caption" color={phaseColor[plan.phase]}>{phase.name}</Txt></>}
            </Txt>
          </>
        )}
      </PhaseArc>

      {error && <Banner tone="error"><Txt>{error}</Txt></Banner>}

      {next ? (
        <View style={{ backgroundColor: colors.nowBg, borderColor: tint(colors.primary, 0.35), borderWidth: 1, borderRadius: radius.xl, padding: space.lg, gap: space.md }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <View style={{ backgroundColor: colors.primaryTint, borderRadius: radius.pill, paddingHorizontal: space.sm, paddingVertical: 3 }}>
              <Txt variant="label" color={colors.primarySoft}>{next.time ? inLabel(toMinutes(next.time) - nowMin) : 'Now'}</Txt>
            </View>
            {next.time ? <Txt variant="caption">{formatTime(next.time)}</Txt> : null}
          </Row>
          <Row style={{ gap: space.md, flexWrap: 'nowrap' }}>
            <View style={{ width: 44, height: 44, borderRadius: radius.md, backgroundColor: tint(colorOf(next), 0.15), alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={KIND_ICON[next.kind]} size={22} color={colorOf(next)} />
            </View>
            <View style={{ flex: 1 }}>
              <Txt variant="h2">{next.id === 'workout' ? workout.name : next.label}</Txt>
              <Txt variant="caption">
                {next.id === 'workout' ? `${exercises.length} exercises · ~${estimateMinutes(exercises)} min` : pillarOf(next) ? `${PILLAR_UI[pillarOf(next)!].label} · counts toward today` : 'Routine'}
              </Txt>
            </View>
          </Row>
          {next.id === 'workout'
            ? <Button label={workoutLabel} icon="play" onPress={() => router.navigate('/workout')} />
            : <Button label="Mark done" icon="checkmark" onPress={() => toggle(next.id)} />}
        </View>
      ) : (
        <Card style={{ alignItems: 'center' }}>
          <Ionicons name="checkmark-circle" size={32} color={colors.success} />
          <Txt variant="h2">Day complete</Txt>
          <Txt variant="caption">Every task is done. Rest well.</Txt>
        </Card>
      )}

      {workoutPending && next?.id !== 'workout' && (
        <Pressable onPress={() => router.navigate('/workout')} accessibilityRole="button"
          style={{ flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 52, paddingHorizontal: space.lg, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}>
          <Ionicons name="barbell-outline" size={18} color={colors.primary} />
          <Txt style={{ flex: 1 }}>{workout.name} <Txt variant="caption">· {progress?.done ? `${progress.done}/${progress.total} sets` : 'not started yet'}</Txt></Txt>
          <Txt variant="h3" color={colors.primary}>{progress?.done ? 'Continue' : 'Start'} ›</Txt>
        </Pressable>
      )}

      <View style={{ flexDirection: 'row', gap: space.sm }}>
        {PILLARS.map((p) => {
          const v = pillars[p];
          return (
            <View key={p} style={{ flex: 1, alignItems: 'center', gap: space.xs, paddingVertical: space.md, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border }}>
              <ProgressRing ratio={v.ratio} size={48} stroke={4} color={pillarColor[p]} track={tint(pillarColor[p], 0.18)} label={`${PILLAR_UI[p].label} ${v.done} of ${v.total}`}>
                <Ionicons name={PILLAR_UI[p].icon} size={17} color={pillarColor[p]} />
              </ProgressRing>
              <Txt variant="caption" color={colors.text}>{PILLAR_UI[p].label}</Txt>
              <Txt variant="caption" style={{ fontSize: 10 }}>{v.total ? `${v.done}/${v.total}` : '–'}</Txt>
            </View>
          );
        })}
      </View>

      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <Txt variant="h3">{showAll ? "Today's plan" : 'Up next'}</Txt>
          <Txt variant="caption">{c.done} of {c.total} done</Txt>
        </Row>
        <View>
          {(showAll ? plan.tasks : upNext).map((task, i, arr) => (
            <TimelineRow key={task.id} task={task} done={done.includes(task.id)} first={i === 0} last={i === arr.length - 1}
              onPress={task.id === 'workout' ? () => router.navigate('/workout') : checkable([task]).length ? () => toggle(task.id) : undefined} />
          ))}
          {!showAll && upNext.length === 0 && <Txt variant="caption">Nothing else scheduled for later today.</Txt>}
        </View>
        <Pressable onPress={() => setShowAll(!showAll)} accessibilityRole="button" style={{ minHeight: 40, justifyContent: 'center' }}>
          <Txt variant="caption" color={colors.primary}>{showAll ? 'Show less' : `Show full day · ${plan.tasks.length} items`}</Txt>
        </Pressable>
      </Card>

      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <Txt variant="h3">90-day map</Txt>
          <Txt variant="caption">{activeDays} active {activeDays === 1 ? 'day' : 'days'}</Txt>
        </Row>
        <DayMap startDate={profile.startDate} today={dayNumber(profile.startDate, today)} scores={mapScores} />
        <Txt variant="caption" style={{ fontSize: 10 }}>Solid: most of the day done · Soft: part of the day · Outline: today</Txt>
      </Card>

      <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1, gap: 2 }}>
          <Txt variant="h3">Low-energy day</Txt>
          <Txt variant="caption">Mobility, a short walk, one protein meal, sleep on time. Continuity counts.</Txt>
        </View>
        <Switch accessibilityLabel="Low-energy day" value={!!log?.minimal} onValueChange={setMinimal}
          trackColor={{ true: colors.primary, false: colors.surface2 }} thumbColor={colors.text} />
      </Card>
    </Screen>
  );
}

function TimelineRow({ task, done, first, last, onPress }: { task: ScheduleItem; done: boolean; first: boolean; last: boolean; onPress?: () => void }) {
  const color = colorOf(task);
  return (
    <View style={{ flexDirection: 'row', gap: space.md, minHeight: 52 }}>
      <View style={{ width: 14, alignItems: 'center' }}>
        {!(first && last) && (
          <View style={{ position: 'absolute', width: 1.5, backgroundColor: colors.border, top: first ? 26 : 0, ...(last ? { height: 26 } : { bottom: 0 }) }} />
        )}
        <View style={{ width: 12, height: 12, borderRadius: 6, marginTop: 20, borderWidth: 2, borderColor: onPress ? color : colors.border, backgroundColor: done ? color : colors.bg }} />
      </View>
      <Pressable disabled={!onPress} onPress={onPress} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: space.sm }}
        accessibilityRole={task.id === 'workout' ? 'button' : 'checkbox'} accessibilityState={{ checked: done }}
        accessibilityLabel={`${task.label}${task.time ? ` at ${formatTime(task.time)}` : ''}`}>
        <Txt style={{ flex: 1, color: onPress ? colors.text : colors.muted, textDecorationLine: done ? 'line-through' : 'none' }}>{task.label}</Txt>
        {task.time ? <Txt variant="caption" style={{ fontVariant: ['tabular-nums'] }}>{formatTime(task.time)}</Txt> : null}
        {task.id === 'workout' && !done ? <Ionicons name="chevron-forward" size={18} color={colors.muted} />
          : onPress ? <CheckButton checked={done} onPress={onPress} label={`Mark ${task.label} ${done ? 'not done' : 'done'}`} /> : <View style={{ width: 44 }} />}
      </Pressable>
    </View>
  );
}
