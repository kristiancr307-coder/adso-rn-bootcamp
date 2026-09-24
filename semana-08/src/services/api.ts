// src/services/api.ts
// Instancia de Axios con interceptor de refresh para respuestas 401.
//
// Flujo del interceptor:
//   request  → agrega Authorization: Bearer <accessToken> (desde SecureStore/memoria)
//   response → si llega 401 y hay refreshToken:
//                1. refresca UNA sola vez (single-flight con refreshPromise)
//                2. guarda los tokens nuevos
//                3. reintenta la petición original
//              si el refresh también falla → logout automático.
//
// El refresh usa axios "pelado" (no apiClient) para no disparar los
// interceptores y evitar bucles infinitos.

import axios from 'axios';

import { useAuthStore } from '../stores/authStore';
import { getAccessToken, getRefreshToken, saveTokens } from './tokenService';

export const apiClient = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request: adjuntar el token ─────────────────────────
apiClient.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response: renovar en 401 ───────────────────────────
let refreshPromise: Promise<string | null> | null = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config ?? {};

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      // single-flight: si 5 peticiones fallan a la vez, se hace UN refresh
      refreshPromise ??= refreshTokens().finally(() => {
        refreshPromise = null;
      });

      const newToken = await refreshPromise;

      if (newToken) {
        original.headers = { ...original.headers, Authorization: `Bearer ${newToken}` };
        return apiClient(original); // reintento con el token renovado
      }

      // No se pudo renovar → sesión inválida
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  },
);

async function refreshTokens(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;

  try {
    const { data } = await axios.post<{ accessToken: string; refreshToken: string }>(
      'https://dummyjson.com/auth/refresh',
      { refreshToken, expiresInMins: 30 },
    );
    await saveTokens(data.accessToken, data.refreshToken);
    useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);
    return data.accessToken;
  } catch {
    return null;
  }
}
