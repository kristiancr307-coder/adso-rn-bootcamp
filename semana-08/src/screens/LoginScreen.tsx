// src/screens/LoginScreen.tsx
// Login con React Hook Form + Zod → authService.login → authStore.
// Al hacer setSession, el RootNavigator cambia solo al stack protegido.

import React, { useState } from 'react';
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
import { FormField } from '../components/FormField';
import { loginSchema, type LoginFormData } from '../schemas/authSchema';
import { login } from '../services/authService';
import { useAuthStore } from '../stores/authStore';
import type { AuthStackParamList } from '../navigation/types';

type AuthNavProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export function LoginScreen(): React.JSX.Element {
  const navigation = useNavigation<AuthNavProp>();
  const setSession = useAuthStore((state) => state.setSession);
  const [serverError, setServerError] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  async function onSubmit(data: LoginFormData): Promise<void> {
    setServerError('');
    try {
      const session = await login(data.username, data.password);
      // Tokens ya están en SecureStore (los guarda authService).
      // El store dispara la navegación condicional.
      setSession(session, session.accessToken, session.refreshToken);
    } catch {
      setServerError('Usuario o contraseña incorrectos (API de práctica).');
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
        <Text style={styles.logo}>📚</Text>
        <Text style={styles.title}>Editorial Luna</Text>
        <Text style={styles.subtitle}>Inicia sesión para acceder al catálogo</Text>

        <View style={styles.demoBox}>
          <Text style={styles.demoText}>
            API de práctica — prueba con: emilys / emilyspass
          </Text>
        </View>

        <FormField
          control={control}
          name="username"
          label="Usuario"
          placeholder="Tu usuario…"
          autoCapitalize="none"
          autoCorrect={false}
          errorMessage={errors.username?.message}
        />

        <FormField
          control={control}
          name="password"
          label="Contraseña"
          placeholder="••••••••"
          secureTextEntry
          autoCapitalize="none"
          errorMessage={errors.password?.message}
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
            : <Text style={styles.buttonText}>Iniciar sesión</Text>
          }
        </Pressable>

        <Pressable style={styles.link} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>
            ¿No tienes cuenta? <Text style={styles.linkBold}>Crear cuenta</Text>
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
  logo: { fontSize: 48, textAlign: 'center', marginTop: SPACING.xl },
  title: { ...TYPOGRAPHY.h1, textAlign: 'center', color: COLORS.accentLight },
  subtitle: { ...TYPOGRAPHY.caption, textAlign: 'center', marginBottom: SPACING.sm },
  demoBox: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
  },
  demoText: { ...TYPOGRAPHY.caption, color: COLORS.accentLight, textAlign: 'center' },
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
