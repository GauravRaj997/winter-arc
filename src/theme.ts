import type { TextStyle } from 'react-native';

export const colors = {
  bg: '#070A11',
  surface: '#0F1522',
  surface2: '#151D2E',
  border: '#1F2A3D',
  text: '#F5F7FA',
  muted: '#8B97A6',
  primary: '#27B7FF',
  primarySoft: '#7FD3FF',
  primaryTint: 'rgba(39,183,255,0.13)',
  nowBg: '#0E1A2A',
  onPrimary: '#04121C',
  success: '#35D07F',
  warning: '#F5B942',
  danger: '#FF5C67',
};

export const phaseColor = { 1: '#27B7FF', 2: '#F5B942', 3: '#35D07F' } as const;

/** One hue per daily pillar so the rings read at a glance (always paired with a label). */
export const pillarColor = { train: '#27B7FF', food: '#F5B942', sleep: '#A78BFA', move: '#35D07F' } as const;

/** Hex + alpha suffix, e.g. tint('#27B7FF', 0.2). */
export const tint = (hex: string, a: number) => hex + Math.round(a * 255).toString(16).padStart(2, '0');

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, page: 48 };
export const radius = { sm: 8, md: 12, lg: 16, xl: 20, pill: 999 };

export const type = {
  hero: { fontSize: 40, fontWeight: '700', color: colors.text, letterSpacing: -0.8, fontVariant: ['tabular-nums'] },
  display: { fontSize: 30, fontWeight: '700', color: colors.text, letterSpacing: -0.4 },
  h1: { fontSize: 24, fontWeight: '700', color: colors.text },
  h2: { fontSize: 20, fontWeight: '600', color: colors.text },
  h3: { fontSize: 16, fontWeight: '600', color: colors.text },
  body: { fontSize: 15, color: colors.text },
  caption: { fontSize: 12, color: colors.muted },
  label: { fontSize: 10, fontWeight: '600', color: colors.muted, letterSpacing: 1.6, textTransform: 'uppercase' },
} satisfies Record<string, TextStyle>;

/** Minimum touch target (design system: ~44px). */
export const TOUCH = 44;
