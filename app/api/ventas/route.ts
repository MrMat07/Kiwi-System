import { prisma } from '../../../lib/db/client';
import { ventaSchema } from '../../../lib/validators';
import { fail, ok } from '../../../lib/api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clienteId = searchParams.get('clienteId');
  const estado = searchParams.get('estado');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const where: any = {};
  if (clienteId) where.clienteId = Number(clienteId);
  if (estado) where.estado = estado;
  if (from || to) {
    where.fecha = {};
    if (from) where.fecha.gte = new Date(from);
    if (to) where.fecha.lte = new Date(to);
  }
  const ventas = await prisma.venta.findMany({ where, include: { cliente: true, items: { include: { producto: true } } }, orderBy: { fecha: 'desc' } });
  return ok(ventas);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = ventaSchema.safeParse({ ...body, clienteId: Number(body.clienteId) });
  if (!parsed.success) return fail('Datos inválidos');

  const total = parsed.data.items.reduce((acc, item) => acc + item.cantidad * item.precioUnitario, 0);

  const venta = await prisma.$transaction(async (tx) => {
    const created = await tx.venta.create({
      data: {
        fecha: new Date(parsed.data.fecha),
        clienteId: parsed.data.clienteId,
        estado: parsed.data.estado,
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
      await tx.producto.update({ where: { id: item.productoId }, data: { stock: { decrement: item.cantidad } } });
    }
    return created;
  });

  return ok(venta);
}
