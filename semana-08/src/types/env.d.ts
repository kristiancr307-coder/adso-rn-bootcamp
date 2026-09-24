// src/types/env.d.ts
// Tipado mínimo para process.env en Expo.
// Expo reemplaza las variables EXPO_PUBLIC_* en tiempo de build,
// pero TypeScript necesita que `process` esté declarado para no
// marcar errores rojos (el tsconfig de Expo no incluye @types/node).

declare var process: {
  env: {
    EXPO_PUBLIC_API_URL?: string;
  };
};
