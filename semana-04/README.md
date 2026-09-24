# Semana 04 — Estado global con Zustand

> Bootcamp React Native "Zero to Hero" | Fase 2 — Core RN | Semana 4 de 18
> **Dominio asignado**: Editorial — catálogo de libros **Editorial Luna**

## 🎯 Objetivo

Manejar estado global real (no estático) con Zustand: una lista de "guardados" que varias pantallas leen y modifican.

## 📝 Contenidos

- Store con `create<SavedStore>()`: `items`, `addItem`, `removeItem`, `clearAll`, `isItemSaved`
- Evitar duplicados al guardar (verificación con `some` antes de `set`)
- Tabs **Home** (catálogo) y **Saved** (guardados), con Stack anidado en Home
- El detalle agrega el libro al store; la pantalla Saved lo lista y permite quitarlo
- Selector `useSavedStore((state) => state.items)` para re-renderizar solo lo necesario

## 🚀 Cómo ejecutar

```bash
cd semana-04
pnpm install
pnpm start   # escanear el QR con Expo Go
```

## 🗂️ Estructura

```
semana-04/
├── App.tsx                            — NavigationContainer + StatusBar
└── src/
    ├── data/mockData.ts               — catálogo base
    ├── navigation/
    │   ├── types.ts                   — RootTabParamList (Home/Saved)
    │   └── RootNavigator.tsx          — Tabs + Stack anidado
    ├── screens/
    │   ├── HomeScreen.tsx             — catálogo
    │   ├── DetailScreen.tsx           — detalle + botón guardar (store)
    │   └── SavedScreen.tsx            — guardados: quitar / limpiar todo
    ├── stores/savedStore.ts           — store Zustand
    └── types/index.ts                 — interfaz Item (8 campos)
```

## ✅ Entregables

- [x] Store global con acciones de agregar/quitar
- [x] Dos pantallas consumiendo el mismo estado
- [x] Sin duplicados en la lista de guardados
- [x] TypeScript estricto sin `any`

## 🔗 Navegación

[← Semana 03](../semana-03/README.md) | [Semana 05 — Networking con TanStack Query →](../semana-05/README.md)
