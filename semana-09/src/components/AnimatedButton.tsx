// src/components/AnimatedButton.tsx
// Botón reutilizable con feedback spring de compresión (1 → 0.94 → 1).

import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';

interface AnimatedButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost' | 'success';
  disabled?: boolean;
}

export function AnimatedButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
}: AnimatedButtonProps): React.JSX.Element {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = (): void => {
    Animated.spring(scale, { toValue: 0.94, useNativeDriver: true, speed: 40, bounciness: 4 }).start();
  };

  const pressOut = (): void => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 10 }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPressIn={pressIn}
        onPressOut={pressOut}
        onPress={onPress}
        disabled={disabled}
        style={[
          styles.base,
          variant === 'primary' && styles.primary,
          variant === 'ghost' && styles.ghost,
          variant === 'success' && styles.success,
          disabled && styles.disabled,
        ]}
      >
        <Text
          style={[
            styles.text,
            variant !== 'primary' && variant !== 'success' && styles.ghostText,
            variant === 'success' && styles.successText,
          ]}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    alignItems: 'center',
  },
  primary: { backgroundColor: COLORS.accent },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  success: { backgroundColor: COLORS.success },
  disabled: { opacity: 0.45 },
  text: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.background },
  ghostText: { color: COLORS.accentLight, fontWeight: '600' },
  successText: { color: COLORS.background },
});
