import { prisma } from '../../../../lib/db/client';
import { productoSchema } from '../../../../lib/validators';
import { fail, ok } from '../../../../lib/api';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const parsed = productoSchema.safeParse({ ...body, precio: Number(body.precio), stock: Number(body.stock), activo: !!body.activo });
  if (!parsed.success) return fail('Datos inválidos');
  const producto = await prisma.producto.update({ where: { id: Number(params.id) }, data: parsed.data });
  return ok(producto);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await prisma.producto.delete({ where: { id: Number(params.id) } });
  return ok(true);
}
