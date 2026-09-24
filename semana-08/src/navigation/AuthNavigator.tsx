// src/navigation/AuthNavigator.tsx
// Stack PÚBLICO: Login ⇄ Registro. Solo existe cuando no hay sesión.

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { COLORS } from '../theme';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const headerStyle = { backgroundColor: COLORS.background };
const headerTitleStyle = { color: COLORS.text, fontWeight: '700' as const };

export function AuthNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{ headerStyle, headerTitleStyle, headerShadowVisible: false }}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Editorial Luna', headerBackVisible: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: 'Crear cuenta' }}
      />
    </Stack.Navigator>
  );
}
