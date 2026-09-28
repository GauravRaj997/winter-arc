import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { ActivityIndicator, Pressable, TextInput, View } from 'react-native';
import { ExerciseCard } from '../../components/ExerciseCard';
import { FocusSet } from '../../components/FocusSet';
import { RestRing, RestTimer, type Rest } from '../../components/RestTimer';
import { Banner, Button, Card, Chip, Row, Screen, Txt } from '../../components/ui';
import { dailyPlan } from '../../domain/plan';
import { beepCount } from '../../domain/profile';
import {
  addSet, finishSession, hasLoggedSets, nextOpenSet, removeLastSet, reopenSession, sessionProgress, statusCue, updateSet, type WorkoutSession,
} from '../../domain/session';
import { formatDate } from '../../domain/time';
import { estimateMinutes, EXERCISES, WORKOUTS, type Exercise, type WorkoutId } from '../../domain/workouts';
import { beep } from '../../services/beeper';
import { useToday, useWorkout } from '../../state/hooks';
import { useProfile } from '../../state/profile';
import { colors, radius, space, tint } from '../../theme';

const CHOICES = (Object.keys(WORKOUTS) as WorkoutId[]).filter((id) => id !== 'rest');

export default function Workout() {
  const { profile } = useProfile();
  const today = useToday();
  const planned = profile ? dailyPlan(profile, today).workoutId : 'rest';
  const { session, previous, error, update: save, switchTo } = useWorkout(today, planned, profile?.equipment ?? ['bodyweight']);
  const [rest, setRest] = useState<Rest | null>(null);
  const [mode, setMode] = useState<'focus' | 'list'>('focus');
  const [sel, setSel] = useState<{ ex: number; set: number } | null>(null);
  const [safety, setSafety] = useState(false);
  const [notes, setNotes] = useState<string>();
  const beeps = profile ? beepCount(profile) : 0;

  /** Every session change goes through here so start/finish beep automatically. */
  const update = (next: WorkoutSession) => {
    if (session && statusCue(session.status, next.status)) beep(beeps);
    save(next);
  };
  const startRest = (sec: number) => setRest({ endsAt: Date.now() + sec * 1000, total: sec });
  const restProps = {
    onAdd: () => setRest((r) => r && { endsAt: r.endsAt + 15_000, total: r.total + 15 }),
    onSkip: () => setRest(null),
    onDone: () => { beep(beeps); setRest(null); },
  };

  if (!session) {
    return <Screen>{error ? <Banner tone="error"><Txt>{error}</Txt></Banner> : <ActivityIndicator color={colors.primary} />}</Screen>;
  }

  const workout = WORKOUTS[session.workoutType];
  const exercises = session.exercises.map((l) => EXERCISES[l.exerciseId]).filter(Boolean) as Exercise[];
  const progress = sessionProgress(session);
  const locked = hasLoggedSets(session);
  const finished = session.status === 'completed' || session.status === 'skipped';
  const current = (sel && session.exercises[sel.ex]?.sets[sel.set] ? sel : null) ?? nextOpenSet(session);
  const finish = (status: 'completed' | 'skipped', extraNote?: string) => {
    setRest(null);
    setSel(null);
    update(finishSession({ ...session, notes: [notes ?? session.notes, extraNote].filter(Boolean).join('\n') || undefined }, status));
  };

  const picker = !locked && !finished && (
    <View style={{ gap: space.sm }}>
      <Txt variant="caption">{session.workoutType === 'rest' ? 'Want to move anyway? Pick a session:' : 'Doing a different day? Swap before logging:'}</Txt>
      <Row>{CHOICES.map((id) => <Chip key={id} label={WORKOUTS[id].name} selected={session.workoutType === id} onPress={() => switchTo(id)} />)}</Row>
    </View>
  );

  if (session.workoutType === 'rest') {
    return (
      <Screen>
        <Txt variant="label">{formatDate(today)}</Txt>
        <Txt variant="display">Rest day</Txt>
        <Card>
          <Ionicons name="leaf-outline" size={24} color={colors.success} />
          <Txt color={colors.muted}>Recovery is part of the plan. A walk, meal prep and your weekly review are enough today.</Txt>
        </Card>
        {picker}
      </Screen>
    );
  }

  const notesInput = (
    <TextInput
      accessibilityLabel="Workout notes"
      multiline
      value={notes ?? session.notes ?? ''}
      onChangeText={setNotes}
      onBlur={() => notes !== undefined && notes !== (session.notes ?? '') && update({ ...session, notes })}
      placeholder="Form cues, energy, anything worth remembering"
      placeholderTextColor={colors.muted}
      style={{ minHeight: 80, color: colors.text, backgroundColor: colors.surface2, borderRadius: radius.md, padding: space.md, fontSize: 16, textAlignVertical: 'top' }}
    />
  );

  const topBar = (
    <Row style={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}>
      <View style={{ flex: 1 }}>
        <Txt variant="label">{workout.name}</Txt>
        {session.workoutType !== planned && <Txt variant="caption">Planned today: {WORKOUTS[planned].name}</Txt>}
      </View>
      <Pressable onPress={() => setMode(mode === 'focus' ? 'list' : 'focus')} accessibilityRole="button"
        style={{ flexDirection: 'row', alignItems: 'center', gap: space.xs, minHeight: 44, paddingHorizontal: space.sm }}>
        <Ionicons name={mode === 'focus' ? 'list-outline' : 'scan-outline'} size={16} color={colors.muted} />
        <Txt variant="caption">{mode === 'focus' ? 'List view' : 'Focus view'}</Txt>
      </Pressable>
    </Row>
  );

  const segments = (
    <View style={{ flexDirection: 'row', gap: 4 }}>
      {session.exercises.map((l, i) => {
        const done = l.sets.every((x) => x.completed);
        return (
          <Pressable key={l.exerciseId} style={{ flex: 1, height: 24, justifyContent: 'center' }} accessibilityRole="button"
            accessibilityLabel={`${EXERCISES[l.exerciseId]?.name}${done ? ', done' : ''}`}
            onPress={() => { const j = l.sets.findIndex((x) => !x.completed); setSel({ ex: i, set: j < 0 ? 0 : j }); setRest(null); }}>
            <View style={{ height: 5, borderRadius: 3, backgroundColor: done ? colors.success : current?.ex === i ? colors.primary : colors.border }} />
          </Pressable>
        );
      })}
    </View>
  );

  const safetyBlock = safety ? (
    <Banner tone="safety">
      <Txt variant="h3">Stop the exercise and rest.</Txt>
      <Txt color={colors.muted}>
        If you have chest pain, fainting, dizziness, unusual shortness of breath, or significant pain or injury, stop training today and seek medical help if it doesn't settle quickly. Your progress is kept — you can resume when you feel well.
      </Txt>
      <Row>
        {!finished && <Button label="End session for today" variant="secondary" onPress={() => { setSafety(false); finish('skipped', 'Stopped: felt unwell / pain'); }} />}
        <Button label="Dismiss" variant="ghost" onPress={() => setSafety(false)} />
      </Row>
    </Banner>
  ) : (
    <Button label="Pain or feeling unwell?" icon="medkit-outline" variant="ghost" onPress={() => setSafety(true)} />
  );

  let body;
  if (mode === 'list') {
    body = (
      <>
        <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Txt variant="h3">{progress.done} of {progress.total} sets</Txt>
            <Txt variant="caption">{statusText(session.status)}</Txt>
          </View>
          {session.status === 'planned' && <Button label="Start" icon="play" onPress={() => update({ ...session, status: 'in_progress' })} />}
          {finished && <Button label={session.status === 'skipped' ? 'Resume' : 'Edit'} variant="secondary" onPress={() => update(reopenSession(session))} />}
        </Card>
        {picker}
        {session.exercises.map((log, i) => {
          const e = EXERCISES[log.exerciseId];
          return e ? (
            <ExerciseCard key={log.exerciseId} exercise={e} log={log} previous={previous[log.exerciseId]} readOnly={finished}
              onSet={(j, patch) => { update(updateSet(session, i, j, patch)); if (patch.completed) startRest(e.restSeconds); }}
              onAddSet={() => update(addSet(session, i))}
              onRemoveSet={() => update(removeLastSet(session, i))} />
          ) : null;
        })}
        <Card><Txt variant="h3">Notes</Txt>{notesInput}</Card>
        {!finished && (
          <View style={{ gap: space.sm }}>
            <Button label="Complete workout" icon="checkmark-done" onPress={() => finish('completed')} />
            <Button label="Skip today" variant="ghost" onPress={() => finish('skipped')} />
          </View>
        )}
      </>
    );
  } else if (session.status === 'planned') {
    body = (
      <>
        <Card style={{ gap: space.lg }}>
          <View style={{ gap: space.xs }}>
            <Txt variant="display">{workout.name}</Txt>
            <Txt color={colors.muted}>{workout.focus}</Txt>
            <Txt variant="caption">{exercises.length} exercises · ~{estimateMinutes(exercises)} min</Txt>
          </View>
          <View style={{ gap: space.sm }}>
            {exercises.map((e, i) => (
              <Row key={e.id} style={{ flexWrap: 'nowrap', gap: space.md }}>
                <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center' }}>
                  <Txt variant="caption" color={colors.primarySoft}>{i + 1}</Txt>
                </View>
                <Txt style={{ flex: 1 }}>{e.name}</Txt>
                <Txt variant="caption">{e.sets} × {e.repMin}–{e.repMax}{e.unit === 'seconds' ? ' s' : ''}</Txt>
              </Row>
            ))}
          </View>
          <Button label="Start workout" icon="play" onPress={() => update({ ...session, status: 'in_progress' })} style={{ minHeight: 60, borderRadius: 20 }} />
        </Card>
        {picker}
      </>
    );
  } else if (finished) {
    body = (
      <Card style={{ alignItems: 'center', gap: space.md }}>
        <Ionicons name={session.status === 'completed' ? 'checkmark-circle' : 'pause-circle-outline'} size={48} color={session.status === 'completed' ? colors.success : colors.muted} />
        <Txt variant="display">{session.status === 'completed' ? 'Workout complete' : 'Skipped today'}</Txt>
        <Txt variant="caption">{progress.done} of {progress.total} sets logged{session.status === 'skipped' ? ' · resume whenever you are ready' : ''}</Txt>
        {session.notes ? <Txt color={colors.muted} style={{ textAlign: 'center' }}>{session.notes}</Txt> : null}
        <Button label={session.status === 'skipped' ? 'Resume' : 'Edit sets'} variant="secondary" onPress={() => update(reopenSession(session))} style={{ alignSelf: 'stretch' }} />
      </Card>
    );
  } else if (rest) {
    const up = nextOpenSet(session);
    const upEx = up && EXERCISES[session.exercises[up.ex].exerciseId];
    body = (
      <RestRing rest={rest} beeps={beeps} {...restProps}>
        {up && upEx && (
          <Card>
            <Txt variant="label">Up next</Txt>
            <Row style={{ flexWrap: 'nowrap', gap: space.md }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="arrow-up-circle-outline" size={22} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Txt variant="h3">{upEx.name} · Set {up.set + 1}</Txt>
                <Txt variant="caption">Aim for {session.exercises[up.ex].sets[up.set].reps} {upEx.unit === 'seconds' ? 's' : 'reps'}</Txt>
              </View>
            </Row>
          </Card>
        )}
      </RestRing>
    );
  } else if (current) {
    const e = exercises[current.ex];
    const nextEx = exercises[current.ex + 1];
    body = (
      <>
        {segments}
        <FocusSet
          key={`${current.ex}`}
          exercise={e}
          log={session.exercises[current.ex]}
          setIdx={current.set}
          position={`Exercise ${current.ex + 1} of ${exercises.length}`}
          previous={previous[e.id]}
          onSet={(patch) => update(updateSet(session, current.ex, current.set, patch))}
          onSelectSet={(i) => setSel({ ex: current.ex, set: i })}
          onAddSet={() => { update(addSet(session, current.ex)); setSel({ ex: current.ex, set: session.exercises[current.ex].sets.length }); }}
          onLog={() => {
            const wasDone = session.exercises[current.ex].sets[current.set].completed;
            const next = updateSet(session, current.ex, current.set, { completed: true });
            update(next);
            setSel(null);
            if (!wasDone && nextOpenSet(next)) startRest(e.restSeconds);
          }}
        />
        {nextEx && (
          <Row style={{ flexWrap: 'nowrap', padding: space.md, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}>
            <Txt variant="caption">Next</Txt>
            <Txt style={{ flex: 1 }}>{nextEx.name} · {nextEx.sets} × {nextEx.repMin}–{nextEx.repMax}</Txt>
          </Row>
        )}
        <Row style={{ justifyContent: 'center' }}>
          <Button label="Finish early" variant="ghost" onPress={() => finish('completed')} />
          <Button label="Skip today" variant="ghost" onPress={() => finish('skipped')} />
        </Row>
      </>
    );
  } else {
    body = (
      <>
        {segments}
        <Card style={{ alignItems: 'center', gap: space.md, borderColor: tint(colors.success, 0.4) }}>
          <Ionicons name="checkmark-done-circle-outline" size={48} color={colors.success} />
          <Txt variant="display">All sets logged</Txt>
          <Txt variant="caption">{progress.total} sets · add a note, then finish</Txt>
          <View style={{ alignSelf: 'stretch' }}>{notesInput}</View>
          <Button label="Complete workout" icon="checkmark-done" onPress={() => finish('completed')} style={{ alignSelf: 'stretch', minHeight: 60, borderRadius: 20 }} />
        </Card>
      </>
    );
  }

  return (
    <Screen footer={mode === 'list' && rest ? <RestTimer rest={rest} {...restProps} /> : null}>
      {topBar}
      {error && <Banner tone="error"><Txt>{error}</Txt></Banner>}
      {body}
      {safetyBlock}
    </Screen>
  );
}

const statusText = (s: WorkoutSession['status']) =>
  s === 'completed' ? '✓ Completed' : s === 'skipped' ? 'Skipped · resume whenever you are ready' : s === 'in_progress' ? 'In progress' : 'Not started — begin when you are ready';
