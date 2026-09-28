import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Vibration, View } from 'react-native';
import { colors, radius, space } from '../theme';
import { Txt } from './ui';

/** Countdown bar pinned above the tab bar. `endsAt` is an epoch ms timestamp. */
export function RestTimer({ endsAt, onChange, onDone }: { endsAt: number; onChange: (endsAt: number | null) => void; onDone: () => void }) {
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

  return (
    <View style={s.bar} accessibilityLiveRegion="polite">
      <Txt variant="h3" style={{ flex: 1 }}>Rest {Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}</Txt>
      <Pressable accessibilityRole="button" accessibilityLabel="Add 15 seconds" onPress={() => onChange(endsAt + 15_000)} style={s.btn}>
        <Txt variant="h3" color={colors.primary}>+15s</Txt>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Skip rest" onPress={() => onChange(null)} style={s.btn}>
        <Txt variant="h3">Skip</Txt>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  bar: {
    position: 'absolute', left: space.lg, right: space.lg, bottom: space.lg, maxWidth: 528, alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingLeft: space.lg, paddingRight: space.sm,
    backgroundColor: colors.surface2, borderColor: colors.primary, borderWidth: 1, borderRadius: radius.lg,
  },
  btn: { minHeight: 52, minWidth: 56, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.sm },
});
