import { prisma } from '../../../../lib/db/client';
import { clienteSchema } from '../../../../lib/validators';
import { fail, ok } from '../../../../lib/api';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const cliente = await prisma.cliente.findUnique({ where: { id: Number(params.id) } });
  if (!cliente) return fail('No encontrado', 404);
  return ok(cliente);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const parsed = clienteSchema.safeParse(body);
  if (!parsed.success) return fail('Datos inválidos');
  const cliente = await prisma.cliente.update({ where: { id: Number(params.id) }, data: parsed.data });
  return ok(cliente);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  await prisma.cliente.delete({ where: { id: Number(params.id) } });
  return ok(true);
}
