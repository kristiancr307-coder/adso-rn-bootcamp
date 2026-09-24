// src/theme/index.ts
// Paleta AZUL de "Editorial Luna" — usada en las semanas 07-09.

import { StyleSheet } from 'react-native';

export const COLORS = {
  background: '#0B1526',
  surface: '#10203A',
  card: '#16294A',
  border: '#25406B',

  // Acento azul
  accent: '#3B82F6',
  accentLight: '#7CB1FF',

  text: '#EAF2FF',
  textSecondary: '#9FB4D4',
  textMuted: '#5E7799',

  error: '#F87171',
  errorLight: '#FCA5A5',
  success: '#4ADE80',
  warning: '#FBBF24',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 32,
};

export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 16,
};

export const TYPOGRAPHY = StyleSheet.create({
  h1:      { fontSize: 24, fontWeight: '700', color: COLORS.text },
  h2:      { fontSize: 20, fontWeight: '700', color: COLORS.text },
  h3:      { fontSize: 16, fontWeight: '700', color: COLORS.text },
  body:    { fontSize: 14, fontWeight: '400', color: COLORS.text },
  label:   { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  caption: { fontSize: 12, fontWeight: '400', color: COLORS.textMuted },
  error:   { fontSize: 12, fontWeight: '400', color: COLORS.errorLight },
});
