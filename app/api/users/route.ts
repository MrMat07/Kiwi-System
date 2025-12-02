import { prisma } from '../../../lib/db/client';
import { registerSchema } from '../../../lib/validators';
import { hashPassword } from '../../../lib/auth/password';
import { fail, ok } from '../../../lib/api';
import { getAuthPayloadFromRequest } from '../../../lib/auth/jwt';

export async function GET(request: Request) {
  const auth = getAuthPayloadFromRequest(request as any);
  if (!auth || auth.role !== 'admin') return fail('No autorizado', 403);
  const users = await prisma.user.findMany({ select: { id: true, nombre: true, email: true, rol: true }, orderBy: { createdAt: 'desc' } });
  return ok(users);
}

export async function POST(request: Request) {
  const auth = getAuthPayloadFromRequest(request as any);
  if (!auth || auth.role !== 'admin') return fail('No autorizado', 403);
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) return fail('Datos inválidos');
  const passwordHash = await hashPassword(parsed.data.password);
  const user = await prisma.user.create({ data: { nombre: parsed.data.nombre, email: parsed.data.email, passwordHash, rol: parsed.data.rol } });
  return ok({ id: user.id, nombre: user.nombre, email: user.email, rol: user.rol });
}
