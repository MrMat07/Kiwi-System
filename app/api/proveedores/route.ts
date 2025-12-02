import { prisma } from '../../../lib/db/client';
import { proveedorSchema } from '../../../lib/validators';
import { fail, ok } from '../../../lib/api';

export async function GET() {
  const proveedores = await prisma.proveedor.findMany({ orderBy: { createdAt: 'desc' } });
  return ok(proveedores);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = proveedorSchema.safeParse(body);
  if (!parsed.success) return fail('Datos inválidos');
  const proveedor = await prisma.proveedor.create({ data: parsed.data });
  return ok(proveedor);
}
