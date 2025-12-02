import { prisma } from '../../../lib/db/client';
import { productoSchema } from '../../../lib/validators';
import { fail, ok } from '../../../lib/api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoria = searchParams.get('categoria') || undefined;
  const q = searchParams.get('q') || '';
  const where: any = {};
  if (categoria) where.categoria = categoria;
  if (q) {
    where.OR = [{ nombre: { contains: q, mode: 'insensitive' } }, { sku: { contains: q, mode: 'insensitive' } }];
  }
  const productos = await prisma.producto.findMany({ where, orderBy: { createdAt: 'desc' }, include: { proveedor: true } });
  return ok(productos);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = productoSchema.safeParse({ ...body, precio: Number(body.precio), stock: Number(body.stock), activo: !!body.activo });
  if (!parsed.success) return fail('Datos inválidos');
  const producto = await prisma.producto.create({ data: parsed.data });
  return ok(producto);
}
