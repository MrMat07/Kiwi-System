import { z } from 'zod';

export const registerSchema = z.object({
  nombre: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
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
