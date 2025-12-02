import { prisma } from '../../../../lib/db/client';
import { comparePassword } from '../../../../lib/auth/password';
import { loginSchema } from '../../../../lib/validators';
import { signToken, setAuthCookie } from '../../../../lib/auth/jwt';
import { fail } from '../../../../lib/api';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) return fail('Datos inválidos', 400);

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) return fail('Credenciales inválidas', 401);

  const valid = await comparePassword(parsed.data.password, user.passwordHash);
  if (!valid) return fail('Credenciales inválidas', 401);

  const token = signToken({ userId: user.id, email: user.email, role: user.rol as any });
  const response = NextResponse.json({ success: true, data: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol } });
  setAuthCookie(token, response);
  return response;
}
