import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Vibration, View } from 'react-native';
import { colors, radius, space, type as t } from '../theme';
import { ProgressRing } from './ProgressRing';
import { Txt } from './ui';

export type Rest = { endsAt: number; total: number };

type Props = { rest: Rest; onAdd: () => void; onSkip: () => void; onDone: () => void };

function useSecondsLeft(endsAt: number, onDone: () => void) {
  const [now, setNow] = useState(Date.now());
  const left = Math.max(0, Math.ceil((endsAt - now) / 1000));
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (left > 0) return;
    Vibration.vibrate(400);
    onDone();
    // Fire once when the countdown reaches zero, not on every parent render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left]);
  return left;
}

const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/** Compact bar pinned above the tab bar (list view). */
export function RestTimer({ rest, onAdd, onSkip, onDone }: Props) {
  const left = useSecondsLeft(rest.endsAt, onDone);
  return (
    <View style={s.bar} accessibilityLiveRegion="polite">
      <Txt variant="h3" style={{ flex: 1 }}>Rest {clock(left)}</Txt>
      <Pressable accessibilityRole="button" accessibilityLabel="Add 15 seconds" onPress={onAdd} style={s.btn}>
        <Txt variant="h3" color={colors.primary}>+15s</Txt>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Skip rest" onPress={onSkip} style={s.btn}>
        <Txt variant="h3">Skip</Txt>
      </Pressable>
    </View>
  );
}

/** Full rest screen for focus mode. */
export function RestRing({ rest, onAdd, onSkip, onDone, beeps, children }: Props & { beeps: number; children?: ReactNode }) {
  const left = useSecondsLeft(rest.endsAt, onDone);
  return (
    <View style={{ alignItems: 'center', gap: space.lg, paddingTop: space.lg }} accessibilityLiveRegion="polite">
      <Txt variant="label">Rest</Txt>
      <ProgressRing ratio={left / rest.total} size={212} stroke={12} track="#12203A" label={`Rest, ${left} seconds left`}>
        <Txt style={[t.hero, { fontSize: 48 }]}>{clock(left)}</Txt>
        <Txt variant="caption">of {clock(rest.total)}</Txt>
      </ProgressRing>
      <View style={{ flexDirection: 'row', gap: space.md }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Add 15 seconds" onPress={onAdd} style={s.pill}>
          <Txt variant="h3" color={colors.primarySoft}>+15s</Txt>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={onSkip} style={s.pill}>
          <Txt variant="h3">Skip rest</Txt>
        </Pressable>
      </View>
      {beeps > 0 && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.xs }}>
          <Ionicons name="volume-medium-outline" size={14} color={colors.muted} />
          <Txt variant="caption">{beeps} beeps at 0:00</Txt>
        </View>
      )}
      <View style={{ alignSelf: 'stretch' }}>{children}</View>
    </View>
  );
}

const s = StyleSheet.create({
  bar: {
    position: 'absolute', left: space.lg, right: space.lg, bottom: 88, maxWidth: 528, alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingLeft: space.lg, paddingRight: space.sm,
    backgroundColor: colors.surface2, borderColor: colors.primary, borderWidth: 1, borderRadius: radius.lg,
  },
  btn: { minHeight: 52, minWidth: 56, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.sm },
  pill: { minHeight: 48, paddingHorizontal: space.xl, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
});
