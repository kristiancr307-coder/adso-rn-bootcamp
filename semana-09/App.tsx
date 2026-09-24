// App.tsx — Punto de entrada del proyecto semana 09
// LayoutAnimation necesita habilitarse manualmente en Android (cuando el
// gestor lo soporta). Se hace UNA vez, antes de renderizar.

import React from 'react';
import { UIManager, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { RootNavigator } from './src/navigation/RootNavigator';

// Android clásico requiere el flag experimental. Con la guard, si el gestor
// no lo soporta (algunas combinaciones de New Architecture), simplemente no
// se activa y la app sigue funcionando — el detalle animado de entrada/salida
// de cada chip tiene su propia animación Animated como refuerzo.
if (
  Platform.OS === 'android' &&
  typeof UIManager.setLayoutAnimationEnabledExperimental === 'function'
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
