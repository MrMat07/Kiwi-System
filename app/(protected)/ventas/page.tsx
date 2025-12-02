'use client';

import { useEffect, useState } from 'react';
import { SectionHeader } from '../../../components/ui/section-header';

type Cliente = { id: number; nombre: string };
type Producto = { id: number; nombre: string; precio: number; stock: number };
type Venta = { id: number; fecha: string; total: number; estado: string; cliente: Cliente };

type Item = { productoId: number; cantidad: number; precioUnitario: number };

export default function VentasPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [clienteId, setClienteId] = useState('');
  const [estado, setEstado] = useState('pendiente');
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10));
  const [items, setItems] = useState<Item[]>([]);

  const loadData = async () => {
    const [c, p, v] = await Promise.all([
      fetch('/api/clientes').then((r) => r.json()),
      fetch('/api/productos').then((r) => r.json()),
      fetch('/api/ventas').then((r) => r.json())
    ]);
    setClientes(c.data || []);
    setProductos(p.data || []);
    setVentas(v.data || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const addItem = () => setItems([...items, { productoId: productos[0]?.id || 0, cantidad: 1, precioUnitario: productos[0]?.precio || 0 }]);

  const updateItem = (index: number, patch: Partial<Item>) => {
    const clone = [...items];
    clone[index] = { ...clone[index], ...patch };
    setItems(clone);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      fecha,
      clienteId: Number(clienteId),
      estado,
      items: items.map((i) => ({ ...i, cantidad: Number(i.cantidad), precioUnitario: Number(i.precioUnitario) }))
    };
    const res = await fetch('/api/ventas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) {
      setItems([]);
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Ventas" description="Registrar ventas y ajustar stock" action={<button className="btn-secondary" onClick={loadData}>Actualizar</button>} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card space-y-3">
          <h3 className="font-semibold">Nueva venta</h3>
          <form className="space-y-2" onSubmit={submit}>
            <select className="input" value={clienteId} onChange={(e) => setClienteId(e.target.value)} required>
              <option value="">Selecciona cliente</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
            <input className="input" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            <select className="input" value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="pendiente">Pendiente</option>
              <option value="pagada">Pagada</option>
              <option value="cancelada">Cancelada</option>
            </select>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="font-semibold">Items</p>
                <button className="btn-secondary" type="button" onClick={addItem}>
                  Agregar
                </button>
              </div>
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <select className="input" value={item.productoId} onChange={(e) => updateItem(idx, { productoId: Number(e.target.value) })}>
                    {productos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                  <input className="input" type="number" value={item.cantidad} onChange={(e) => updateItem(idx, { cantidad: Number(e.target.value) })} />
                  <input className="input" type="number" value={item.precioUnitario} onChange={(e) => updateItem(idx, { precioUnitario: Number(e.target.value) })} />
                  <button className="text-red-600" type="button" onClick={() => removeItem(idx)}>
                    X
                  </button>
                </div>
              ))}
            </div>
            <button className="btn-primary" type="submit">
              Guardar
            </button>
          </form>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-2">Listado</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((v) => (
                <tr key={v.id}>
                  <td>{new Date(v.fecha).toLocaleDateString()}</td>
                  <td>{v.cliente?.nombre}</td>
                  <td>${v.total.toFixed(2)}</td>
                  <td className="capitalize">{v.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
