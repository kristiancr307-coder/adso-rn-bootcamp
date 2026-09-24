# Semana 01 — Core Components y Flexbox

> Bootcamp React Native "Zero to Hero" | Fase 2 — Core RN | Semana 1 de 18
> **Dominio asignado**: Editorial — catálogo de libros **Editorial Luna**

## 🎯 Objetivo

Practicar los core components de React Native (`View`, `Text`, `Image`, `Pressable`) y el layout con Flexbox, aplicados a un catálogo de libros.

## 📝 Contenidos

| Ejercicio | Tema |
|-----------|------|
| Ejercicio 01 | Tarjeta de perfil con `View`, `Text`, `Image` |
| Ejercicio 02 | 4 layouts con Flexbox (fila, columna, space-between, centrado) |
| Proyecto | Catálogo de libros con tarjeta de portada, nombre, autor, año, género y precio |

## 🚀 Cómo ejecutar

```bash
cd semana-01
pnpm install
pnpm start   # escanear el QR con Expo Go
```

## 🗂️ Estructura

```
semana-01/
├── App.tsx                        — punto de entrada
├── app.json                       — configuración Expo (SDK 57)
└── src/
    ├── components/ItemCard.tsx    — tarjeta del libro (Pressable)
    ├── data/mockData.ts           — 4 libros de ejemplo
    ├── screens/HomeScreen.tsx     — header "Editorial Luna" + lista
    └── types/index.ts             — interfaz Book
```

## ✅ Entregables

- [x] Ejercicio 01: tarjeta de perfil
- [x] Ejercicio 02: 4 layouts Flexbox
- [x] Proyecto: catálogo con tarjeta completa (6 campos por libro)
- [x] App corriendo en dispositivo físico con Expo Go

## 🔗 Navegación

[Semana 02 — Listas, inputs y estilos →](../semana-02/README.md)
