// src/components/ProgressBar.tsx
// Barra de progreso de lectura — interpolate para ANCHO y COLOR.
//   width :  '0%' → '100%'            (según fracción leída)
//   color :  rojo → amarillo → verde  (0 → 0.5 → 1, con clamp)
//
// El valor animado se re-dispara cada vez que cambia `progress`, así el
// botón "+25 páginas" del detalle hace que la barra se mueva sola.

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { PROGRESS_COLORS, SPACING, TYPOGRAPHY } from '../theme';

interface ProgressBarProps {
  /** Fracción leída: 0 → 1 */
  progress: number;
  /** Texto tipo "52% · 217/417 páginas" */
  label?: string;
}

export function ProgressBar({ progress, label }: ProgressBarProps): React.JSX.Element {
  // useNativeDriver: false — el ancho/porcentaje NO se puede animar nativo
  const anim = useRef(new Animated.Value(0)).current;

  const fraction = Math.min(Math.max(progress, 0), 1);

  useEffect(() => {
    Animated.timing(anim, {
      toValue: fraction,
      duration: 700,
      useNativeDriver: false, // width y backgroundColor son props de layout/paint
    }).start();
  }, [fraction, anim]);

  return (
    <View style={styles.container}>
      {label !== undefined && <Text style={styles.label}>{label}</Text>}
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            {
              width: anim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
                extrapolate: 'clamp', // nunca pasa de los límites
              }),
              backgroundColor: anim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [PROGRESS_COLORS.low, PROGRESS_COLORS.mid, PROGRESS_COLORS.high],
                extrapolate: 'clamp',
              }),
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: SPACING.xs },
  label: { ...TYPOGRAPHY.caption },
  track: {
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 5 },
});
