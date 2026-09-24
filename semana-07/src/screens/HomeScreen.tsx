// src/screens/HomeScreen.tsx
// Catálogo que consume las PREFERENCIAS persistentes (orden, modo compacto,
// libros por página) y muestra un banner cuando se sirve desde la CACHÉ
// offline de AsyncStorage.

import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import { useItems } from '../hooks/useItems';
import { useCompactMode, useItemsPerPage, useSortOrder, type SortOrder } from '../hooks/usePreferences';
import type { Item } from '../types';
import type { RootStackParamList } from '../navigation/types';

type HomeNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const SORT_LABEL: Record<SortOrder, string> = {
  title: 'título',
  year: 'año',
  price: 'precio',
};

// ──────────────────────────────────────────────
// PANTALLA
// ──────────────────────────────────────────────

export function HomeScreen(): React.JSX.Element {
  const navigation = useNavigation<HomeNavProp>();
  const { data, isLoading, isError, isFetching, refetch } = useItems();
  const [sortOrder] = useSortOrder();
  const [compact] = useCompactMode();
  const [perPage] = useItemsPerPage();

  // Ordena según la preferencia persistida y corta en itemsPerPage
  const visible = useMemo(() => {
    const arr = [...(data?.items ?? [])];
    switch (sortOrder) {
      case 'year':
        arr.sort((a, b) => b.year - a.year);
        break;
      case 'price':
        arr.sort((a, b) => a.price - b.price);
        break;
      default:
        arr.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    }
    return arr.slice(0, perPage);
  }, [data, sortOrder, perPage]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Sin conexión y sin caché previa</Text>
        <Pressable style={styles.retryBtn} onPress={() => void refetch()}>
          <Text style={styles.retryText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      {/* Banner OFFLINE — aparece cuando la respuesta vino de AsyncStorage */}
      {data?.source === 'cache' && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>
            ⚠️ Mostrando catálogo guardado en el dispositivo (sin conexión)
          </Text>
        </View>
      )}

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.content}
        data={visible}
        keyExtractor={(book) => String(book.id)}
        refreshing={isFetching && !isLoading}
        onRefresh={refetch}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay libros para mostrar.</Text>
        }
        ListHeaderComponent={
          <Text style={styles.count}>
            {visible.length} de {data?.items.length ?? 0} libros · orden por {SORT_LABEL[sortOrder]}
          </Text>
        }
        renderItem={({ item }) => <BookRow book={item} compact={compact} />}
      />
    </View>
  );
}

// ──────────────────────────────────────────────
// SUB-COMPONENTE: fila (normal / compacta según preferencia)
// ──────────────────────────────────────────────

interface BookRowProps { book: Item; compact: boolean }

function BookRow({ book, compact }: BookRowProps): React.JSX.Element {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        compact && styles.rowCompact,
        pressed && { opacity: 0.7 },
      ]}
    >
      <View style={[styles.avatar, compact && styles.avatarCompact]}>
        <Text style={compact ? styles.avatarLetterCompact : styles.avatarLetter}>
          {book.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.rowText}>
        <Text style={compact ? styles.rowTitleCompact : styles.rowTitle} numberOfLines={1}>
          {book.name}
        </Text>
        {!compact && (
          <Text style={styles.rowSub} numberOfLines={1}>
            {book.author} · {book.year} · {book.genre}
          </Text>
        )}
      </View>
      <Text style={styles.price}>${book.price.toFixed(2)}</Text>
    </Pressable>
  );
}

// ──────────────────────────────────────────────
// ESTILOS
// ──────────────────────────────────────────────

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  list: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, gap: SPACING.sm, paddingBottom: SPACING.xxl },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: SPACING.md, backgroundColor: COLORS.background },
  offlineBanner: {
    backgroundColor: COLORS.warning,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  offlineText: { color: COLORS.background, fontWeight: '700', fontSize: 12 },
  errorText: { ...TYPOGRAPHY.h3, color: COLORS.errorLight },
  retryBtn: { backgroundColor: COLORS.accent, borderRadius: RADIUS.sm, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.sm },
  retryText: { ...TYPOGRAPHY.body, fontWeight: '600', color: COLORS.background },
  empty: { ...TYPOGRAPHY.caption, textAlign: 'center', marginTop: SPACING.xxl },
  count: { ...TYPOGRAPHY.label, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: SPACING.sm },
  row: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowCompact: { paddingVertical: SPACING.xs, minHeight: 0 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  avatarCompact: { width: 26, height: 26 },
  avatarLetter: { ...TYPOGRAPHY.h3, color: COLORS.accent },
  avatarLetterCompact: { fontSize: 12, fontWeight: '700', color: COLORS.accent },
  rowText: { flex: 1 },
  rowTitle: { ...TYPOGRAPHY.body, fontWeight: '600' },
  rowTitleCompact: { fontSize: 12, fontWeight: '600', color: COLORS.text },
  rowSub: { ...TYPOGRAPHY.caption },
  price: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.accent, marginLeft: SPACING.sm },
});
