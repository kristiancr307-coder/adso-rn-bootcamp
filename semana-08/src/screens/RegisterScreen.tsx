// src/screens/RegisterScreen.tsx
// Registro con validación Zod completa (incluye confirmación de contraseña).
// dummyjson.com/users/add crea el usuario pero NO emite JWT (API de práctica),
// así que abrimos "sesión local": el store guarda el usuario sin tokens.

import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import { FormField } from '../components/FormField';
import { registerSchema, type RegisterFormData } from '../schemas/authSchema';
import { registerUser } from '../services/authService';
import { useAuthStore } from '../stores/authStore';
import type { AuthStackParamList } from '../navigation/types';

type AuthNavProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export function RegisterScreen(): React.JSX.Element {
  const navigation = useNavigation<AuthNavProp>();
  const setLocalSession = useAuthStore((state) => state.setLocalSession);
  const [serverError, setServerError] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' },
  });

  async function onSubmit(data: RegisterFormData): Promise<void> {
    setServerError('');
    try {
      const created = await registerUser(data);
      // Sesión local: autenticado sin JWT (la API fake no los emite al registrar)
      setLocalSession(created);
    } catch {
      setServerError('No se pudo crear la cuenta. Intenta de nuevo.');
    }
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
        <Text style={styles.title}>Crear cuenta de lector</Text>
        <Text style={styles.hint}>
          Únete al club de lectores de Editorial Luna.
        </Text>

        <FormField
          control={control}
          name="username"
          label="Usuario"
          placeholder="Mín. 4 caracteres"
          autoCapitalize="none"
          autoCorrect={false}
          errorMessage={errors.username?.message}
        />

        <FormField
          control={control}
          name="email"
          label="Correo electrónico"
          placeholder="tucorreo@ejemplo.com"
          autoCapitalize="none"
          keyboardType="email-address"
          errorMessage={errors.email?.message}
        />

        <FormField
          control={control}
          name="password"
          label="Contraseña"
          placeholder="Mín. 8 caracteres, con números"
          secureTextEntry
          autoCapitalize="none"
          errorMessage={errors.password?.message}
        />

        <FormField
          control={control}
          name="confirmPassword"
          label="Confirmar contraseña"
          placeholder="Repite la contraseña"
          secureTextEntry
          autoCapitalize="none"
          errorMessage={errors.confirmPassword?.message}
        />

        {serverError.length > 0 && (
          <Text style={styles.serverError}>{serverError}</Text>
        )}

        <Pressable
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? <ActivityIndicator size="small" color={COLORS.background} />
            : <Text style={styles.buttonText}>Crear cuenta</Text>
          }
        </Pressable>

        <Pressable style={styles.link} onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>
            Ya tengo cuenta — <Text style={styles.linkBold}>iniciar sesión</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  content: { padding: SPACING.xl, paddingBottom: SPACING.xxl, gap: SPACING.md },
  title: { ...TYPOGRAPHY.h2, textAlign: 'center' },
  hint: { ...TYPOGRAPHY.caption, textAlign: 'center', marginBottom: SPACING.sm },
  serverError: { ...TYPOGRAPHY.error, textAlign: 'center' },
  button: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  buttonDisabled: { opacity: 0.45 },
  buttonText: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.background },
  link: { alignItems: 'center', padding: SPACING.sm },
  linkText: { ...TYPOGRAPHY.body, color: COLORS.textSecondary },
  linkBold: { color: COLORS.accent, fontWeight: '700' },
});
