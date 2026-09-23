import { useRoute, type RouteProp } from '@react-navigation/native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import type { HomeStackParamList } from '../navigation/types';

type DetailScreenRouteProp = RouteProp<HomeStackParamList, 'HomeDetail'>;

export function DetailScreen(): React.JSX.Element {
  const route = useRoute<DetailScreenRouteProp>();
  const { name, description, author, year, genre, pages, price } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.name}>{name}</Text>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>{genre}</Text>
      </View>

      <Text style={styles.description}>{description}</Text>

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Autor</Text>
        <Text style={styles.fieldValue}>{author}</Text>
      </View>
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Año</Text>
        <Text style={styles.fieldValue}>{year}</Text>
      </View>
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Páginas</Text>
        <Text style={styles.fieldValue}>{pages}</Text>
      </View>
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Precio</Text>
        <Text style={styles.fieldValue}>${price.toLocaleString('es-CO')}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.base, gap: SPACING.md },
  name: { fontSize: TYPOGRAPHY.size.xl, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.textPrimary, marginBottom: SPACING.xs },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.accentDim,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.md,
  },
  badgeText: { fontSize: TYPOGRAPHY.size.xs, fontWeight: TYPOGRAPHY.weight.medium, color: COLORS.accent },
  description: { fontSize: TYPOGRAPHY.size.base, color: COLORS.textSecondary, lineHeight: 22, marginBottom: SPACING.sm },
  field: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  fieldLabel: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.medium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldValue: { fontSize: TYPOGRAPHY.size.base, color: COLORS.textPrimary },
});
