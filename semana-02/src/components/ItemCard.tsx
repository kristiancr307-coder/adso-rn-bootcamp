import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Item } from '../types';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../theme';

interface ItemCardProps {
  item: Item;
  onPress: (item: Item) => void;
}

export function ItemCard({ item, onPress }: ItemCardProps): React.JSX.Element {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress(item)}
      accessibilityRole="button"
      accessibilityLabel={item.name}
    >
      <Image source={{ uri: item.imageUri }} style={styles.image} resizeMode="cover" />
      <View style={styles.info}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.fieldText}>{item.author} · {item.year}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.genre}</Text>
        </View>
      </View>
      <Text style={styles.price}>${item.price.toLocaleString('es-CO')}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginHorizontal: SPACING.base,
    marginVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardPressed: { backgroundColor: COLORS.surfaceAlt },
  image: { width: 48, height: 68, borderRadius: RADIUS.sm, marginRight: SPACING.md },
  info: { flex: 1 },
  itemName: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  fieldText: { fontSize: TYPOGRAPHY.size.sm, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accentDim,
  },
  badgeText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.accent,
  },
  price: { fontSize: TYPOGRAPHY.size.sm, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.textPrimary, marginLeft: SPACING.sm },
});