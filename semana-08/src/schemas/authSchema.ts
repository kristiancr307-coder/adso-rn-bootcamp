// src/schemas/authSchema.ts
// Schemas Zod del login y del registro.
// Los tipos TS se infieren con z.infer — sin interfaces duplicadas.

import { z } from 'zod';

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(4, 'El usuario debe tener al menos 4 caracteres'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(4, 'El usuario debe tener al menos 4 caracteres')
      .max(20, 'Máx. 20 caracteres'),
    email: z.string().trim().email('Correo electrónico no válido'),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(/[A-Za-z]/, 'Debe incluir letras')
      .regex(/[0-9]/, 'Debe incluir al menos un número'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'], // el error aparece bajo el campo de confirmación
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
