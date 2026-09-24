// src/screens/EditScreen.tsx
// Formulario para editar un libro existente.
// Patrón clave de esta semana: los datos llegan con useItemById y se
// inyectan al formulario con reset() dentro de un useEffect. Sin ese
// reset, los campos quedarían vacíos aunque el servidor ya respondió.

import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import type { RootStackParamList } from '../navigation/types';
import { FormField } from '../components/FormField';
import { itemSchema, type ItemFormData, type ItemFormInput } from '../schemas/itemSchema';
import { useItemById, useUpdateItem } from '../hooks/useItems';

type EditNavProp = NativeStackNavigationProp<RootStackParamList, 'Edit'>;
type EditRouteProp = RouteProp<RootStackParamList, 'Edit'>;

// ──────────────────────────────────────────────
// PANTALLA
// ──────────────────────────────────────────────

export function EditScreen(): React.JSX.Element {
  const navigation = useNavigation<EditNavProp>();
  const route = useRoute<EditRouteProp>();
  const { id } = route.params;

  // Libro actual — initialData precarga desde la caché del catálogo
  const { data: item, isLoading, isError, refetch } = useItemById(id);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ItemFormInput, unknown, ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: '',
      author: '',
      genre: '',
      year: '',
      pages: '',
      price: '',
      description: '',
    },
  });

  // Cuando el libro llega (o cambia), rellenamos el formulario.
  // [item, reset] → si item pasa de undefined a objeto, el efecto corre.
  useEffect(() => {
    if (item) {
      reset({
        name: item.name,
        author: item.author,
        genre: item.genre,
        year: item.year,
        pages: item.pages,
        price: item.price,
        description: item.description ?? '',
      });
    }
  }, [item, reset]);

  const { mutate: updateItem, isPending } = useUpdateItem();

  function onSubmit(data: ItemFormData): void {
    updateItem(
      {
        id,
        name: data.name,
        author: data.author,
        genre: data.genre,
        year: data.year,
        pages: data.pages,
        price: data.price,
        description: data.description ?? '',
      },
      { onSuccess: () => navigation.goBack() },
    );
  }

  // isDirty evita guardars sin cambios; isPending cubre la mutation
  const canSubmit = !isSubmitting && !isPending && isDirty;

  // Mientras llega el libro del servidor
  if (isLoading && !item) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  // Solo si NO hay datos en caché ni del servidor
  if (!item) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No se pudo cargar el libro</Text>
        <Pressable style={styles.retryBtn} onPress={() => void refetch()}>
          <Text style={styles.retryText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.hint}>
          Los campos se rellenan con los datos actuales del libro.
          Modifica lo que necesites y guarda.
        </Text>

        {/* Mismos FormField que en CreateScreen — cero código duplicado */}

        <FormField
          control={control}
          name="name"
          label="Título *"
          placeholder="Título del libro…"
          returnKeyType="next"
          errorMessage={errors.name?.message}
        />

        <FormField
          control={control}
          name="author"
          label="Autor *"
          placeholder="Autor del libro…"
          returnKeyType="next"
          errorMessage={errors.author?.message}
        />

        <FormField
          control={control}
          name="genre"
          label="Género *"
          placeholder="Género del libro…"
          returnKeyType="next"
          errorMessage={errors.genre?.message}
        />

        <FormField
          control={control}
          name="year"
          label="Año de publicación *"
          placeholder="Año…"
          keyboardType="numeric"
          returnKeyType="next"
          errorMessage={errors.year?.message}
        />

        <FormField
          control={control}
          name="pages"
          label="Páginas *"
          placeholder="Páginas…"
          keyboardType="numeric"
          returnKeyType="next"
          errorMessage={errors.pages?.message}
        />

        <FormField
          control={control}
          name="price"
          label="Precio (USD) *"
          placeholder="Precio…"
          keyboardType="decimal-pad"
          returnKeyType="next"
          errorMessage={errors.price?.message}
        />

        <FormField
          control={control}
          name="description"
          label="Descripción"
          placeholder="Sinopsis…"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          errorMessage={errors.description?.message}
        />

        <View style={styles.actions}>
          <Pressable
            style={[styles.button, !canSubmit && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={!canSubmit}
          >
            {isSubmitting || isPending
              ? <ActivityIndicator size="small" color={COLORS.background} />
              : <Text style={styles.buttonText}>Guardar cambios</Text>
            }
          </Pressable>

          <Pressable style={styles.cancel} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </Pressable>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ──────────────────────────────────────────────
// ESTILOS
// ──────────────────────────────────────────────

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  content: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxl },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  hint: { ...TYPOGRAPHY.caption, fontStyle: 'italic' },
  actions: { gap: SPACING.sm, marginTop: SPACING.sm },
  button: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.45 },
  buttonText: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.background },
  cancel: { alignItems: 'center', padding: SPACING.sm },
  cancelText: { ...TYPOGRAPHY.body, color: COLORS.textMuted },
  errorText: { ...TYPOGRAPHY.h3, color: COLORS.errorLight },
  retryBtn: { backgroundColor: COLORS.accent, borderRadius: RADIUS.sm, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.sm, marginTop: SPACING.md },
  retryText: { ...TYPOGRAPHY.body, fontWeight: '600', color: COLORS.background },
});
