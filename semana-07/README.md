# Semana 07 — Persistencia Local

> Bootcamp React Native "Zero to Hero" | Fase 2 — Core RN | Semana 7 de 18
> **Dominio asignado**: Editorial — catálogo de libros **Editorial Luna**

## 🎯 Objetivo

Aplicar los 3 patrones de almacenamiento local a la app del dominio: **MMKV** para preferencias, **AsyncStorage** para caché offline y **Expo SecureStore** para datos sensibles.

## 📝 Contenidos

- **`usePreferences` (MMKV)** — 3 preferencias reactivas del catálogo:
  - `sortOrder`: orden por título / año / precio
  - `compactMode`: filas compactas (Switch)
  - `itemsPerPage`: 5 / 10 / 15 libros por carga
  - Los cambios se guardan **al instante**, sin botón "Guardar"
- **Caché offline (`useItems` + AsyncStorage)** — si hay red, guarda el catálogo; si la red falla, sirve la copia local y la UI muestra el banner "⚠️ Mostrando catálogo guardado en el dispositivo (sin conexión)"
- **`SettingsScreen` (MMKV + SecureStore)** — sección "Seguridad": el "código de acceso de la editorial" se guarda **cifrado** con SecureStore y **nunca** se muestra en texto plano (solo confirmación ✓/✗)
- Botón para borrar la caché offline
- Base: app de la semana 06 (React Hook Form + Zod + TanStack Query) con paleta azul

## ⚠️ Nota sobre MMKV y Expo Go

MMKV es un módulo **nativo** (Nitro Modules) y **no está incluido en Expo Go**. Por eso `src/storage/mmkv.ts` crea la instancia dentro de `try/catch`:

| Entorno | Comportamiento |
|---------|----------------|
| Expo Go (`pnpm start`) | Detecta la ausencia del módulo y las preferencias usan un **respaldo con AsyncStorage** (mismo contrato reactivo). La app corre al 100% para demostrar |
| Build nativo (`pnpm expo run:android`) | Usa **MMKV real** (lecturas/escrituras sincrónicas) |

## 🚀 Cómo ejecutar

```bash
cd semana-07
pnpm install
pnpm start        # escanear el QR con Expo Go
# opcional (MMKV real): pnpm expo run:android
```

## 🗂️ Estructura

```
semana-07/
├── App.tsx                            — QueryClientProvider + NavigationContainer
└── src/
    ├── storage/mmkv.ts                — instancia MMKV con detección de entorno
    ├── hooks/
    │   ├── usePreferences.ts          — sortOrder / compactMode / itemsPerPage (reactivos)
    │   └── useItems.ts                — red + caché offline AsyncStorage
    ├── screens/
    │   ├── HomeScreen.tsx             — aplica preferencias + banner offline
    │   ├── CreateScreen.tsx           — alta de libros (semana 06)
    │   └── SettingsScreen.tsx         — preferencias + caché + SecureStore
    ├── components/FormField.tsx       — reutilizable (semana 06)
    ├── schemas/itemSchema.ts          — validación Zod (semana 06)
    ├── services/api.ts                — Axios
    └── theme/index.ts                 — paleta azul Editorial Luna
```

## ✅ Entregables

- [x] 3 preferencias MMKV reactivas sin `async/await` en la UI
- [x] Caché offline: guarda con red, sirve sin red, banner visible
- [x] Settings con persistencia en tiempo real
- [x] Dato sensible cifrado en SecureStore, nunca en texto plano
- [x] TypeScript sin errores (`pnpm exec tsc --noEmit`)

## 🔗 Navegación

[← Semana 06](../semana-06/README.md) | [Semana 08 — Autenticación →](../semana-08/README.md)
