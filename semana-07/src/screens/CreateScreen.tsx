// src/screens/CreateScreen.tsx
// Formulario para crear un libro nuevo.
// React Hook Form (useForm + Controller) + validación Zod (zodResolver)
// + mutation de TanStack Query (useCreateItem). Al guardar con éxito → goBack().

import React from 'react';
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
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import type { RootStackParamList } from '../navigation/types';
import { FormField } from '../components/FormField';
import { itemSchema, type ItemFormData, type ItemFormInput } from '../schemas/itemSchema';
import { useCreateItem } from '../hooks/useItems';

type CreateNavProp = NativeStackNavigationProp<RootStackParamList, 'Create'>;

// ──────────────────────────────────────────────
// PANTALLA
// ──────────────────────────────────────────────

export function CreateScreen(): React.JSX.Element {
  const navigation = useNavigation<CreateNavProp>();

  // zodResolver conecta el schema con el formulario:
  // valida en cada submit (y en blur/touch) y llena formState.errors.
  // Generics: input del schema → contexto → salida tipada (ItemFormData).
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
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

  const { mutate: createItem, isPending } = useCreateItem();

  // "data" ya viene validado y coercionado por Zod: year/pages/price son number
  function onSubmit(data: ItemFormData): void {
    createItem(
      {
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

  const canSubmit = !isSubmitting && !isPending;

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
          Completa los datos del nuevo libro del catálogo de Editorial Luna.
        </Text>

        <FormField
          control={control}
          name="name"
          label="Título *"
          placeholder="Ej. Cien años de soledad…"
          returnKeyType="next"
          errorMessage={errors.name?.message}
        />

        <FormField
          control={control}
          name="author"
          label="Autor *"
          placeholder="Ej. Gabriel García Márquez…"
          returnKeyType="next"
          errorMessage={errors.author?.message}
        />

        <FormField
          control={control}
          name="genre"
          label="Género *"
          placeholder="Ej. Novela, Poesía, Ensayo…"
          returnKeyType="next"
          errorMessage={errors.genre?.message}
        />

        <FormField
          control={control}
          name="year"
          label="Año de publicación *"
          placeholder="Ej. 1967"
          keyboardType="numeric"
          returnKeyType="next"
          errorMessage={errors.year?.message}
        />

        <FormField
          control={control}
          name="pages"
          label="Páginas *"
          placeholder="Ej. 417"
          keyboardType="numeric"
          returnKeyType="next"
          errorMessage={errors.pages?.message}
        />

        <FormField
          control={control}
          name="price"
          label="Precio (USD) *"
          placeholder="Ej. 19.99"
          keyboardType="decimal-pad"
          returnKeyType="next"
          errorMessage={errors.price?.message}
        />

        <FormField
          control={control}
          name="description"
          label="Descripción"
          placeholder="Sinopsis opcional del libro…"
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
              : <Text style={styles.buttonText}>Crear libro</Text>
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
});
