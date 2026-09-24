// src/stores/authStore.ts
// Estado global de autenticación con Zustand + persist.
//
// Clave de la semana — `partialize`: SOLO persistimos lo no sensible
// (user, isAuthenticated). Los tokens JAMÁS entran al storage persistido:
// viven en SecureStore (tokenService). Al reabrir la app el usuario sigue
// "logueado" y los tokens se rehidratan desde SecureStore en App.tsx.

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { User } from '../types';
import { clearTokens } from '../services/tokenService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  /** Guarda la sesión completa tras un login con tokens */
  setSession: (user: User, access: string | null, refresh: string | null) => void;
  /** Sesión local (registro): usuario sin JWT */
  setLocalSession: (user: User) => void;
  /** Actualiza solo los tokens (lo usa el interceptor tras el refresh) */
  setTokens: (access: string, refresh: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,

      setSession: (user, access, refresh) =>
        set({ user, isAuthenticated: true, accessToken: access, refreshToken: refresh }),

      setLocalSession: (user) =>
        set({ user, isAuthenticated: true, accessToken: null, refreshToken: null }),

      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),

      logout: () => {
        void clearTokens(); // borra también de SecureStore
        set({ user: null, isAuthenticated: false, accessToken: null, refreshToken: null });
      },
    }),
    {
      name: 'editorial-auth',
      storage: createJSONStorage(() => AsyncStorage),
      // ⚠️ partialize: los tokens quedan FUERA del persist
      partialize: (state) =>
        ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }) as unknown as AuthState,
    },
  ),
);
