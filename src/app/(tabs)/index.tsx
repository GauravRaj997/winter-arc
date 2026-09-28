import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, Switch, View } from 'react-native';
import { ProgressRing } from '../../components/ProgressRing';
import { Banner, Button, Card, CheckButton, Row, Screen, Txt, type IconName } from '../../components/ui';
import { checkable, completion, dailyPlan, PHASES, PLAN_DAYS } from '../../domain/plan';
import type { ScheduleItem, ScheduleKind } from '../../domain/schedule';
import { sessionProgress } from '../../domain/session';
import { formatDate, formatTime, toMinutes } from '../../domain/time';
import { WORKOUTS } from '../../domain/workouts';
import { useDay, useToday } from '../../state/hooks';
import { useProfile } from '../../state/profile';
import { colors, phaseColor, radius, space } from '../../theme';

const KIND_ICON: Record<ScheduleKind, IconName> = {
  wake: 'sunny-outline', workout: 'barbell-outline', meal: 'restaurant-outline', commute: 'bus-outline',
  walk: 'walk-outline', routine: 'checkbox-outline', sleep: 'moon-outline',
};

export default function Today() {
  const { profile } = useProfile();
  const today = useToday();
  const { log, session, error, toggle, setMinimal } = useDay(today);
  if (!profile) return null;

  const plan = dailyPlan(profile, today, log?.minimal);
  const phase = PHASES[plan.phase];
  const workoutDone = session?.status === 'completed';
  const done = [...(log?.done ?? []), ...(workoutDone ? ['workout'] : [])];
  const c = completion(plan.tasks, done);
  const now = new Date().getHours() * 60 + new Date().getMinutes();
  const open = checkable(plan.tasks).filter((t) => !done.includes(t.id));
  const next = open.find((t) => t.time && toMinutes(t.time) >= now) ?? open[0];
  const workout = WORKOUTS[plan.workoutId];
  const progress = session ? sessionProgress(session) : undefined;

  return (
    <Screen>
      <View style={{ gap: space.xs }}>
        <Txt variant="caption">{formatDate(today)}{profile.name ? ` · ${profile.name}` : ''}</Txt>
        {plan.status === 'upcoming' ? (
          <Txt variant="display">Starts in {1 - plan.dayNumber} {1 - plan.dayNumber === 1 ? 'day' : 'days'}</Txt>
        ) : (
          <Txt variant="display">Day {plan.dayNumber}{plan.status === 'active' ? ` of ${PLAN_DAYS}` : ''}</Txt>
        )}
        <Txt variant="h3" color={phaseColor[plan.phase]}>
          {plan.status === 'complete' ? '90 days complete · keep the habits going' : `Phase ${plan.phase} · ${phase.name}`}
        </Txt>
      </View>

      {error && <Banner tone="error"><Txt>{error}</Txt></Banner>}

      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: space.lg }}>
        <ProgressRing ratio={c.ratio} label={`Today ${c.done} of ${c.total} tasks done`}>
          <Txt variant="h2">{Math.round(c.ratio * 100)}%</Txt>
        </ProgressRing>
        <View style={{ flex: 1, gap: space.xs }}>
          <Txt variant="h3">{c.done} of {c.total} tasks</Txt>
          {next ? (
            <Txt color={colors.muted}>Next: {next.label}{next.time ? ` · ${formatTime(next.time)}` : ''}</Txt>
          ) : (
            <Txt color={colors.success}>Day complete. Well done.</Txt>
          )}
        </View>
      </Card>

      {!log?.minimal && (
        <Card>
          <Row style={{ justifyContent: 'space-between' }}>
            <Txt variant="caption" color={colors.primary}>MORNING WORKOUT</Txt>
            {workoutDone && <Txt variant="caption" color={colors.success}>✓ Completed</Txt>}
            {session?.status === 'skipped' && <Txt variant="caption">Skipped</Txt>}
          </Row>
          <Txt variant="h2">{workout.name}</Txt>
          <Txt color={colors.muted}>{plan.workoutId === 'rest' ? 'Rest day. Recovery is part of the plan.' : workout.focus}</Txt>
          {plan.workoutId !== 'rest' && (
            <Button
              label={workoutDone ? 'View workout' : progress?.done ? `Continue · ${progress.done}/${progress.total} sets` : 'Start workout'}
              icon={workoutDone ? 'eye-outline' : 'play'}
              variant={workoutDone ? 'secondary' : 'primary'}
              onPress={() => router.navigate('/workout')}
            />
          )}
        </Card>
      )}

      <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1, gap: 2 }}>
          <Txt variant="h3">Low-energy day</Txt>
          <Txt variant="caption">Mobility, a short walk, one protein meal, sleep on time. Continuity counts.</Txt>
        </View>
        <Switch
          accessibilityLabel="Low-energy day"
          value={!!log?.minimal}
          onValueChange={setMinimal}
          trackColor={{ true: colors.primary, false: colors.surface2 }}
          thumbColor={colors.text}
        />
      </Card>

      <View style={{ gap: space.sm }}>
        <Txt variant="h3">Today's plan</Txt>
        {plan.tasks.map((t) => (
          <TaskRow key={t.id} task={t} done={done.includes(t.id)}
            onPress={t.id === 'workout' ? () => router.navigate('/workout') : checkable([t]).length ? () => toggle(t.id) : undefined} />
        ))}
      </View>

      <Card>
        <Txt variant="caption" color={phaseColor[plan.phase]}>PHASE {plan.phase} · DAYS {phase.from}–{phase.to}</Txt>
        <Txt variant="h3">{phase.name}</Txt>
        <Txt color={colors.muted}>{phase.objective}</Txt>
        <View style={{ height: 8, borderRadius: radius.pill, backgroundColor: colors.surface2, overflow: 'hidden' }}
          accessibilityRole="progressbar" accessibilityLabel={`90-day progress, day ${Math.max(0, plan.dayNumber)}`}>
          <View style={{ height: 8, width: `${Math.min(100, Math.max(0, plan.dayNumber) / PLAN_DAYS * 100)}%`, backgroundColor: phaseColor[plan.phase] }} />
        </View>
        <Txt variant="caption">{Math.min(PLAN_DAYS, Math.max(0, plan.dayNumber))} of {PLAN_DAYS} days</Txt>
      </Card>
    </Screen>
  );
}

