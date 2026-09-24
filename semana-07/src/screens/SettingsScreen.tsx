// src/screens/SettingsScreen.tsx
// Ajustes del catálogo — los 3 patrones de storage de la semana:
//
// 1. PREFERENCIAS (MMKV, respaldo AsyncStorage en Expo Go):
//    cambios en tiempo real, SIN botón "Guardar".
// 2. CACHÉ OFFLINE: botón para borrar la copia local de AsyncStorage.
// 3. DATO SENSIBLE (Expo SecureStore): "código de acceso de la editorial".
//    Regla de la rúbrica: el dato NUNCA se muestra en texto plano.

import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import {
  useCompactMode,
  useItemsPerPage,
  useSortOrder,
  useStorageBackendName,
  type SortOrder,
} from '../hooks/usePreferences';
import { ITEMS_QUERY_KEY } from '../hooks/useItems';

const CODE_KEY = 'editorial.accessCode';
const CACHE_KEY = '@editorial-luna/catalogo-v1';

// ──────────────────────────────────────────────
// PANTALLA
// ──────────────────────────────────────────────

export function SettingsScreen(): React.JSX.Element {
  const queryClient = useQueryClient();
  const backend = useStorageBackendName();

  const [sortOrder, setSortOrder] = useSortOrder();
  const [compact, setCompact] = useCompactMode();
  const [perPage, setPerPage] = useItemsPerPage();

  // Dato sensible con SecureStore
  const [code, setCode] = useState('');
  const [codeStatus, setCodeStatus] = useState<'empty' | 'saved' | 'ok' | 'bad'>('empty');
  const [checking, setChecking] = useState(false);

  async function handleSaveCode(): Promise<void> {
    if (code.trim().length < 4) {
      Alert.alert('Código muy corto', 'Usa al menos 4 caracteres.');
      return;
    }
    await SecureStore.setItemAsync(CODE_KEY, code.trim());
    setCode(''); // nunca mostramos el código guardado
    setCodeStatus('saved');
  }

  async function handleVerifyCode(): Promise<void> {
    if (code.trim().length === 0) {
      Alert.alert('Escribe el código', 'Ingresa el código para verificarlo.');
      return;
    }
    setChecking(true);
    const stored = await SecureStore.getItemAsync(CODE_KEY);
    setChecking(false);
    setCodeStatus(stored === code.trim() ? 'ok' : 'bad');
    setCode('');
  }

  async function handleClearCache(): Promise<void> {
    await AsyncStorage.removeItem(CACHE_KEY);
    await queryClient.invalidateQueries({ queryKey: ITEMS_QUERY_KEY });
    Alert.alert('Caché borrada', 'La próxima carga vendrá de la red.');
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Estado del backend de preferencias */}
      <View style={styles.backendPill}>
        <Text style={styles.backendText}>⚙️ Almacenamiento: {backend}</Text>
      </View>

      {/* ── 1. PREFERENCIAS ─────────────────────── */}
      <Text style={styles.section}>Preferencias del catálogo</Text>
      <Text style={styles.hint}>Los cambios se guardan al instante, sin botón.</Text>

      <Text style={styles.fieldLabel}>Ordenar por</Text>
      <View style={styles.segmentRow}>
        {(['title', 'year', 'price'] as SortOrder[]).map((option) => (
          <Pressable
            key={option}
            style={[styles.segment, sortOrder === option && styles.segmentActive]}
            onPress={() => setSortOrder(option)}
          >
            <Text
              style={[styles.segmentText, sortOrder === option && styles.segmentTextActive]}
            >
              {option === 'title' ? 'Título' : option === 'year' ? 'Año' : 'Precio'}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.fieldLabel}>Modo compacto</Text>
        <Switch
          value={compact}
          onValueChange={setCompact}
          trackColor={{ false: COLORS.border, true: COLORS.accent }}
          thumbColor={COLORS.text}
        />
      </View>

      <Text style={styles.fieldLabel}>Libros por carga</Text>
      <View style={styles.segmentRow}>
        {[5, 10, 15].map((option) => (
          <Pressable
            key={option}
            style={[styles.segment, perPage === option && styles.segmentActive]}
            onPress={() => setPerPage(option)}
          >
            <Text style={[styles.segmentText, perPage === option && styles.segmentTextActive]}>
              {option}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* ── 2. CACHÉ OFFLINE ────────────────────── */}
      <Text style={styles.section}>Caché offline</Text>
      <Text style={styles.hint}>
        Copia del catálogo guardada en AsyncStorage para leer sin conexión.
      </Text>
      <Pressable style={styles.ghostButton} onPress={() => void handleClearCache()}>
        <Text style={styles.ghostText}>Borrar caché guardada</Text>
      </Pressable>

      {/* ── 3. DATO SENSIBLE (SecureStore) ──────── */}
      <Text style={styles.section}>Seguridad</Text>
      <Text style={styles.hint}>
        El código se guarda CIFRADO con Expo SecureStore y jamás se muestra en pantalla.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Código de acceso de la editorial"
        placeholderTextColor={COLORS.textMuted}
        value={code}
        onChangeText={setCode}
        secureTextEntry
        autoCapitalize="none"
      />

      <View style={styles.codeButtons}>
        <Pressable style={styles.primaryButton} onPress={() => void handleSaveCode()}>
          <Text style={styles.primaryText}>Guardar código</Text>
        </Pressable>
        <Pressable style={styles.ghostButton} onPress={() => void handleVerifyCode()}>
          <Text style={styles.ghostText}>Verificar</Text>
        </Pressable>
      </View>

      {codeStatus === 'saved' && (
        <Text style={styles.statusOk}>🔐 Código guardado en SecureStore</Text>
      )}
      {codeStatus === 'ok' && (
        <Text style={styles.statusOk}>✅ El código coincide</Text>
      )}
      {codeStatus === 'bad' && (
        <Text style={styles.statusBad}>❌ El código no coincide</Text>
      )}
      {checking && <Text style={styles.hint}>Verificando…</Text>}
    </ScrollView>
  );
}

// ──────────────────────────────────────────────
// ESTILOS
// ──────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxl, gap: SPACING.sm },
  backendPill: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  backendText: { ...TYPOGRAPHY.caption, color: COLORS.accentLight },
  section: { ...TYPOGRAPHY.h3, marginTop: SPACING.lg },
  hint: { ...TYPOGRAPHY.caption, fontStyle: 'italic' },
  fieldLabel: { ...TYPOGRAPHY.label, textTransform: 'uppercase', letterSpacing: 0.6 },
  segmentRow: { flexDirection: 'row', gap: SPACING.sm },
  segment: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    alignItems: 'center',
  },
  segmentActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  segmentText: { ...TYPOGRAPHY.body, color: COLORS.textSecondary },
  segmentTextActive: { color: COLORS.background, fontWeight: '700' },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  codeButtons: { flexDirection: 'row', gap: SPACING.sm },
  primaryButton: {
    flex: 1,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    alignItems: 'center',
  },
  primaryText: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.background },
  ghostButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    alignItems: 'center',
  },
  ghostText: { ...TYPOGRAPHY.body, color: COLORS.accentLight },
  statusOk: { ...TYPOGRAPHY.body, color: COLORS.success },
  statusBad: { ...TYPOGRAPHY.body, color: COLORS.errorLight },
});
