# Semana 06 — Formularios con React Hook Form + Zod

> Bootcamp React Native "Zero to Hero" | Fase 2 — Core RN | Semana 6 de 18
> **Dominio asignado**: Editorial — catálogo de libros **Editorial Luna**

## 🎯 Objetivo

Formularios Create y Edit con validación real: `useForm` + `Controller` de React Hook Form, esquemas Zod con `zodResolver`, errores inline y mutations de TanStack Query.

## 📝 Contenidos

- **`FormField` genérico y reutilizable**: encapsula `Controller` + `TextInput` + mensaje de error; tipado con generics (`Control<T>`, `FieldPath<T>`), sin `any`. Usado igual en Create y Edit
- **Schema Zod único** (`itemSchema.ts`): 7 campos con reglas en español — `name`, `author`, `genre` (strings con `.trim().min/max`), `year` (1450 → año actual), `pages` y `price` con `z.coerce.number()` (el TextInput entrega strings, Zod convierte y valida)
- **`z.infer` / `z.input`**: los tipos del formulario se generan desde el schema — sin interfaces duplicadas
- **CreateScreen**: `useForm` + `zodResolver` + `useCreateItem`; navega atrás en `onSuccess`
- **EditScreen**: `defaultValues` desde `useItemById`, `reset()` dentro de `useEffect` cuando llegan los datos, `isDirty` para no guardar sin cambios
- Botón deshabilitado + `ActivityIndicator` durante el envío (`isSubmitting` / `isPending`)
- Catálogo semilla en español (15 libros latinos mapeados a entradas de Editorial Luna) y caché actualizada con `setQueryData` (JSONPlaceholder no persiste cambios)

## 🚀 Cómo ejecutar

```bash
cd semana-06
pnpm install
pnpm start   # escanear el QR con Expo Go
```

## 🗂️ Estructura

```
semana-06/
├── App.tsx                            — QueryClientProvider + NavigationContainer
└── src/
    ├── components/FormField.tsx       — Controller + TextInput + error (reutilizable)
    ├── schemas/itemSchema.ts          — z.object + z.infer (fuente única de verdad)
    ├── hooks/useItems.ts              — CRUD + catálogo en español + setQueryData
    ├── screens/
    │   ├── HomeScreen.tsx             — catálogo → Edit | botón + → Create
    │   ├── CreateScreen.tsx           — formulario de creación
    │   └── EditScreen.tsx             — formulario de edición (reset + useEffect)
    ├── services/api.ts                — Axios + EXPO_PUBLIC_API_URL
    ├── theme/index.ts                 — paleta Editorial Luna
    └── types/                         — Item + env.d.ts (tipado de process.env)
```

## ✅ Entregables

- [x] `FormField` reutilizado en ambas pantallas (rúbrica: sin código copiado)
- [x] Create funcional: validación Zod + mutation + `goBack()` en éxito
- [x] Edit con `defaultValues` cargados y `reset()` en `useEffect`
- [x] Errores inline visibles al enviar inválido
- [x] Spinner + botón deshabilitado durante el envío
- [x] TypeScript sin errores (`tsc --noEmit` limpio)

## ⚠️ Correcciones al starter

- `package.json`: `"main"` corregido a `"expo/AppEntry"`
- `app.json`: eliminada la referencia a `./assets/adaptive-icon.png` (asset inexistente en el starter)

## 🔗 Navegación

[← Semana 05](../semana-05/README.md)
