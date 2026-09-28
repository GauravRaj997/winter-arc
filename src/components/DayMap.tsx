import { View } from 'react-native';
import { dayMark, PHASES, type Phase } from '../domain/plan';
import { addDays } from '../domain/time';
import { colors, phaseColor, radius, space, tint } from '../theme';
import { Txt } from './ui';

/** 90 squares, one row block per phase. Full days solid, partial days soft, never red. */
export function DayMap({ startDate, today, scores }: { startDate: string; today: number; scores: Record<string, number> }) {
  return (
    <View style={{ gap: space.sm }}>
      {([1, 2, 3] as Phase[]).map((p) => (
        <View key={p} style={{ gap: 3 }}>
          <Txt variant="caption" style={{ fontSize: 10 }}>{PHASES[p].name}</Txt>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {Array.from({ length: 30 }, (_, i) => {
              const day = PHASES[p].from + i;
              const mark = day < today ? dayMark(scores[addDays(startDate, day - 1)]) : undefined;
              const c = phaseColor[p];
              const bg = day === today ? 'transparent'
                : mark === 'full' ? c
                : mark === 'partial' ? tint(c, 0.4)
                : mark === 'none' ? '#1C2638' : colors.surface2;
              return (
                <View key={day} style={{ width: `${100 / 15}%`, aspectRatio: 1, padding: 1.5 }}>
                  <View style={{ flex: 1, borderRadius: radius.sm / 2, backgroundColor: bg, borderWidth: day === today ? 1.5 : 0, borderColor: c }} />
                </View>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
}
