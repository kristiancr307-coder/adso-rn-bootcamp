// src/screens/DetailScreen.tsx
// Detalle del libro con:
//  1. ENTRADA ANIMADA — Animated.parallel (fade in + slide up, 500ms)
//  2. ProgressBar de lectura — interpola ancho y color según el progreso
//  3. Botones animados — "+25 páginas" y agregar/quitar de mi lista
//     (el agregar/quitar dispara LayoutAnimation en el Home)

import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, LayoutAnimation, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import { BOOKS } from '../data/mockData';
import { AnimatedButton } from '../components/AnimatedButton';
import { ProgressBar } from '../components/ProgressBar';
import { useProgressStore } from '../stores/progressStore';
import { useReadingListStore } from '../stores/readingListStore';
import type { RootStackParamList } from '../navigation/types';

export function DetailScreen(): React.JSX.Element {
  const route = useRoute<RouteProp<RootStackParamList, 'Detail'>>();
  const book = useMemo(
    () => BOOKS.find((b) => b.id === route.params.id) ?? BOOKS[0],
    [route.params.id],
  );

  // Valores de la entrada: opacity 0→1 y translateY 30→0 EN PARALELO
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY]);

  // Progreso de lectura — persistido; cae al valor semilla del libro
  const pagesByBook = useProgressStore((state) => state.pagesByBook);
  const addPages = useProgressStore((state) => state.addPages);
  const pagesRead = pagesByBook[book.id] ?? book.pagesRead;

  // Mi lista de lectura
  const listItems = useReadingListStore((state) => state.items);
  const addItem = useReadingListStore((state) => state.addItem);
  const removeItem = useReadingListStore((state) => state.removeItem);
  const inList = listItems.some((i) => i.id === book.id);

  const toggleList = (): void => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    if (inList) removeItem(book.id);
    else addItem(book);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      // ENTRADA: el contenido completo aparece con fade + slide
    >
      <Animated.View style={{ opacity, transform: [{ translateY }] }}>
        {/* Encabezado */}
        <View style={styles.hero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>{book.name.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{book.name}</Text>
            <Text style={styles.author}>{book.author}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{book.genre}</Text>
            </View>
          </View>
        </View>

        {/* Sinopsis */}
        <Text style={styles.description}>{book.description}</Text>

        {/* Meta */}
        <View style={styles.metaGrid}>
          <MetaBox label="Año" value={String(book.year)} />
          <MetaBox label="Páginas" value={String(book.pages)} />
          <MetaBox label="Precio" value={`$${book.price.toFixed(2)}`} />
        </View>

        {/* Progreso de lectura */}
        <Text style={styles.section}>Progreso de lectura</Text>
        <ProgressBar
          progress={book.pages > 0 ? pagesRead / book.pages : 0}
          label={`${Math.round((pagesRead / book.pages) * 100)}% · ${pagesRead}/${book.pages} páginas`}
        />
        <View style={styles.actionsRow}>
          <AnimatedButton
            label="+25 páginas"
            variant="ghost"
            disabled={pagesRead >= book.pages}
            onPress={() => addPages(book.id, 25, book.pages)}
          />
        </View>

        {/* Mi lista */}
        <View style={styles.actionsRow}>
          <AnimatedButton
            label={inList ? '✓  En mi lista de lectura' : '＋  Agregar a mi lista'}
            variant={inList ? 'success' : 'primary'}
            onPress={toggleList}
          />
        </View>
      </Animated.View>
    </ScrollView>
  );
}

function MetaBox({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <View style={styles.metaBox}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxl, gap: SPACING.md },
  hero: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: { fontSize: 32, fontWeight: '800', color: COLORS.background },
  title: { ...TYPOGRAPHY.h2 },
  author: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  badgeText: { fontSize: 11, fontWeight: '700', color: COLORS.accentLight },
  description: { ...TYPOGRAPHY.body, lineHeight: 20 },
  metaGrid: { flexDirection: 'row', gap: SPACING.sm },
  metaBox: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.sm,
    alignItems: 'center',
  },
  metaLabel: { ...TYPOGRAPHY.caption, textTransform: 'uppercase' },
  metaValue: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.accentLight },
  section: { ...TYPOGRAPHY.label, textTransform: 'uppercase', letterSpacing: 0.8, marginTop: SPACING.sm },
  actionsRow: { marginTop: SPACING.xs },
});
