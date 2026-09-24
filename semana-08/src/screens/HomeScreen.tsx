// src/screens/HomeScreen.tsx
// Catálogo Editorial Luna del usuario autenticado — con saludo personalizado.

import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import { BOOKS } from '../data/mockData';
import { useAuthStore } from '../stores/authStore';
import type { Item } from '../types';

export function HomeScreen(): React.JSX.Element {
  const user = useAuthStore((state) => state.user);

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.content}
      data={BOOKS}
      keyExtractor={(book) => String(book.id)}
      ListHeaderComponent={
        <View style={styles.headerWrap}>
          <Text style={styles.greeting}>
            Hola, {user?.firstName ?? 'lector'} 👋
          </Text>
          <Text style={styles.greetingSub}>
            {BOOKS.length} libros disponibles para ti hoy
          </Text>
        </View>
      }
      renderItem={({ item }) => <BookRow book={item} />}
    />
  );
}

function BookRow({ book }: { book: Item }): React.JSX.Element {
  return (
    <View style={styles.row}>
      <View style={styles.avatar}>
        <Text style={styles.avatarLetter}>{book.name.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle} numberOfLines={1}>{book.name}</Text>
        <Text style={styles.rowSub} numberOfLines={1}>
          {book.author} · {book.year} · {book.genre}
        </Text>
      </View>
      <Text style={styles.price}>${book.price.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, gap: SPACING.sm, paddingBottom: SPACING.xxl },
  headerWrap: { marginBottom: SPACING.sm },
  greeting: { ...TYPOGRAPHY.h2, color: COLORS.accentLight },
  greetingSub: { ...TYPOGRAPHY.caption },
  row: {
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
  rowTitle: { ...TYPOGRAPHY.body, fontWeight: '600' },
  rowSub: { ...TYPOGRAPHY.caption },
  price: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.accent, marginLeft: SPACING.sm },
});
