import { prisma } from '../../../../lib/db/client';
import { ok, fail } from '../../../../lib/api';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const compra = await prisma.compra.findUnique({ where: { id: Number(params.id) }, include: { proveedor: true, items: { include: { producto: true } } } });
  if (!compra) return fail('No encontrada', 404);
  return ok(compra);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await prisma.compra.delete({ where: { id: Number(params.id) } });
  return ok(true);
}
