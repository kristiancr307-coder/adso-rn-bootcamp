// src/navigation/RootNavigator.tsx
// NAVEGACIÓN CONDICIONAL — el corazón de la semana:
//   isAuthenticated === false → AuthNavigator (Login / Register)
//   isAuthenticated === true  → AppNavigator (Home / Profile)
// El cambio es automático: al hacer login, el store cambia y React Navigation
// monta el stack protegido sin navegación manual.

import React from 'react';

import { useAuthStore } from '../stores/authStore';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';

export function RootNavigator(): React.JSX.Element {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return isAuthenticated ? <AppNavigator /> : <AuthNavigator />;
}
