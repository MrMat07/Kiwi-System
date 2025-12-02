import { prisma } from '../../../../lib/db/client';
import { ok, fail } from '../../../../lib/api';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const venta = await prisma.venta.findUnique({ where: { id: Number(params.id) }, include: { cliente: true, items: { include: { producto: true } } } });
  if (!venta) return fail('No encontrada', 404);
  return ok(venta);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await prisma.venta.delete({ where: { id: Number(params.id) } });
  return ok(true);
}
