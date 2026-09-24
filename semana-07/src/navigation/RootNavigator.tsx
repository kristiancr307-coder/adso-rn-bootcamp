// src/navigation/RootNavigator.tsx
// Stack: Home (catálogo) → Create (modal) | Home → Settings (ajustes)

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { COLORS } from '../theme';
import { HomeScreen } from '../screens/HomeScreen';
import { CreateScreen } from '../screens/CreateScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const headerStyle = { backgroundColor: COLORS.background };
const headerTitleStyle = { color: COLORS.text, fontWeight: '700' as const };

export function RootNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{ headerStyle, headerTitleStyle }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Editorial Luna', headerRight: () => <HeaderButtons /> }}
      />
      <Stack.Screen
        name="Create"
        component={CreateScreen}
        options={{ title: 'Nuevo libro', presentation: 'modal' }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Ajustes del catálogo' }}
      />
    </Stack.Navigator>
  );
}

// Botones del header: "+" crea, "⚙" abre ajustes
function HeaderButtons(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
      <Pressable onPress={() => navigation.navigate('Settings')} hitSlop={8}>
        <Text style={{ fontSize: 18 }}>⚙️</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('Create')} hitSlop={8}>
        <Text style={{ fontSize: 26, color: COLORS.accent, fontWeight: '300' }}>+</Text>
      </Pressable>
    </View>
  );
}