function TaskRow({ task, done, onPress }: { task: ScheduleItem; done: boolean; onPress?: () => void }) {
  const anchor = !onPress;
  return (
    <Pressable
      disabled={anchor}
      onPress={onPress}
      accessibilityRole={task.id === 'workout' ? 'button' : 'checkbox'}
      accessibilityState={{ checked: done }}
      accessibilityLabel={`${task.label}${task.time ? ` at ${formatTime(task.time)}` : ''}`}
      style={{ flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 52, paddingHorizontal: space.md,
        borderRadius: radius.md, backgroundColor: anchor ? 'transparent' : colors.surface, borderWidth: anchor ? 0 : 1, borderColor: colors.border }}
    >
      <Txt variant="caption" style={{ width: 64 }}>{task.time ? formatTime(task.time) : ''}</Txt>
      <Ionicons name={KIND_ICON[task.kind]} size={18} color={anchor ? colors.muted : colors.primary} />
      <Txt style={{ flex: 1, color: anchor ? colors.muted : colors.text, textDecorationLine: done ? 'line-through' : 'none' }}>{task.label}</Txt>
      {task.id === 'workout' && !done ? (
        <Ionicons name="chevron-forward" size={20} color={colors.muted} />
      ) : !anchor ? (
        <CheckButton checked={done} onPress={onPress!} label={`Mark ${task.label} ${done ? 'not done' : 'done'}`} />
      ) : null}
    </Pressable>
  );
}
