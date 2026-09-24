// src/navigation/AppNavigator.tsx
// Stack PROTEGIDO: Home (catálogo) ⇄ Profile. Solo existe con sesión activa.

import React from 'react';
import { Pressable, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { COLORS } from '../theme';
import { HomeScreen } from '../screens/HomeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import type { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

const headerStyle = { backgroundColor: COLORS.background };
const headerTitleStyle = { color: COLORS.text, fontWeight: '700' as const };

export function AppNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{ headerStyle, headerTitleStyle, headerShadowVisible: false }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Editorial Luna', headerRight: () => <ProfileButton /> }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Mi perfil' }}
      />
    </Stack.Navigator>
  );
}

function ProfileButton(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  return (
    <Pressable onPress={() => navigation.navigate('Profile')} hitSlop={8}>
      <Text style={{ fontSize: 18 }}>👤</Text>
    </Pressable>
  );
}
