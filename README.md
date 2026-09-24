# 📚 Editorial Luna — Bootcamp React Native

Repositorio de entregas del **Bootcamp React Native "Zero to Hero"** ([ergrato-dev/bc-reactnative](https://github.com/ergrato-dev/bc-reactnative)) — 18 semanas.

**Kristian Luna** · Aprendiz de **Análisis y Desarrollo de Software (ADSO)** — SENA, Bogotá.

> **Dominio asignado**: Editorial — todas las apps giran alrededor de un catálogo de libros: **Editorial Luna** 🔵

---

## 🛠️ Stack

| Capa | Tecnología |
|------|------------|
| Framework | **Expo SDK 57** · React Native 0.86 · React 19 |
| Lenguaje | **TypeScript** (modo estricto, sin `any`) |
| Paquetes | **pnpm** |
| Navegación | React Navigation v7 (Stack + Tabs, params tipados) |
| Estado global | Zustand (con `persist` + `partialize`) |
| Servidor / red | TanStack Query v5 + Axios |
| Formularios | React Hook Form + Zod (`zodResolver`, `z.infer`) |
| Persistencia | MMKV · AsyncStorage · Expo SecureStore |
| Animaciones | Animated API · LayoutAnimation |

## 🗂️ Estructura del repo

**Una carpeta por semana**, cada una es un proyecto Expo independiente (su propio `package.json` y su propio `node_modules`, nunca subido a git):

```
adso-rn-bootcamp/
├── semana-01/   ...   semana-09/
│   ├── App.tsx            — punto de entrada
│   ├── app.json           — configuración Expo
│   ├── package.json
│   ├── README.md          — documentación de la semana
│   └── src/               — código (screens, components, hooks, stores…)
└── README.md              ← estás aquí
```

## 📅 Progreso

| Semana | Tema | Proyecto aplicado a Editorial Luna | Estado |
|--------|------|------------------------------------|--------|
| 01 | Core Components y Flexbox | Catálogo con tarjeta de libro (portada, autor, año, género, precio) | ✅ |
| 02 | Listas, inputs y estilos | `FlatList` + buscador en tiempo real + theming con constantes | ✅ |
| 03 | React Navigation | Tabs (Catálogo/Favoritos) + Stack anidado con params tipados | ✅ |
| 04 | Estado global con Zustand | Lista de "guardados" compartida entre pantallas | ✅ |
| 05 | Networking con TanStack Query | Catálogo desde API real (`useQuery` / `useMutation`) | ✅ |
| 06 | React Hook Form + Zod | Formularios Create/Edit con validación inline y `FormField` reutilizable | ✅ |
| 07 | Persistencia local | Preferencias MMKV + caché offline (AsyncStorage) + SecureStore | ✅ |
| 08 | Autenticación completa | JWT + SecureStore + Zustand auth store + interceptor 401 con auto-refresh | ✅ |
| 09 | Animaciones básicas | `Animated.parallel/spring/stagger`, `interpolate` y `LayoutAnimation` | ✅ |
| 10–18 | Fase avanzada | — | ⏳ |

## 🚀 Cómo ejecutar una semana

```bash
cd semana-0X
pnpm install
pnpm start
```

Escanea el QR con **Expo Go** (Android/iOS).

> Nota (semana 07): MMKV es un módulo nativo y no viene en Expo Go; la app lo detecta y usa un respaldo con AsyncStorage con el mismo contrato reactivo. Con build nativo (`pnpm expo run:android`) usa MMKV real.

## 🌿 Organización de ramas

- **`main`** — las semanas completas, una carpeta por semana (integración continua del curso).
- **`semana-01` … `semana-09`** — una rama por semana que contiene **solo su carpeta**, para revisión individual de cada entrega.

## 🔧 Correcciones aplicadas a los starters

Los starters del curso traen detalles que impiden arrancar con Expo Go; en cada semana se corrigieron:

- `package.json`: campo `"main"` → `"expo/AppEntry"` (algunos traen `"expo-router/entry"` sin tener expo-router instalado).
- `app.json`: sin `sdkVersion` viejo, sin `plugins` no instalados y sin referencias a assets inexistentes.

## 📄 Contexto

Proyecto educativo del programa ADSO (SENA). El diseño, el código y la adaptación al dominio Editorial son de autoría propia sobre los starters del bootcamp.
