import { prisma } from '../../../lib/db/client';
import { getCurrentUser } from '../../../lib/auth/current-user';

async function getMetrics() {
  const [clientes, productos, ventasMes, bajos] = await Promise.all([
    prisma.cliente.count(),
    prisma.producto.count(),
    prisma.venta.aggregate({
      _sum: { total: true },
      where: {
        fecha: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    }),
    prisma.producto.findMany({ where: { stock: { lt: 5 } }, select: { id: true, nombre: true, stock: true } })
  ]);

  return {
    clientes,
    productos,
    ventasMes: ventasMes._sum.total || 0,
    bajos
  };
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const metrics = await getMetrics();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-gray-600 text-sm">Hola {user?.nombre}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-gray-500">Clientes</p>
          <p className="text-2xl font-bold">{metrics.clientes}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Productos</p>
          <p className="text-2xl font-bold">{metrics.productos}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Ventas del mes</p>
          <p className="text-2xl font-bold">${metrics.ventasMes.toFixed(2)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Stock bajo</p>
          <p className="text-2xl font-bold">{metrics.bajos.length}</p>
        </div>
      </div>
      <div className="card">
        <h3 className="font-semibold mb-2">Productos con stock bajo</h3>
        <div className="space-y-2">
          {metrics.bajos.length === 0 && <p className="text-sm text-gray-500">Todo en orden.</p>}
          {metrics.bajos.map((p) => (
            <div key={p.id} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-b-0 last:pb-0">
              <span>{p.nombre}</span>
              <span className="text-red-600 text-sm">Stock: {p.stock}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
