// src/schemas/itemSchema.ts
// Schema Zod del formulario de libros.
// El tipo TypeScript se INFIERE del schema (z.infer) — sin interfaz duplicada.
// Esa es la regla de oro de esta semana: una sola fuente de verdad.

import { z } from 'zod';

// Año actual para la validación "no puede ser futuro"
const CURRENT_YEAR = new Date().getFullYear();

export const itemSchema = z.object({
  // ── Texto ──────────────────────────────────────────────
  name: z
    .string()
    .trim()
    .min(2, 'El título debe tener al menos 2 caracteres')
    .max(80, 'El título no puede superar 80 caracteres'),

  author: z
    .string()
    .trim()
    .min(2, 'El nombre del autor es requerido')
    .max(60, 'Máx. 60 caracteres'),

  genre: z
    .string()
    .trim()
    .min(1, 'El género es requerido')
    .max(40, 'Máx. 40 caracteres'),

  description: z
    .string()
    .max(500, 'Máx. 500 caracteres')
    .optional()
    .or(z.literal('')),

  // ── Numéricos con z.coerce ─────────────────────────────
  // El TextInput siempre entrega strings; z.coerce convierte el string a
  // número ANTES de validar. Así el schema y el input quedan conectados.

  year: z.coerce
    .number()
    .int('El año debe ser un número entero')
    .min(1450, 'El año mínimo es 1450 (invención de la imprenta)')
    .max(CURRENT_YEAR, `El año no puede ser mayor a ${CURRENT_YEAR}`),

  pages: z.coerce
    .number()
    .int('Las páginas deben ser un número entero')
    .positive('Las páginas deben ser mayores que 0'),

  price: z.coerce
    .number()
    .positive('El precio debe ser mayor que 0'),
});

// Tipo generado automáticamente desde el schema.
// Si mañana agregas/quitas un campo al schema, el tipo se actualiza solo.
export type ItemFormData = z.infer<typeof itemSchema>;

// Tipo de ENTRADA del schema (antes de coercionar) — lo usa useForm.
export type ItemFormInput = z.input<typeof itemSchema>;
