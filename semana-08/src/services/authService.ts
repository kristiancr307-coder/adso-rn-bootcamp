// src/services/authService.ts
// Llamadas de autenticación contra dummyjson.com (API de práctica).
//
// Login:    POST /auth/login  → usuario + accessToken + refreshToken (JWT reales)
// Refresh:  POST /auth/refresh → renueva el par de tokens
// Perfil:   GET  /auth/me      → llamada PROTEGIDA (requiere Bearer token)
// Registro: POST /users/add    → crea el usuario (la API fake NO emite tokens
//           al registrar, por eso el registro abre una "sesión local" sin JWT)

import axios from 'axios';

import { apiClient } from './api';
import { saveTokens } from './tokenService';
import type { LoginResponse, User } from '../types';
import type { RegisterFormData } from '../schemas/authSchema';

export async function login(username: string, password: string): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', {
    username,
    password,
    expiresInMins: 30,
  });
  // Los tokens van INMEDIATAMENTE a SecureStore (nunca a AsyncStorage)
  await saveTokens(data.accessToken, data.refreshToken);
  return data;
}

export async function fetchMe(): Promise<User> {
  // Pasa por el interceptor → incluye el Bearer token
  const { data } = await apiClient.get<User>('/auth/me');
  return data;
}

export async function registerUser(input: RegisterFormData): Promise<User> {
  // users/add no requiere auth ni devuelve JWT (API de práctica)
  const { data } = await axios.post<User>('https://dummyjson.com/users/add', {
    username: input.username,
    email: input.email,
    password: input.password,
    firstName: input.username,
    lastName: 'Lector',
  });
  return data;
}
