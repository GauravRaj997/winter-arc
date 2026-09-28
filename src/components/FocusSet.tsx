import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { suggestProgression } from '../domain/progression';
import type { ExerciseLog, SetLog } from '../domain/session';
import type { Exercise } from '../domain/workouts';
import { colors, radius, space, type as t } from '../theme';
import { Button, Row, Stepper, Txt } from './ui';

type Props = {
  exercise: Exercise;
  log: ExerciseLog;
  setIdx: number;
  position: string;
  previous?: SetLog[];
  onSet: (patch: Partial<SetLog>) => void;
  onSelectSet: (i: number) => void;
  onLog: () => void;
  onAddSet: () => void;
};

/** One set at a time: big number, big button. */
export function FocusSet({ exercise: e, log, setIdx, position, previous, onSet, onSelectSet, onLog, onAddSet }: Props) {
  const [showHow, setShowHow] = useState(false);
  const set = log.sets[setIdx];
  const seconds = e.unit === 'seconds';
  const unit = seconds ? 'seconds' : 'reps';
  const suggestion = suggestProgression(e, previous);
  const last = previous?.filter((s) => s.completed).map((s) => s.reps);
  const step = seconds ? 5 : 1;

  return (
    <View style={{ gap: space.lg }}>
      <View style={{ alignItems: 'center', gap: space.xs }}>
        <View style={s.tag}><Txt variant="label" color="#B9C3CF">{e.muscleGroup}</Txt></View>
        <Txt style={[t.display, { fontSize: 28, textAlign: 'center', marginTop: space.xs }]}>{e.name}</Txt>
        <Txt variant="caption">{position} · target {e.repMin}–{e.repMax} {unit}{e.perSide ? ' per side' : ''}</Txt>
      </View>

      <Row style={{ justifyContent: 'center', gap: space.sm }}>
        {log.sets.map((x, i) => (
          <Pressable key={i} onPress={() => onSelectSet(i)} accessibilityRole="button" accessibilityLabel={`Set ${i + 1}${x.completed ? ', logged' : ''}`}
            style={{ height: 32, justifyContent: 'center' }}>
            <View style={{ width: 30, height: 7, borderRadius: 4, backgroundColor: x.completed ? colors.success : i === setIdx ? colors.primary : colors.border }} />
          </Pressable>
        ))}
        <Txt variant="caption" style={{ marginLeft: space.xs }}>Set {setIdx + 1} of {log.sets.length}</Txt>
      </Row>

      <Row style={{ justifyContent: 'center', gap: space.xl, flexWrap: 'nowrap' }}>
        <Pressable onPress={() => onSet({ reps: set.reps - step })} style={s.round} accessibilityRole="button" accessibilityLabel={`Decrease ${unit}`}>
          <Ionicons name="remove" size={26} color={colors.text} />
        </Pressable>
        <View style={{ alignItems: 'center', minWidth: 110 }} accessible accessibilityLabel={`${set.reps} ${unit}`}>
          <Txt style={[t.hero, { fontSize: 84, lineHeight: 88, letterSpacing: -3 }]}>{set.reps}</Txt>
          <Txt variant="caption">{unit}</Txt>
        </View>
        <Pressable onPress={() => onSet({ reps: set.reps + step })} style={s.round} accessibilityRole="button" accessibilityLabel={`Increase ${unit}`}>
          <Ionicons name="add" size={26} color={colors.text} />
        </Pressable>
      </Row>

      <Row style={{ justifyContent: 'center', flexWrap: 'nowrap' }}>
        {e.progression === 'reps_then_load' && (
          <Stepper label="kg" value={set.loadKg} display={String(set.loadKg)} step={0.5} onChange={(v) => onSet({ loadKg: v })} style={{ flex: 1, maxWidth: 180 }} />
        )}
        <Pressable onPress={() => onSet({ rir: ((set.rir ?? -1) + 1) % 6 })} style={s.chip}
          accessibilityRole="button" accessibilityLabel={`Reps in reserve ${set.rir ?? 'not set'}. Tap to change`}>
          <Txt variant="caption">RIR</Txt>
          <Txt variant="h3">{set.rir ?? '–'}</Txt>
        </Pressable>
      </Row>

      <View style={s.split}>
        <View style={[s.half, { borderRightWidth: 1, borderRightColor: colors.border }]}>
          <Txt variant="label">Last time</Txt>
          <Txt variant="h3" style={{ fontVariant: ['tabular-nums'] }}>{last?.length ? last.join(' · ') : '—'}</Txt>
        </View>
        <View style={s.half}>
          <Txt variant="label">Try</Txt>
          <Txt variant="h3" color={colors.primarySoft} style={{ fontVariant: ['tabular-nums'] }}>
            {suggestion.targets ? suggestion.targets.join(' · ') : `${e.repMin}–${e.repMax}`}
          </Txt>
        </View>
      </View>
      {!suggestion.targets && <Txt variant="caption" style={{ textAlign: 'center', marginTop: -space.sm }}>{suggestion.message}</Txt>}

      <Button label={set.completed ? 'Update set' : 'Log set'} icon="checkmark" onPress={onLog} style={{ minHeight: 60, borderRadius: radius.xl }} />

      <Row style={{ justifyContent: 'center', gap: space.xl }}>
        <Pressable onPress={() => setShowHow(!showHow)} accessibilityRole="button" accessibilityState={{ expanded: showHow }} style={s.link}>
          <Txt variant="caption" color={colors.primary}>{showHow ? 'Hide instructions' : 'How to do it'}</Txt>
        </Pressable>
        <Pressable onPress={onAddSet} accessibilityRole="button" style={s.link}>
          <Txt variant="caption" color={colors.primary}>Add a set</Txt>
        </Pressable>
      </Row>
      {showHow && <Txt color={colors.muted} style={{ textAlign: 'center' }}>{e.instructions}</Txt>}
    </View>
  );
}

const s = StyleSheet.create({
  tag: { backgroundColor: colors.border, borderRadius: radius.pill, paddingHorizontal: space.md, paddingVertical: 4 },
  round: { width: 60, height: 60, borderRadius: 30, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  chip: { minHeight: 48, minWidth: 72, paddingHorizontal: space.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  split: { flexDirection: 'row', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg },
  half: { flex: 1, padding: space.md, gap: 2 },
  link: { minHeight: 40, justifyContent: 'center' },
});
