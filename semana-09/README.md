# Semana 09 — Animaciones Básicas

> Bootcamp React Native "Zero to Hero" | Fase 3 — Avanzado | Semana 9 de 18
> **Dominio asignado**: Editorial — catálogo de libros **Editorial Luna**

## 🎯 Objetivo

Hacer viva la app del dominio con la `Animated API` y `LayoutAnimation`: las animaciones **mejoran la experiencia**, no son demo suelta.

## 📝 Contenidos — las 4 animaciones del proyecto

| # | Requisito | Dónde | Qué se usó |
|---|-----------|-------|------------|
| 1 | Entrada de la pantalla de detalle | `DetailScreen.tsx` | `Animated.parallel` — fade in (opacity 0→1) + slide up (translateY 30→0), 500 ms |
| 2 | Feedback táctil en las tarjetas | `AnimatedCard.tsx` | `Animated.spring` — scale 1→0.95 en `onPressIn`, 0.95→1 con rebote en `onPressOut` |
| 3 | Barra de progreso de lectura | `ProgressBar.tsx` | `interpolate` — ancho `0%→100%` y color rojo→amarillo→verde con `extrapolate: 'clamp'` |
| 4 | Entrada en cascada del catálogo | `HomeScreen.tsx` | `Animated.stagger(80, ...)` — cada tarjeta aparece desfasada 80 ms |
| 5 | LayoutAnimation al agregar/quitar | `HomeScreen.tsx` | `LayoutAnimation.configureNext(Presets.spring)` antes de cada add/remove en "Mi lista de lectura" |

## 💡 Coherencia con el dominio

- La **ProgressBar** muestra el **progreso de lectura** de cada libro (páginas leídas / páginas totales) — persistido con Zustand + AsyncStorage; el botón **+25 páginas** hace que la barra se re-anime sola
- **"Mi lista de lectura"** (chips en el Home) agrega/quita libros con transición animada, con dedupe y persistencia local
- El **feedback spring** da sensación de "presionar un libro físico"

## ⚠️ Nota sobre LayoutAnimation en Android

Android con New Architecture puede ignorar `setLayoutAnimationEnabledExperimental` (se activa con guard en `App.tsx`). Por eso cada chip además tiene su **propia animación de entrada** con `Animated` (fade + scale): el cambio siempre se ve animado en cualquier dispositivo.

## 🚀 Cómo ejecutar

```bash
cd semana-09
pnpm install
pnpm start        # escanear el QR con Expo Go
```

## 🗂️ Estructura

```
semana-09/
├── App.tsx                            — habilita LayoutAnimation (Android) + Navigation
└── src/
    ├── components/
    │   ├── AnimatedCard.tsx           — entrada (stagger) + spring táctil
    │   ├── AnimatedButton.tsx         — botones con spring de compresión
    │   └── ProgressBar.tsx            — interpolate de ancho y color
    ├── screens/
    │   ├── HomeScreen.tsx             — stagger + chips con LayoutAnimation
    │   └── DetailScreen.tsx           — parallel fade+slide + progreso + acciones
    ├── stores/
    │   ├── readingListStore.ts        — mi lista (persist AsyncStorage)
    │   └── progressStore.ts           — páginas leídas por libro (persist)
    ├── data/mockData.ts               — 10 libros con pagesRead
    └── theme/index.ts                 — paleta azul Editorial Luna
```

## ✅ Entregables

- [x] 3+ animaciones distintas (parallel, spring, stagger, interpolate)
- [x] LayoutAnimation al agregar/eliminar de la lista de lectura
- [x] Animaciones con propósito: entrada, feedback y progreso del dominio
- [x] `useNativeDriver: true` en todo lo que es transform/opacity
- [x] TypeScript sin errores

## 🔗 Navegación

[← Semana 08](../semana-08/README.md)
