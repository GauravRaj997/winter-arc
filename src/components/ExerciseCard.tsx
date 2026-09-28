import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { suggestProgression } from '../domain/progression';
import type { ExerciseLog, SetLog } from '../domain/session';
import type { Exercise } from '../domain/workouts';
import { colors, radius, space } from '../theme';
import { Button, Card, CheckButton, Row, Stepper, Txt } from './ui';

type Props = {
  exercise: Exercise;
  log: ExerciseLog;
  previous?: SetLog[];
  readOnly?: boolean;
  onSet: (setIdx: number, patch: Partial<SetLog>) => void;
  onAddSet: () => void;
  onRemoveSet: () => void;
};

export function ExerciseCard({ exercise: e, log, previous, readOnly, onSet, onAddSet, onRemoveSet }: Props) {
  const [showHow, setShowHow] = useState(false);
  const seconds = e.unit === 'seconds';
  const unit = seconds ? 's' : 'reps';
  const loadable = e.progression === 'reps_then_load';
  const prevDone = previous?.filter((s) => s.completed);

  return (
    <Card>
      <View style={{ gap: 2 }}>
        <Txt variant="h2">{e.name}</Txt>
        <Txt variant="caption">
          {e.muscleGroup} · {log.sets.length} × {e.repMin}–{e.repMax} {unit}{e.perSide ? ' per side' : ''} · rest {e.restSeconds}s
        </Txt>
      </View>

      <View style={{ backgroundColor: colors.surface2, borderRadius: radius.md, padding: space.md, gap: space.xs }}>
        <Txt variant="caption">
          Previous: {prevDone?.length
            ? `${prevDone.map((s) => s.reps).join(' / ')} ${unit}${prevDone.some((s) => s.loadKg) ? ` · ${prevDone[0].loadKg} kg` : ''}`
            : 'no data yet'}
        </Txt>
        <Txt>{suggestProgression(e, previous).message}</Txt>
      </View>

      <Pressable onPress={() => setShowHow(!showHow)} accessibilityRole="button" accessibilityState={{ expanded: showHow }} style={{ minHeight: 32, justifyContent: 'center' }}>
        <Txt variant="caption" color={colors.primary}>{showHow ? 'Hide instructions' : 'How to do it'}</Txt>
      </Pressable>
      {showHow && <Txt color={colors.muted}>{e.instructions}</Txt>}

      {log.sets.map((set, i) => (
        <View key={i} style={{ gap: space.sm, paddingTop: space.sm, borderTopWidth: 1, borderTopColor: colors.border }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Txt variant="h3">Set {set.setNumber}</Txt>
            <Row>
              <Pressable
                disabled={readOnly}
                accessibilityRole="button"
                accessibilityLabel={`Reps in reserve ${set.rir ?? 'not set'}. Tap to change`}
                onPress={() => onSet(i, { rir: ((set.rir ?? -1) + 1) % 6 })}
                style={{ minHeight: 44, paddingHorizontal: space.md, justifyContent: 'center', borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border }}
              >
                <Txt variant="caption">RIR {set.rir ?? '–'}</Txt>
              </Pressable>
              <CheckButton
                checked={set.completed}
                label={`Set ${set.setNumber} ${set.completed ? 'completed' : 'not completed'}`}
                onPress={() => !readOnly && onSet(i, { completed: !set.completed })}
              />
            </Row>
          </Row>
          {!readOnly && (
            <Row style={{ flexWrap: 'nowrap' }}>
              <Stepper style={{ flex: 1 }} label={unit} value={set.reps} step={seconds ? 5 : 1} onChange={(v) => onSet(i, { reps: v })} />
              {loadable && (
                <Stepper style={{ flex: 1 }} label="kg" value={set.loadKg} step={0.5} display={String(set.loadKg)} onChange={(v) => onSet(i, { loadKg: v })} />
              )}
            </Row>
          )}
          {readOnly && <Txt color={colors.muted}>{set.reps} {unit}{loadable ? ` · ${set.loadKg} kg` : ''}</Txt>}
        </View>
      ))}

      {!readOnly && (
        <Row>
          <Button label="Add set" icon="add" variant="secondary" onPress={onAddSet} style={{ flex: 1 }} />
          {log.sets.length > 1 && <Button label="Remove set" variant="ghost" onPress={onRemoveSet} style={{ flex: 1 }} />}
        </Row>
      )}
    </Card>
  );
}
