import { prisma } from '../../../../lib/db/client';
import { proveedorSchema } from '../../../../lib/validators';
import { fail, ok } from '../../../../lib/api';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const parsed = proveedorSchema.safeParse(body);
  if (!parsed.success) return fail('Datos inválidos');
  const proveedor = await prisma.proveedor.update({ where: { id: Number(params.id) }, data: parsed.data });
  return ok(proveedor);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await prisma.proveedor.delete({ where: { id: Number(params.id) } });
  return ok(true);
}
