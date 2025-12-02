import { prisma } from '../../../lib/db/client';
import { clienteSchema } from '../../../lib/validators';
import { fail, ok } from '../../../lib/api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const where = q
    ? {
        OR: [
          { nombre: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
          { tipo: { contains: q, mode: 'insensitive' } }
        ]
      }
    : {};
  const clientes = await prisma.cliente.findMany({ where, orderBy: { createdAt: 'desc' } });
  return ok(clientes);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = clienteSchema.safeParse(body);
  if (!parsed.success) return fail('Datos inválidos');
  const cliente = await prisma.cliente.create({ data: parsed.data });
  return ok(cliente);
}
