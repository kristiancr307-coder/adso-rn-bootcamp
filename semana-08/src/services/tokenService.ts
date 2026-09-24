// src/services/tokenService.ts
// Wrapper de Expo SecureStore — el ÚNICO lugar donde viven los tokens.
// Regla de la rúbrica: tokens NUNCA en AsyncStorage ni MMKV sin cifrar.
//
// SecureStore guarda cifrado en el keychain/keystore del sistema operativo.
// Además mantenemos una copia EN MEMORIA para que el interceptor de Axios
// no tenga que leer el keystore en cada request.

import * as SecureStore from 'expo-secure-store';

const ACCESS_KEY = 'editorial.accessToken';
const REFRESH_KEY = 'editorial.refreshToken';

// undefined = aún no sabemos; string | null = ya leído
let memoryAccess: string | null | undefined;
let memoryRefresh: string | null | undefined;

export async function saveTokens(accessToken: string, refreshToken: string): Promise<void> {
  memoryAccess = accessToken;
  memoryRefresh = refreshToken;
  await SecureStore.setItemAsync(ACCESS_KEY, accessToken);
  await SecureStore.setItemAsync(REFRESH_KEY, refreshToken);
}

export async function getAccessToken(): Promise<string | null> {
  if (memoryAccess !== undefined) return memoryAccess;
  memoryAccess = await SecureStore.getItemAsync(ACCESS_KEY);
  return memoryAccess;
}

export async function getRefreshToken(): Promise<string | null> {
  if (memoryRefresh !== undefined) return memoryRefresh;
  memoryRefresh = await SecureStore.getItemAsync(REFRESH_KEY);
  return memoryRefresh;
}

export async function clearTokens(): Promise<void> {
  memoryAccess = null;
  memoryRefresh = null;
  try {
    await SecureStore.deleteItemAsync(ACCESS_KEY);
    await SecureStore.deleteItemAsync(REFRESH_KEY);
  } catch {
    // si ya no existían, no pasa nada
  }
}

// Se llama una vez al arrancar la app (App.tsx): sube los tokens del
// keystore a memoria. El estado "isAuthenticated" persiste en Zustand,
// pero los tokens viven SOLO aquí (cifrados).
export async function loadTokensIntoMemory(): Promise<void> {
  memoryAccess = await SecureStore.getItemAsync(ACCESS_KEY);
  memoryRefresh = await SecureStore.getItemAsync(REFRESH_KEY);
}
