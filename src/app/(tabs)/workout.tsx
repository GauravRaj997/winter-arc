import { useState } from 'react';
import { ActivityIndicator, TextInput, View } from 'react-native';
import { ExerciseCard } from '../../components/ExerciseCard';
import { RestTimer } from '../../components/RestTimer';
import { Banner, Button, Card, Chip, Row, Screen, Txt } from '../../components/ui';
import { dailyPlan } from '../../domain/plan';
import { beepCount } from '../../domain/profile';
import { addSet, finishSession, hasLoggedSets, removeLastSet, reopenSession, sessionProgress, statusCue, updateSet, type WorkoutSession } from '../../domain/session';
import { formatDate } from '../../domain/time';
import { EXERCISES, WORKOUTS, type WorkoutId } from '../../domain/workouts';
import { useToday, useWorkout } from '../../state/hooks';
import { beep } from '../../services/beeper';
import { useProfile } from '../../state/profile';
import { colors, radius, space } from '../../theme';

const CHOICES = (Object.keys(WORKOUTS) as WorkoutId[]).filter((id) => id !== 'rest');

export default function Workout() {
  const { profile } = useProfile();
  const today = useToday();
  const planned = profile ? dailyPlan(profile, today).workoutId : 'rest';
  const { session, previous, error, update: save, switchTo } = useWorkout(today, planned, profile?.equipment ?? ['bodyweight']);
  const [restEndsAt, setRestEndsAt] = useState<number | null>(null);
  const [safety, setSafety] = useState(false);
  const [notes, setNotes] = useState<string>();
  const beeps = profile ? beepCount(profile) : 0;

  /** Every session change goes through here so start/finish beep automatically. */
  const update = (next: WorkoutSession) => {
    if (session && statusCue(session.status, next.status)) beep(beeps);
    save(next);
  };

  if (!session) {
    return (
      <Screen>
        {error ? <Banner tone="error"><Txt>{error}</Txt></Banner> : <ActivityIndicator color={colors.primary} />}
      </Screen>
    );
  }

  const workout = WORKOUTS[session.workoutType];
  const progress = sessionProgress(session);
  const locked = hasLoggedSets(session);
  const finished = session.status === 'completed' || session.status === 'skipped';

  const header = (
    <View style={{ gap: space.xs }}>
      <Txt variant="caption">{formatDate(today)}{session.workoutType !== planned ? ` · planned: ${WORKOUTS[planned].name}` : ''}</Txt>
      <Txt variant="display">{workout.name}</Txt>
      <Txt color={colors.muted}>{workout.focus}</Txt>
    </View>
  );

  const picker = !locked && !finished && (
    <View style={{ gap: space.sm }}>
      <Txt variant="caption">{session.workoutType === 'rest' ? 'Want to move anyway? Pick a session:' : 'Doing a different day? Swap before logging:'}</Txt>
      <Row>{CHOICES.map((id) => <Chip key={id} label={WORKOUTS[id].name} selected={session.workoutType === id} onPress={() => switchTo(id)} />)}</Row>
    </View>
  );

  if (session.workoutType === 'rest') {
    return (
      <Screen>
        {header}
        <Card>
          <Txt variant="h3">Rest day</Txt>
          <Txt color={colors.muted}>Recovery is part of the plan. A walk, meal prep and your weekly review are enough today.</Txt>
        </Card>
        {picker}
      </Screen>
    );
  }

  const saveNotes = () => notes !== undefined && notes !== (session.notes ?? '') && update({ ...session, notes });

  return (
    <Screen footer={restEndsAt ? <RestTimer endsAt={restEndsAt} onChange={setRestEndsAt} onDone={() => { beep(beeps); setRestEndsAt(null); }} /> : null}>
      {header}
      {error && <Banner tone="error"><Txt>{error}</Txt></Banner>}

      <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Txt variant="h3">{progress.done} of {progress.total} sets</Txt>
          <Txt variant="caption">
            {session.status === 'completed' ? '✓ Completed' : session.status === 'skipped' ? 'Skipped · resume whenever you are ready' : session.status === 'in_progress' ? 'In progress' : 'Not started — begin when you are ready'}
          </Txt>
        </View>
        {session.status === 'planned' && <Button label="Start" icon="play" onPress={() => update({ ...session, status: 'in_progress' })} />}
        {finished && <Button label={session.status === 'skipped' ? 'Resume' : 'Edit'} variant="secondary" onPress={() => update(reopenSession(session))} />}
      </Card>

      {picker}

      {session.exercises.map((log, i) => {
        const e = EXERCISES[log.exerciseId];
        if (!e) return null;
        return (
          <ExerciseCard
            key={log.exerciseId}
            exercise={e}
            log={log}
            previous={previous[log.exerciseId]}
            readOnly={finished}
            onSet={(j, patch) => {
              update(updateSet(session, i, j, patch));
              if (patch.completed) setRestEndsAt(Date.now() + e.restSeconds * 1000);
            }}
            onAddSet={() => update(addSet(session, i))}
            onRemoveSet={() => update(removeLastSet(session, i))}
          />
        );
      })}

      <Card>
        <Txt variant="h3">Notes</Txt>
        <TextInput
          accessibilityLabel="Workout notes"
          multiline
          editable={!finished}
          value={notes ?? session.notes ?? ''}
          onChangeText={setNotes}
          onBlur={saveNotes}
          placeholder="Form cues, energy, anything worth remembering"
          placeholderTextColor={colors.muted}
          style={{ minHeight: 88, color: colors.text, backgroundColor: colors.surface2, borderRadius: radius.md, padding: space.md, fontSize: 16, textAlignVertical: 'top' }}
        />
      </Card>

      {!finished && (
        <View style={{ gap: space.sm }}>
          <Button label="Complete workout" icon="checkmark-done" onPress={() => { setRestEndsAt(null); update(finishSession({ ...session, notes: notes ?? session.notes }, 'completed')); }} />
          <Button label="Skip today" variant="ghost" onPress={() => { setRestEndsAt(null); update(finishSession(session, 'skipped')); }} />
        </View>
      )}

      {safety ? (
        <Banner tone="safety">
          <Txt variant="h3">Stop the exercise and rest.</Txt>
          <Txt color={colors.muted}>
            If you have chest pain, fainting, dizziness, unusual shortness of breath, or significant pain or injury, stop training today and seek medical help if it doesn't settle quickly. Your progress is kept — you can resume when you feel well.
          </Txt>
          <Row>
            {!finished && <Button label="End session for today" variant="secondary" onPress={() => { setSafety(false); setRestEndsAt(null); update(finishSession({ ...session, notes: [session.notes, 'Stopped: felt unwell / pain'].filter(Boolean).join('\n') }, 'skipped')); }} />}
            <Button label="Dismiss" variant="ghost" onPress={() => setSafety(false)} />
          </Row>
        </Banner>
      ) : (
        <Button label="Pain or feeling unwell?" icon="medkit-outline" variant="ghost" onPress={() => setSafety(true)} />
      )}
    </Screen>
  );
}
