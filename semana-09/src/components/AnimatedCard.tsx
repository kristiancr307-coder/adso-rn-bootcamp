// src/components/AnimatedCard.tsx
// Tarjeta del catálogo con DOS animaciones:
//  1. ENTRADA en cascada: recibe un Animated.Value del padre y lo usa para
//     opacity + translateY (el padre ejecuta Animated.stagger).
//  2. FEEDBACK TÁCTIL: spring scale 1 → 0.95 (pressIn) y 0.95 → 1 con
//     rebote (pressOut).

import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import type { Item } from '../types';

interface AnimatedCardProps {
  book: Item;
  /** Valor 0→1 animado por el padre (stagger de entrada de la lista) */
  entranceValue: Animated.Value;
  onPress: () => void;
}

export function AnimatedCard({ book, entranceValue, onPress }: AnimatedCardProps): React.JSX.Element {
  // Escala para el feedback táctil — propia de cada tarjeta
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = (): void => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true, // transform sí corre en el hilo nativo
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const pressOut = (): void => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 12, // el rebote natural al soltar
    }).start();
  };

  return (
    // Entrada: opacity y translateY controlados por el valor del stagger
    <Animated.View
      style={{
        opacity: entranceValue,
        transform: [
          { translateY: entranceValue.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) },
        ],
      }}
    >
      {/* Feedback: escala con spring */}
      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable onPressIn={pressIn} onPressOut={pressOut} onPress={onPress}>
          <View style={styles.card}>
            <View style={styles.avatar}>
              <Text style={styles.avatarLetter}>{book.name.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.rowText}>
              <Text style={styles.title} numberOfLines={1}>{book.name}</Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                {book.author} · {book.year} · {book.genre}
              </Text>
            </View>
            <Text style={styles.price}>${book.price.toFixed(2)}</Text>
          </View>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  avatarLetter: { ...TYPOGRAPHY.h3, color: COLORS.accent },
  rowText: { flex: 1 },
  title: { ...TYPOGRAPHY.body, fontWeight: '600' },
  subtitle: { ...TYPOGRAPHY.caption },
  price: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.accent, marginLeft: SPACING.sm },
});
