# Semana 02 — Listas, inputs y estilos

> Bootcamp React Native "Zero to Hero" | Fase 2 — Core RN | Semana 2 de 18
> **Dominio asignado**: Editorial — catálogo de libros **Editorial Luna**

## 🎯 Objetivo

Manejar listas con `FlatList`, entradas de usuario con `TextInput` y un sistema de estilos centralizado, aplicados a un catálogo con buscador en tiempo real.

## 📝 Contenidos

- `FlatList` con `keyExtractor` por `id`
- Buscador con `TextInput` que filtra en tiempo real (`useMemo` + `filter`)
- `ListEmptyComponent` para el estado sin resultados
- Tema centralizado: `COLORS`, `TYPOGRAPHY`, `SPACING`, `RADIUS`
- TypeScript estricto, sin `any`

## 🚀 Cómo ejecutar

```bash
cd semana-02
pnpm install
pnpm start   # escanear el QR con Expo Go
```

## 🗂️ Estructura

```
semana-02/
├── App.tsx                        — punto de entrada
├── app.json                       — configuración Expo (SDK 57)
└── src/
    ├── components/ItemCard.tsx    — tarjeta del libro
    ├── data/mockData.ts           — 10 libros
    ├── screens/HomeScreen.tsx     — buscador + FlatList + estado vacío
    ├── theme/index.ts             — sistema de diseño
    └── types/index.ts             — interfaz Item
```

## ✅ Entregables

- [x] Catálogo de 10 libros con `FlatList`
- [x] Filtro en tiempo real por nombre
- [x] Estado vacío con `ListEmptyComponent`
- [x] Theming con constantes + TypeScript sin `any`

## 🔗 Navegación

[← Semana 01](../semana-01/README.md) | [Semana 03 — React Navigation →](../semana-03/README.md)
