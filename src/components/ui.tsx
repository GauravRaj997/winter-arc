import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, type StyleProp, type TextInputProps, type TextStyle, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, space, TOUCH, type } from '../theme';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export function Screen({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  return (
    <SafeAreaView style={s.screen} edges={['top']}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <View style={s.column}>{children}</View>
      </ScrollView>
      {footer}
    </SafeAreaView>
  );
}

export function Txt({ variant = 'body', color, style, children, ...rest }: {
  variant?: keyof typeof type; color?: string; style?: StyleProp<TextStyle>; children: ReactNode;
} & Omit<ComponentProps<typeof Text>, 'style'>) {
  return <Text style={[type[variant], color ? { color } : null, style]} {...rest}>{children}</Text>;
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[s.card, style]}>{children}</View>;
}

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: IconName;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({ label, onPress, variant = 'primary', icon, disabled, style }: ButtonProps) {
  const fg = variant === 'primary' ? colors.onPrimary : variant === 'danger' ? colors.danger : colors.text;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [s.button, s[variant], disabled && { opacity: 0.4 }, pressed && { opacity: 0.75 }, style]}
    >
      {icon && <Ionicons name={icon} size={18} color={fg} />}
      <Text style={[type.h3, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

export function Chip({ label, selected, onPress, disabled }: { label: string; selected: boolean; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[s.chip, selected && s.chipOn, disabled && { opacity: 0.5 }]}
    >
      {selected && <Ionicons name="checkmark" size={14} color={colors.primary} />}
      <Text style={[type.body, { color: selected ? colors.text : colors.muted }]}>{label}</Text>
    </Pressable>
  );
}

export function Row({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[s.row, style]}>{children}</View>;
}

export function Field({ label, error, hint, ...input }: { label: string; error?: string; hint?: string } & TextInputProps) {
  return (
    <View style={{ gap: space.xs, flex: 1, minWidth: 140 }}>
      <Txt variant="caption">{label}</Txt>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.muted}
        style={[s.input, error ? { borderColor: colors.danger } : null]}
        {...input}
      />
      {error ? <Txt variant="caption" color={colors.danger}>{error}</Txt> : hint ? <Txt variant="caption">{hint}</Txt> : null}
    </View>
  );
}

/** − value + with large targets, for one-handed logging. */
export function Stepper({ label, value, display, onChange, step = 1, style }: {
  label: string; value: number; display?: string; onChange: (v: number) => void; step?: number; style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[s.stepper, style]}>
      <Pressable accessibilityRole="button" accessibilityLabel={`Decrease ${label}`} onPress={() => onChange(value - step)} style={s.stepBtn}>
        <Ionicons name="remove" size={20} color={colors.text} />
      </Pressable>
      <View style={{ flex: 1, alignItems: 'center' }} accessible accessibilityLabel={`${label} ${display ?? value}`}>
        <Txt variant="h3">{display ?? value}</Txt>
        <Txt variant="caption">{label}</Txt>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel={`Increase ${label}`} onPress={() => onChange(value + step)} style={s.stepBtn}>
        <Ionicons name="add" size={20} color={colors.text} />
      </Pressable>
    </View>
  );
}

export function Banner({ tone, children }: { tone: 'error' | 'info' | 'safety'; children: ReactNode }) {
  const c = tone === 'info' ? colors.primary : tone === 'safety' ? colors.warning : colors.danger;
  const icon: IconName = tone === 'info' ? 'information-circle' : tone === 'safety' ? 'medkit' : 'alert-circle';
  return (
    <View accessibilityRole="alert" style={[s.banner, { borderColor: c }]}>
      <Ionicons name={icon} size={20} color={c} />
      <View style={{ flex: 1, gap: space.sm }}>{children}</View>
    </View>
  );
}

/** Round check button; status is conveyed by icon + label, not color alone. */
export function CheckButton({ checked, onPress, label }: { checked: boolean; onPress: () => void; label: string }) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={4}
      style={[s.check, checked && { backgroundColor: colors.success, borderColor: colors.success }]}
    >
      <Ionicons name={checked ? 'checkmark' : 'ellipse-outline'} size={checked ? 22 : 10} color={checked ? colors.onPrimary : colors.border} />
    </Pressable>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: space.lg, paddingBottom: 120 },
  column: { width: '100%', maxWidth: 560, alignSelf: 'center', gap: space.lg },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius.xl, padding: space.lg, gap: space.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm, flexWrap: 'wrap' },
  button: { minHeight: TOUCH + 6, borderRadius: radius.lg, paddingHorizontal: space.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.sm },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.danger },
  chip: { minHeight: TOUCH, paddingHorizontal: space.lg, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', gap: space.xs },
  chipOn: { borderColor: colors.primary, backgroundColor: colors.surface2 },
  input: { minHeight: TOUCH, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface2, color: colors.text, paddingHorizontal: space.md, fontSize: 16 },
  stepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface2, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border },
  stepBtn: { width: TOUCH, height: TOUCH + 4, alignItems: 'center', justifyContent: 'center' },
  banner: { flexDirection: 'row', gap: space.md, padding: space.lg, borderRadius: radius.lg, borderWidth: 1, backgroundColor: colors.surface },
  check: { width: TOUCH, height: TOUCH, borderRadius: radius.pill, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
});
