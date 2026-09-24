// src/hooks/useProfile.ts
// Perfil del usuario autenticado — llamada PROTEGIDA con TanStack Query.
// Solo se ejecuta si hay accessToken (sesión iniciada con login JWT).
// En sesión local (registro) cae al usuario guardado en el store.

import { useQuery } from '@tanstack/react-query';

import { fetchMe } from '../services/authService';
import { useAuthStore } from '../stores/authStore';
import type { User } from '../types';

export function useProfile() {
  const token = useAuthStore((state) => state.accessToken);
  const localUser = useAuthStore((state) => state.user);

  return useQuery<User>({
    queryKey: ['profile'],
    queryFn: fetchMe,
    enabled: !!token, // sin token no llamamos al endpoint protegido
    staleTime: 5 * 60_000,
    initialData: token ? undefined : (localUser ?? undefined),
  });
}
