import type { TextStyle } from 'react-native';

export const colors = {
  bg: '#080B12',
  surface: '#111827',
  surface2: '#172033',
  border: '#263247',
  text: '#F5F7FA',
  muted: '#9AA6B2',
  primary: '#27B7FF',
  onPrimary: '#04121C',
  success: '#35D07F',
  warning: '#F5B942',
  danger: '#FF5C67',
};

export const phaseColor = { 1: '#27B7FF', 2: '#F5B942', 3: '#35D07F' } as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, page: 48 };
export const radius = { sm: 8, md: 12, lg: 16, pill: 999 };

export const type = {
  display: { fontSize: 30, fontWeight: '700', color: colors.text },
  h1: { fontSize: 24, fontWeight: '700', color: colors.text },
  h2: { fontSize: 20, fontWeight: '600', color: colors.text },
  h3: { fontSize: 16, fontWeight: '600', color: colors.text },
  body: { fontSize: 15, color: colors.text },
  caption: { fontSize: 12, color: colors.muted },
} satisfies Record<string, TextStyle>;

/** Minimum touch target (design system: ~44px). */
export const TOUCH = 44;
