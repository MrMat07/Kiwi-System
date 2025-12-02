import { prisma } from '../../../../lib/db/client';
import { hashPassword } from '../../../../lib/auth/password';
import { registerSchema } from '../../../../lib/validators';
import { fail, ok } from '../../../../lib/api';

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) return fail('Datos inválidos', 400);

  const exists = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (exists) return fail('El usuario ya existe', 400);

  const passwordHash = await hashPassword(parsed.data.password);
  const user = await prisma.user.create({ data: { nombre: parsed.data.nombre, email: parsed.data.email, passwordHash, rol: parsed.data.rol } });
  return ok({ id: user.id, nombre: user.nombre, email: user.email, rol: user.rol });
}
