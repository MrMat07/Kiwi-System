import { getAuthPayloadFromCookies } from './jwt';
import { prisma } from '../db/client';

export async function getCurrentUser() {
  const payload = getAuthPayloadFromCookies();
  if (!payload) return null;
  const user = await prisma.user.findUnique({ where: { id: payload.userId }, select: { id: true, nombre: true, email: true, rol: true } });
  return user;
}
