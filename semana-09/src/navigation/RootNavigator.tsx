// src/navigation/RootNavigator.tsx
// Stack: Home (catálogo animado) → Detail (título dinámico)

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { COLORS } from '../theme';
import { HomeScreen } from '../screens/HomeScreen';
import { DetailScreen } from '../screens/DetailScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const headerStyle = { backgroundColor: COLORS.background };
const headerTitleStyle = { color: COLORS.text, fontWeight: '700' as const };

export function RootNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={{ headerStyle, headerTitleStyle, headerShadowVisible: false }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Editorial Luna' }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={({ route }) => ({ title: route.params.name })}
      />
    </Stack.Navigator>
  );
}
