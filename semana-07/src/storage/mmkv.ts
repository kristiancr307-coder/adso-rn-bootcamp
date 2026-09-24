// src/storage/mmkv.ts
// Instancia global de MMKV con detección de entorno.
//
// MMKV es un módulo NATIVO (vía Nitro Modules): es lo más rápido que hay en
// RN (lecturas/escrituras sincrónicas), pero NO está incluido en Expo Go.
// Por eso el acceso se hace con require() diferido dentro de try/catch:
//
// - Build nativo (expo run:android / run:ios) → usa MMKV real.
// - Expo Go → la creación falla y devolvemos null; la app detecta el entorno
//   y usa un respaldo con AsyncStorage (mismo contrato, ver usePreferences).
//
// Así el proyecto se puede DEMOSTRAR en Expo Go sin trampas: el código MMKV
// está y se ejecuta cuando hay soporte nativo.

interface MmkvInstance {
  getString(key: string): string | undefined;
  set(key: string, value: string | number | boolean): void;
  delete(key: string): void;
  addOnValuesChangedListener(cb: (changedKeys: string[]) => void): () => void;
}

type MmkvConstructor = new (options?: { id?: string }) => MmkvInstance;

// 1) Resolver la clase MMKV sin romper el bundle en Expo Go
let MMKVClass: MmkvConstructor | null = null;
try {
  // require() diferido: si el módulo nativo no existe, capturamos el error
  const mmkvModule = require('react-native-mmkv') as { MMKV?: MmkvConstructor };
  MMKVClass = mmkvModule.MMKV ?? null;
} catch {
  MMKVClass = null;
}

// 2) Crear la instancia una sola vez (lazy singleton)
let instance: MmkvInstance | null = null;
let tried = false;

export function getMmkv(): MmkvInstance | null {
  if (tried) return instance;
  tried = true;
  if (MMKVClass) {
    try {
      instance = new MMKVClass({ id: 'editorial-luna' });
    } catch {
      instance = null; // Expo Go: no hay soporte nativo
    }
  }
  return instance;
}

export const isMmkvAvailable = getMmkv() !== null;
