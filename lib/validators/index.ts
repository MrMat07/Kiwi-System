import { z } from 'zod';

const passwordPolicy = z
  .string()
  .min(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  .regex(/[A-Z]/, { message: 'Debe incluir al menos una letra mayúscula.' })
  .regex(/[a-z]/, { message: 'Debe incluir al menos una letra minúscula.' })
  .regex(/[0-9]/, { message: 'Debe incluir al menos un número.' })
  .regex(/[^A-Za-z0-9]/, { message: 'Debe incluir al menos un carácter especial.' });

export const registerSchema = z.object({
  nombre: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  email: z.string().email({ message: 'El email no tiene un formato válido.' }),
  password: passwordPolicy,
  rol: z.enum(['admin', 'operador']).default('operador')
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const clienteSchema = z.object({
  nombre: z.string().min(2),
  tipo: z.enum(['persona', 'empresa']),
  telefono: z.string().optional().default(''),
  email: z.string().email().optional().or(z.literal('')).default(''),
  direccion: z.string().optional().default(''),
  notas: z.string().optional().default('')
});

export const proveedorSchema = z.object({
  nombre: z.string().min(2),
  telefono: z.string().optional().default(''),
  email: z.string().email().optional().or(z.literal('')).default(''),
  direccion: z.string().optional().default(''),
  notas: z.string().optional().default('')
});

export const productoSchema = z.object({
  nombre: z.string().min(2),
  sku: z.string().min(2),
  precio: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  categoria: z.string().optional().default(''),
  descripcion: z.string().optional().default(''),
  activo: z.boolean().default(true)
});

export const ventaSchema = z.object({
  fecha: z.string(),
  clienteId: z.number().int(),
  estado: z.enum(['pendiente', 'pagada', 'cancelada']).default('pendiente'),
  items: z
    .array(
      z.object({
        productoId: z.number().int(),
        cantidad: z.number().int().positive(),
        precioUnitario: z.number().nonnegative()
      })
    )
    .min(1)
});

export const compraSchema = z.object({
  fecha: z.string(),
  proveedorId: z.number().int(),
  items: z
    .array(
      z.object({
        productoId: z.number().int(),
        cantidad: z.number().int().positive(),
        precioUnitario: z.number().nonnegative()
      })
    )
    .min(1)
});
