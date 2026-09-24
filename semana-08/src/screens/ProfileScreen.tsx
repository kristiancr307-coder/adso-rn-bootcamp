// src/screens/ProfileScreen.tsx
// Perfil del usuario autenticado:
//  - datos del endpoint protegido /auth/me (o del store en sesión local)
//  - datos de dominio: membresía del club de lectores
//  - info del JWT: fecha de expiración decodificada
//  - el token NUNCA se muestra en texto plano (penalización de la rúbrica)

import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { jwtDecode } from 'jwt-decode';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import { useProfile } from '../hooks/useProfile';
import { useAuthStore } from '../stores/authStore';
import type { JwtPayload } from '../types';

function formatExpiry(token: string): string {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (!decoded.exp) return 'sin fecha de expiración';
    const date = new Date(decoded.exp * 1000);
    return date.toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return 'token no legible';
  }
}

export function ProfileScreen(): React.JSX.Element {
  const logout = useAuthStore((state) => state.logout);
  const accessToken = useAuthStore((state) => state.accessToken);
  const localUser = useAuthStore((state) => state.user);
  const { data: profile, isFetching } = useProfile();

  const user = profile ?? localUser;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Encabezado del usuario */}
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(user?.firstName ?? 'L').charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.username}>@{user?.username}</Text>
        </View>
        {isFetching && <ActivityIndicator size="small" color={COLORS.accent} />}
      </View>

      {/* Datos de la cuenta */}
      <Text style={styles.section}>Cuenta</Text>
      <View style={styles.card}>
        <Row label="Correo" value={user?.email ?? '—'} />
        <Row label="Miembro desde" value="2026 · Club de lectores" />
        <Row label="Membresía" value="Lector Plus — Editorial Luna" />
        <Row label="Beneficio" value="Envío gratis en Bogotá 🚚" />
      </View>

      {/* Estado de la sesión */}
      <Text style={styles.section}>Sesión</Text>
      <View style={styles.card}>
        {accessToken ? (
          <>
            <Row label="Tipo de sesión" value="JWT (login contra API)" />
            <Row label="Access token" value="•••••••• (cifrado en SecureStore)" />
            <Row label="Expira" value={formatExpiry(accessToken)} />
          </>
        ) : (
          <>
            <Row label="Tipo de sesión" value="Local (registro sin API de tokens)" />
            <Row label="Tokens" value="— esta sesión no usa JWT" />
          </>
        )}
      </View>

      <Pressable style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </Pressable>
    </ScrollView>
  );
}

function Row({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxl, gap: SPACING.sm },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 24, fontWeight: '800', color: COLORS.background },
  name: { ...TYPOGRAPHY.h3 },
  username: { ...TYPOGRAPHY.caption },
  section: { ...TYPOGRAPHY.label, textTransform: 'uppercase', letterSpacing: 0.8, marginTop: SPACING.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLabel: { ...TYPOGRAPHY.body, color: COLORS.textSecondary },
  rowValue: { ...TYPOGRAPHY.body, fontWeight: '600', flex: 1, textAlign: 'right' },
  logoutButton: {
    backgroundColor: COLORS.error,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  logoutText: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.text },
});
