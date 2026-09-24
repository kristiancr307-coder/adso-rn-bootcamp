// src/components/FormField.tsx
// Componente REUTILIZABLE que encapsula: Controller + TextInput + mensaje de error.
// Se usa igual en CreateScreen y en EditScreen (rúbrica: no copiar código entre pantallas).
//
// ¿Por qué Controller y no register? El TextInput de React Native no es un <input>
// de HTML: no expone ref de la misma forma. Controller nos da value/onChangeText
// en su render prop, que es el contrato nativo de RN.

import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';

// Los TextInput entregan strings; los campos numéricos del form son numbers.
// Esta utilidad unifica el valor para mostrarlo siempre como string.
function toStringValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

// ──────────────────────────────────────────────────────────
// Props — genéricas sobre el formulario (sin any)
// ──────────────────────────────────────────────────────────

interface FormFieldProps<T extends FieldValues> extends TextInputProps {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  errorMessage?: string;
}

// ──────────────────────────────────────────────────────────
// Componente
// ──────────────────────────────────────────────────────────

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  errorMessage,
  ...textInputProps
}: FormFieldProps<T>): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, !!errorMessage && styles.inputError]}
            value={toStringValue(value)}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholderTextColor={COLORS.textMuted}
            {...textInputProps}
          />
        )}
      />

      {/* Mensaje de error — siempre reserva espacio para evitar saltos de layout */}
      <Text style={styles.error} numberOfLines={1}>
        {errorMessage ?? ''}
      </Text>
    </View>
  );
}

// ──────────────────────────────────────────────────────────
// Estilos
// ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { gap: SPACING.xs },
  label: { ...TYPOGRAPHY.label, textTransform: 'uppercase', letterSpacing: 0.6 },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  inputError: { borderColor: COLORS.error },
  error: { ...TYPOGRAPHY.error, minHeight: 16 },
});
