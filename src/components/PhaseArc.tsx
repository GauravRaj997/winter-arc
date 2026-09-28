import type { ReactNode } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { PLAN_DAYS } from '../domain/plan';
import { colors, phaseColor, tint } from '../theme';

const R = 80;
const pt = (f: number) => {
  const a = Math.PI * (1 - f);
  return { x: 100 + R * Math.cos(a), y: 100 - R * Math.sin(a) };
};
const arc = (f0: number, f1: number) => {
  const a = pt(f0), b = pt(f1);
  return `M ${a.x} ${a.y} A ${R} ${R} 0 0 1 ${b.x} ${b.y}`;
};

/** The "arc": a half-circle split into the three 30-day phases, filled up to today. */
export function PhaseArc({ day, children }: { day: number; children?: ReactNode }) {
  const f = Math.min(1, Math.max(0, day / PLAN_DAYS));
  const GAP = 0.02;
  const phases = ([1, 2, 3] as const).map((p) => ({ p, from: (p - 1) / 3 + (p > 1 ? GAP : 0), to: p / 3 - (p < 3 ? GAP : 0) }));
  const dot = pt(f);
  return (
    <View style={{ height: 164, justifyContent: 'flex-end' }} accessible accessibilityRole="progressbar"
      accessibilityLabel={`90-day arc, day ${Math.max(0, Math.min(day, PLAN_DAYS))} of ${PLAN_DAYS}`}>
      <Svg width="100%" height={164} viewBox="0 0 200 112" style={{ position: 'absolute', top: 0 }}>
        {phases.map(({ p, from, to }) => (
          <Path key={p} d={arc(from, to)} stroke={tint(phaseColor[p], 0.2)} strokeWidth={7} fill="none" strokeLinecap="round" />
        ))}
        {phases.map(({ p, from, to }) =>
          f > from ? <Path key={`f${p}`} d={arc(from, Math.min(to, f))} stroke={phaseColor[p]} strokeWidth={7} fill="none" strokeLinecap="round" /> : null)}
        {day >= 1 && day <= PLAN_DAYS && (
          <Circle cx={dot.x} cy={dot.y} r={6} fill={colors.bg} stroke={phaseColor[f <= 1 / 3 ? 1 : f <= 2 / 3 ? 2 : 3]} strokeWidth={2.5} />
        )}
      </Svg>
      <View style={{ alignItems: 'center', paddingBottom: 4 }}>{children}</View>
    </View>
  );
}
