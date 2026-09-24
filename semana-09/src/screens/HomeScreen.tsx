// src/screens/HomeScreen.tsx
// Catálogo con ENTRADA EN CASCADA (Animated.stagger de 80ms por tarjeta) y
// sección "Mi lista de lectura" con chips que entran/salen con
// LayoutAnimation (+ una animación Animated propia en cada chip de refuerzo).

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  FlatList,
  LayoutAnimation,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import { BOOKS } from '../data/mockData';
import { AnimatedCard } from '../components/AnimatedCard';
import { useReadingListStore } from '../stores/readingListStore';
import type { RootStackParamList } from '../navigation/types';
import type { Item } from '../types';

type HomeNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

// ──────────────────────────────────────────────
// PANTALLA
// ──────────────────────────────────────────────

export function HomeScreen(): React.JSX.Element {
  const navigation = useNavigation<HomeNavProp>();
  const readingList = useReadingListStore((state) => state.items);
  const removeItem = useReadingListStore((state) => state.removeItem);

  // Un Animated.Value de entrada por tarjeta — creados UNA vez con useMemo
  const entrances = useMemo(() => BOOKS.map(() => new Animated.Value(0)), []);

  // ENTRADA EN CASCADA: todas las tarjetas, desfasadas 80ms
  useEffect(() => {
    Animated.stagger(
      80,
      entrances.map((value) =>
        Animated.timing(value, { toValue: 1, duration: 400, useNativeDriver: true }),
      ),
    ).start();
  }, [entrances]);

  // Los chips persistidos en AsyncStorage llegan async → animar también al
  // volver del detalle (cada focus re-anima la entrada del encabezado).
  const headerAnim = useRef(new Animated.Value(0)).current;
  useFocusEffect(
    useCallback(() => {
      headerAnim.setValue(0);
      Animated.timing(headerAnim, { toValue: 1, duration: 350, useNativeDriver: true }).start();
    }, [headerAnim]),
  );

  // LAYOUT ANIMATION: se configura ANTES del cambio de estado
  const animatedRemove = useCallback(
    (id: string) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      removeItem(id);
    },
    [removeItem],
  );

  return (
    <View style={styles.flex}>
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.content}
        data={BOOKS}
        keyExtractor={(book) => book.id}
        ListHeaderComponent={
          <Animated.View style={{ opacity: headerAnim }}>
            <Text style={styles.appTitle}>📚 Editorial Luna</Text>
            <Text style={styles.appSubtitle}>Tu club de lectura</Text>
            <ReadingListChips items={readingList} onRemove={animatedRemove} />
            <Text style={styles.catalogLabel}>
              Catálogo · {BOOKS.length} libros
            </Text>
          </Animated.View>
        }
        renderItem={({ item, index }) => (
          <AnimatedCard
            book={item}
            entranceValue={entrances[index] ?? entrances[0]}
            onPress={() => navigation.navigate('Detail', { id: item.id, name: item.name })}
          />
        )}
      />
    </View>
  );
}

// ──────────────────────────────────────────────
// SUB-COMPONENTE: chips de "Mi lista de lectura"
// ──────────────────────────────────────────────

function ReadingListChips({
  items,
  onRemove,
}: {
  items: Item[];
  onRemove: (id: string) => void;
}): React.JSX.Element {
  return (
    <View style={styles.chipsWrap}>
      <Text style={styles.chipsTitle}>
        Mi lista de lectura {items.length > 0 ? `(${items.length})` : ''}
      </Text>
      {items.length === 0 ? (
        <Text style={styles.chipsEmpty}>
          Vacía — agrega libros desde su detalle ⤵
        </Text>
      ) : (
        <View style={styles.chipsRow}>
          {items.map((book) => (
            <Chip key={book.id} book={book} onRemove={onRemove} />
          ))}
        </View>
      )}
    </View>
  );
}

function Chip({ book, onRemove }: { book: Item; onRemove: (id: string) => void }): React.JSX.Element {
  // Entrada propia del chip (refuerzo del LayoutAnimation en Android)
  const appear = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(appear, { toValue: 1, duration: 250, useNativeDriver: true }).start();
  }, [appear]);

  return (
    <Animated.View style={{ opacity: appear, transform: [{ scale: appear }] }}>
      <View style={styles.chip}>
        <Text style={styles.chipText} numberOfLines={1}>{book.name}</Text>
        <Pressable hitSlop={6} onPress={() => onRemove(book.id)}>
          <Text style={styles.chipRemove}>✕</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

// ──────────────────────────────────────────────
// ESTILOS
// ──────────────────────────────────────────────

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  list: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, gap: SPACING.sm, paddingBottom: SPACING.xxl },
  appTitle: { ...TYPOGRAPHY.h1, color: COLORS.accentLight },
  appSubtitle: { ...TYPOGRAPHY.caption, marginBottom: SPACING.md },
  chipsWrap: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    gap: SPACING.xs,
  },
  chipsTitle: { ...TYPOGRAPHY.label, textTransform: 'uppercase', letterSpacing: 0.8 },
  chipsEmpty: { ...TYPOGRAPHY.caption, fontStyle: 'italic' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs },
  chip: {
    backgroundColor: COLORS.accent,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingLeft: SPACING.sm,
    paddingRight: SPACING.xs,
    paddingVertical: SPACING.xs,
    maxWidth: '100%',
  },
  chipText: { fontSize: 12, fontWeight: '700', color: COLORS.background, maxWidth: 160 },
  chipRemove: { fontSize: 12, fontWeight: '800', color: COLORS.background, paddingHorizontal: 4 },
  catalogLabel: { ...TYPOGRAPHY.label, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: SPACING.xs },
});
