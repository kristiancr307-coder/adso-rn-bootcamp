// App.tsx — Punto de entrada del proyecto semana 08
// QueryClientProvider + NavigationContainer + rehidratación de tokens

import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { RootNavigator } from './src/navigation/RootNavigator';
import { loadTokensIntoMemory } from './src/services/tokenService';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App(): React.JSX.Element {
  // Al arrancar: subimos los tokens de SecureStore a memoria para que el
  // interceptor de Axios pueda usarlos de inmediato.
  useEffect(() => {
    void loadTokensIntoMemory();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
