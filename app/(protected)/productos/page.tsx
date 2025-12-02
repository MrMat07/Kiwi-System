'use client';

import { useEffect, useState } from 'react';
import { SectionHeader } from '../../../components/ui/section-header';

type Producto = {
  id: number;
  nombre: string;
  sku: string;
  precio: number;
  stock: number;
  categoria?: string;
  descripcion?: string;
  activo: boolean;
};

const emptyForm = { nombre: '', sku: '', precio: 0, stock: 0, categoria: '', descripcion: '', activo: true, proveedorId: '' } as any;

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [form, setForm] = useState<any>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterCat, setFilterCat] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const loadProductos = async () => {
    const params = new URLSearchParams();
    if (filterCat) params.set('categoria', filterCat);
    if (search) params.set('q', search);
    const res = await fetch('/api/productos?' + params.toString());
    const data = await res.json();
    if (res.ok) setProductos(data.data || []);
  };

  useEffect(() => {
    loadProductos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, precio: Number(form.precio), stock: Number(form.stock) };
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/productos/${editingId}` : '/api/productos';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (!res.ok) setError(data.error || 'Error');
    else {
      setForm(emptyForm);
      setEditingId(null);
      loadProductos();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Eliminar producto?')) return;
    await fetch(`/api/productos/${id}`, { method: 'DELETE' });
    loadProductos();
  };

  const startEdit = (p: Producto) => {
    setForm({ ...p });
    setEditingId(p.id);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Productos"
        description="Inventario"
        action={
          <div className="flex items-center gap-2">
            <input className="input" placeholder="Buscar nombre o SKU" value={search} onChange={(e) => setSearch(e.target.value)} />
            <input className="input" placeholder="Categoría" value={filterCat} onChange={(e) => setFilterCat(e.target.value)} />
            <button className="btn-secondary" onClick={loadProductos}>
              Filtrar
            </button>
          </div>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-semibold mb-2">{editingId ? 'Editar producto' : 'Nuevo producto'}</h3>
          <form className="space-y-2" onSubmit={handleSubmit}>
            <input className="input" placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
            <input className="input" placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
            <input className="input" type="number" placeholder="Precio" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} />
            <input className="input" type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            <input className="input" placeholder="Categoría" value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} />
            <textarea className="input" placeholder="Descripción" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })} />Activo</label>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <div className="flex gap-2">
              <button className="btn-primary" type="submit">Guardar</button>
              {editingId && (
                <button className="btn-secondary" type="button" onClick={() => (setForm(emptyForm), setEditingId(null))}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-2">Listado</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>SKU</th>
                <th>Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.sku}</td>
                  <td>{p.stock}</td>
                  <td className="text-right space-x-2">
                    <button className="text-primary" onClick={() => startEdit(p)}>
                      Editar
                    </button>
                    <button className="text-red-600" onClick={() => handleDelete(p.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
