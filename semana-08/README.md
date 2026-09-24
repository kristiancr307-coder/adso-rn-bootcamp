# Semana 08 — Autenticación Completa

> Bootcamp React Native "Zero to Hero" | Fase 2 — Core RN | Semana 8 de 18
> **Dominio asignado**: Editorial — catálogo de libros **Editorial Luna**

## 🎯 Objetivo

Autenticación JWT completa: login/registro con React Hook Form + Zod, tokens **cifrados** en SecureStore, store Zustand con persistencia parcial, navegación condicional y **auto-refresh de tokens** con un interceptor de Axios.

## 📝 Contenidos

- **`authStore` (Zustand + persist + partialize)** — persiste SOLO `user` e `isAuthenticated`; los tokens **jamás** entran al storage persistido (viven cifrados en SecureStore vía `tokenService`)
- **`tokenService`** — wrapper de Expo SecureStore con caché en memoria
- **`api.ts` (interceptor 401)** — adjunta el `Bearer` token en cada request; ante un 401 refresca **una sola vez** (single-flight con `refreshPromise`), guarda los tokens nuevos y **reintenta** la petición original; si el refresh falla → logout automático
- **`authService`** — `login` (JWT reales de dummyjson), `fetchMe` (endpoint protegido), `registerUser`
- **Navegación condicional** — `isAuthenticated ? <AppNavigator/> : <AuthNavigator/>`: al loguearse, el stack cambia solo
- **LoginScreen** — `useForm` + `zodResolver`; errores inline; spinner durante el envío
- **RegisterScreen** — username, email, contraseña + confirmación (`.refine` de coincidencia)
- **ProfileScreen** — datos de `/auth/me`, membresía del club de lectores, expiración del JWT decodificada con `jwt-decode`; el token se muestra solo como `••••••` (nunca plano)
- **HomeScreen** — catálogo Editorial Luna con saludo personalizado

## 🔑 API de práctica

`https://dummyjson.com/auth` — credenciales de prueba:

```
usuario:  emilys
clave:    emilyspass
```

> El registro (`/users/add`) crea el usuario pero la API fake **no emite JWT** al registrar, por eso abre una "sesión local" (autenticado sin tokens). El flujo completo de tokens se demuestra con el login.

## 🚀 Cómo ejecutar

```bash
cd semana-08
pnpm install
pnpm start        # escanear el QR con Expo Go
```

## 🗂️ Estructura

```
semana-08/
├── App.tsx                            — QueryClient + Navigation + rehidratación de tokens
└── src/
    ├── navigation/
    │   ├── types.ts                   — AuthStackParamList / AppStackParamList
    │   ├── AuthNavigator.tsx          — Login ⇄ Register (público)
    │   ├── AppNavigator.tsx           — Home ⇄ Profile (protegido)
    │   └── RootNavigator.tsx          — condicional según isAuthenticated
    ├── screens/
    │   ├── LoginScreen.tsx            — RHF + Zod → authService → store
    │   ├── RegisterScreen.tsx         — registro con confirmación de clave
    │   ├── HomeScreen.tsx             — catálogo con saludo del usuario
    │   └── ProfileScreen.tsx          — perfil + JWT + logout
    ├── services/
    │   ├── tokenService.ts            — SecureStore (cifrado) + memoria
    │   ├── api.ts                     — interceptor Bearer + refresh 401
    │   └── authService.ts             — login / me / register
    ├── stores/authStore.ts            — Zustand persist + partialize
    ├── schemas/authSchema.ts          — loginSchema / registerSchema
    ├── hooks/useProfile.ts            — query protegida /auth/me
    └── data/mockData.ts               — catálogo Editorial Luna
```

## ✅ Entregables

- [x] Login con validación Zod y llamada real a la API
- [x] Registro con confirmación de contraseña
- [x] Tokens SOLO en SecureStore (nunca AsyncStorage/MMKV)
- [x] Zustand con `persist` + `partialize` (tokens fuera del storage)
- [x] Navegación condicional Auth ↔ App
- [x] Interceptor 401 con auto-refresh y reintento (bonus de la rúbrica)
- [x] Logout desde Profile (borra SecureStore + store)
- [x] TypeScript sin errores

## 🔗 Navegación

[← Semana 07](../semana-07/README.md) | [Semana 09 — Animaciones →](../semana-09/README.md)
