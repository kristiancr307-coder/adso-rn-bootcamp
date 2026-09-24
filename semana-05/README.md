# Semana 05 — Networking con TanStack Query

> Bootcamp React Native "Zero to Hero" | Fase 2 — Core RN | Semana 5 de 18
> **Dominio asignado**: Editorial — catálogo de libros **Editorial Luna**

## 🎯 Objetivo

Consumir una API real con TanStack Query v5 + Axios: `useQuery`, `useMutation`, invalidación de caché y estados de carga/error.

## 📝 Contenidos

- `QueryClientProvider` en la raíz (`staleTime`, `retry`, `refetchOnWindowFocus: false`)
- Hooks personalizados: `useItems`, `useItemById`, `useCreateItem`, `useDeleteItem`
- Instancia Axios centralizada con `EXPO_PUBLIC_API_URL` e interceptor de errores
- API de práctica: `jsonplaceholder.typicode.com` (`/posts`)
- Stack Home → Create (modal) → Detail
- Pull-to-refresh con `isFetching` / `refetch`

## 🚀 Cómo ejecutar

```bash
cd semana-05
pnpm install
pnpm start   # escanear el QR con Expo Go
```

## 🗂️ Estructura

```
semana-05/
├── App.tsx                        — QueryClientProvider + NavigationContainer
└── src/
    ├── hooks/useItems.ts          — useQuery + useMutation
    ├── screens/
    │   ├── HomeScreen.tsx         — lista remota con refresh y reintento
    │   ├── CreateScreen.tsx       — alta con useMutation
    │   └── DetailScreen.tsx       — detalle por id
    ├── services/api.ts            — instancia Axios + interceptor
    └── types/index.ts             — Item, CreateItemPayload
```

## ✅ Entregables

- [x] Lista desde API con estados de carga / error / vacío
- [x] Creación con `useMutation` + actualización de la lista
- [x] Manejo global de errores de red

## 🔗 Navegación

[← Semana 04](../semana-04/README.md) | [Semana 06 — Formularios con React Hook Form + Zod →](../semana-06/README.md)
