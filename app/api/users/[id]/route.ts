import { prisma } from '../../../../lib/db/client';
import { getAuthPayloadFromRequest } from '../../../../lib/auth/jwt';
import { fail, ok } from '../../../../lib/api';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const auth = getAuthPayloadFromRequest(request as any);
  if (!auth || auth.role !== 'admin') return fail('No autorizado', 403);
  await prisma.user.delete({ where: { id: Number(params.id) } });
  return ok(true);
}
