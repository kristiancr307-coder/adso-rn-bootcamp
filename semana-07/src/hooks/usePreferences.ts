// src/hooks/usePreferences.ts
// Preferencias del catálogo con MMKV — y respaldo automático en Expo Go.
//
// - Con build nativo: lee/escribe en MMKV (sincrónico, sin async/await) y
//   se suscribe a addOnValuesChangedListener para reactividad real.
// - En Expo Go (sin módulo nativo): mismo contrato con AsyncStorage + un
//   mini-bus de eventos. La UI no nota la diferencia.

import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getMmkv, isMmkvAvailable } from '../storage/mmkv';

export type SortOrder = 'title' | 'year' | 'price';

const KEY_SORT = 'prefs.sortOrder';
const KEY_COMPACT = 'prefs.compactMode';
const KEY_PER_PAGE = 'prefs.itemsPerPage';

// ─────────────────────────────────────────
// Bus de cambios (reactividad unificada)
// ─────────────────────────────────────────

type Listener = (changedKeys: string[]) => void;
const listeners = new Set<Listener>();

function emitChange(keys: string[]): void {
  listeners.forEach((listener) => listener(keys));
}

const mmkv = getMmkv();

// Con MMKV disponible, suscribimos el bus a los cambios del storage nativo
if (mmkv) {
  mmkv.addOnValuesChangedListener((keys) => emitChange(keys));
}

// ─────────────────────────────────────────
// Lectura/escritura unificada (string crudo por clave)
// ─────────────────────────────────────────

const asyncCache = new Map<string, string>();

function readRaw(key: string): string | undefined {
  if (mmkv) return mmkv.getString(key);
  return asyncCache.get(key);
}

async function loadRaw(key: string): Promise<string | undefined> {
  if (mmkv) return mmkv.getString(key);
  const raw = (await AsyncStorage.getItem(key)) ?? undefined;
  if (raw !== undefined) asyncCache.set(key, raw);
  return raw;
}

async function writeRaw(key: string, value: string): Promise<void> {
  if (mmkv) {
    mmkv.set(key, value); // MMKV dispara el listener → emite solo
    return;
  }
  await AsyncStorage.setItem(key, value);
  asyncCache.set(key, value);
  emitChange([key]); // en AsyncStorage el emit lo hacemos nosotros
}

// ─────────────────────────────────────────
// Hook genérico reactivo
// ─────────────────────────────────────────

function usePref<T>(
  key: string,
  defaultValue: T,
  parse: (raw: string) => T,
  serialize: (value: T) => string,
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    const raw = readRaw(key);
    return raw === undefined ? defaultValue : parse(raw);
  });

  useEffect(() => {
    let active = true;

    // Primera carga (solo importa en el camino AsyncStorage, que es async)
    void loadRaw(key).then((raw) => {
      if (active && raw !== undefined) setValue(parse(raw));
    });

    // Suscripción al bus: cualquier escritura (de esta u otra pantalla) avisa
    const listener: Listener = (changed) => {
      if (!changed.includes(key)) return;
      const raw = readRaw(key);
      setValue(raw === undefined ? defaultValue : parse(raw));
    };
    listeners.add(listener);

    return () => {
      active = false;
      listeners.delete(listener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const set = useCallback(
    (next: T) => {
      void writeRaw(key, serialize(next));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );

  return [value, set];
}

// ─────────────────────────────────────────
// Preferencias del dominio Editorial
// ─────────────────────────────────────────

/** Orden del catálogo: por título, año o precio */
export function useSortOrder(): [SortOrder, (value: SortOrder) => void] {
  return usePref<SortOrder>(
    KEY_SORT,
    'title',
    (raw) => (raw === 'year' || raw === 'price' ? raw : 'title'),
    (value) => value,
  );
}

/** Modo compacto de las filas del catálogo */
export function useCompactMode(): [boolean, (value: boolean) => void] {
  return usePref<boolean>(
    KEY_COMPACT,
    false,
    (raw) => raw === 'true',
    (value) => (value ? 'true' : 'false'),
  );
}

/** Libros visibles por carga: 5, 10 o 15 */
export function useItemsPerPage(): [number, (value: number) => void] {
  return usePref<number>(
    KEY_PER_PAGE,
    10,
    (raw) => {
      const n = Number(raw);
      return n === 5 || n === 10 || n === 15 ? n : 10;
    },
    (value) => String(value),
  );
}

/** Nombre del backend activo — para transparencia en Settings */
export function useStorageBackendName(): string {
  return isMmkvAvailable
    ? 'MMKV (nativo, sincrónico)'
    : 'AsyncStorage (respaldo en Expo Go)';
}
