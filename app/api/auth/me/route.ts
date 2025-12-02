import { getAuthPayloadFromRequest } from '../../../../lib/auth/jwt';
import { prisma } from '../../../../lib/db/client';
import { fail, ok } from '../../../../lib/api';

export async function GET(request: Request) {
  // @ts-ignore
  const payload = getAuthPayloadFromRequest(request as any);
  if (!payload) return fail('No autenticado', 401);
  const user = await prisma.user.findUnique({ where: { id: payload.userId }, select: { id: true, nombre: true, email: true, rol: true } });
  return ok(user);
}
