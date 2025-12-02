import { prisma } from '../../../lib/db/client';
import { compraSchema } from '../../../lib/validators';
import { fail, ok } from '../../../lib/api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const proveedorId = searchParams.get('proveedorId');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const where: any = {};
  if (proveedorId) where.proveedorId = Number(proveedorId);
  if (from || to) {
    where.fecha = {};
    if (from) where.fecha.gte = new Date(from);
    if (to) where.fecha.lte = new Date(to);
  }
  const compras = await prisma.compra.findMany({ where, include: { proveedor: true, items: { include: { producto: true } } }, orderBy: { fecha: 'desc' } });
  return ok(compras);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = compraSchema.safeParse({ ...body, proveedorId: Number(body.proveedorId) });
  if (!parsed.success) return fail('Datos inválidos');

  const total = parsed.data.items.reduce((acc, item) => acc + item.cantidad * item.precioUnitario, 0);
  const compra = await prisma.$transaction(async (tx) => {
    const created = await tx.compra.create({
      data: {
        fecha: new Date(parsed.data.fecha),
        proveedorId: parsed.data.proveedorId,
        total,
        items: {
          create: parsed.data.items.map((item) => ({
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario,
            subtotal: item.cantidad * item.precioUnitario,
            producto: { connect: { id: item.productoId } }
          }))
        }
      },
      include: { items: true }
    });

    for (const item of parsed.data.items) {
      await tx.producto.update({ where: { id: item.productoId }, data: { stock: { increment: item.cantidad } } });
    }
    return created;
  });

  return ok(compra);
}
