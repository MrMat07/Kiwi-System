'use client';

import { useEffect, useState } from 'react';
import { SectionHeader } from '../../../components/ui/section-header';

type Proveedor = { id: number; nombre: string };
type Producto = { id: number; nombre: string; precio: number };
type Compra = { id: number; fecha: string; total: number; proveedor: Proveedor };

type Item = { productoId: number; cantidad: number; precioUnitario: number };

export default function ComprasPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [compras, setCompras] = useState<Compra[]>([]);
  const [proveedorId, setProveedorId] = useState('');
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10));
  const [items, setItems] = useState<Item[]>([]);

  const loadData = async () => {
    const [pvs, prods, comps] = await Promise.all([
      fetch('/api/proveedores').then((r) => r.json()),
      fetch('/api/productos').then((r) => r.json()),
      fetch('/api/compras').then((r) => r.json())
    ]);
    setProveedores(pvs.data || []);
    setProductos(prods.data || []);
    setCompras(comps.data || []);
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

  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      fecha,
      proveedorId: Number(proveedorId),
      items: items.map((i) => ({ ...i, cantidad: Number(i.cantidad), precioUnitario: Number(i.precioUnitario) }))
    };
    const res = await fetch('/api/compras', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) {
      setItems([]);
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Compras" description="Registrar compras a proveedores" action={<button className="btn-secondary" onClick={loadData}>Actualizar</button>} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card space-y-3">
          <h3 className="font-semibold">Nueva compra</h3>
          <form className="space-y-2" onSubmit={submit}>
            <select className="input" value={proveedorId} onChange={(e) => setProveedorId(e.target.value)} required>
              <option value="">Selecciona proveedor</option>
              {proveedores.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
            <input className="input" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
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
                <th>Proveedor</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {compras.map((c) => (
                <tr key={c.id}>
                  <td>{new Date(c.fecha).toLocaleDateString()}</td>
                  <td>{c.proveedor?.nombre}</td>
                  <td>${c.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
