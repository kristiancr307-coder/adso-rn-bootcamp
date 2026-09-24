# Semana 03 — React Navigation

> Bootcamp React Native "Zero to Hero" | Fase 2 — Core RN | Semana 3 de 18
> **Dominio asignado**: Editorial — catálogo de libros **Editorial Luna**

## 🎯 Objetivo

Navegación con React Navigation: Tab Navigator + Stack anidado, con parámetros tipados en TypeScript.

## 📝 Contenidos

- `RootTabParamList`: pestañas **Home** (catálogo) y **Favorites**
- `HomeStackParamList` anidado dentro de Home: lista → detalle
- Parámetros tipados: el detalle recibe los 8 campos del libro (`id`, `name`, `description`, `author`, `year`, `genre`, `pages`, `price`)
- Iconos con `@expo/vector-icons` (Ionicons: `book`/`book-outline`, `heart`/`heart-outline`)
- `tabBarActiveTintColor: '#61DAFB'`
- `useRoute` en el detalle para leer los params

## 🚀 Cómo ejecutar

```bash
cd semana-03
pnpm install
pnpm start   # escanear el QR con Expo Go
```

## 🗂️ Estructura

```
semana-03/
├── App.tsx                            — NavigationContainer + SafeAreaProvider
└── src/
    ├── data/mockData.ts               — 8 libros + FAVORITES (3)
    ├── navigation/
    │   ├── types.ts                   — RootTabParamList + HomeStackParamList
    │   └── RootNavigator.tsx          — Tab + Stack anidado, headers estilizados
    ├── screens/
    │   ├── HomeScreen.tsx             — FlatList → navega a Detail
    │   ├── DetailScreen.tsx           — detalle completo vía useRoute
    │   └── FavoritesScreen.tsx        — lista de favoritos con corazón
    └── types/index.ts                 — interfaz Item (8 campos)
```

## ✅ Entregables

- [x] Tab Navigator con iconos y tinte `#61DAFB`
- [x] Stack anidado en Home (lista → detalle)
- [x] Params tipados sin `any`
- [x] Título dinámico en el detalle (`route.params.name`)

## ⚠️ Correcciones al starter

- `package.json`: `"main"` corregido a `"expo/AppEntry"` (el starter traía `"expo-router/entry"` sin tener expo-router)
- `app.json`: eliminado el bloque `"plugins": ["expo-router"]` y el `sdkVersion` viejo

## 🔗 Navegación

[← Semana 02](../semana-02/README.md) | [Semana 04 — Estado global con Zustand →](../semana-04/README.md)
