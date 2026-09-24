// src/types/index.ts
// Tipos del dominio — usuario autenticado + catálogo Editorial Luna.

// ─────────────────────────────────────────
// AUTH (dummyjson.com)
// ─────────────────────────────────────────

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender?: string;
  image?: string;
}

// Respuesta de POST /auth/login — el usuario + los dos tokens JWT
export interface LoginResponse extends User {
  accessToken: string;
  refreshToken: string;
}

// Payload del refresh (POST /auth/refresh)
export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

// Claims que nos interesan del JWT (decodificado con jwt-decode)
export interface JwtPayload {
  sub?: string;
  username?: string;
  exp?: number;
  iat?: number;
}

// ─────────────────────────────────────────
// CATÁLOGO (dominio Editorial)
// ─────────────────────────────────────────

export interface Item {
  id: number;
  name: string;
  description: string;
  author: string;
  year: number;
  genre: string;
  pages: number;
  price: number;
}
