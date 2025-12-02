'use client';

import { useEffect, useState } from 'react';
import { SectionHeader } from '../../../components/ui/section-header';

type Proveedor = {
  id: number;
  nombre: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  notas?: string;
};

const emptyForm = { nombre: '', telefono: '', email: '', direccion: '', notas: '' };

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  const loadData = async () => {
    const res = await fetch('/api/proveedores');
    const data = await res.json();
    if (res.ok) setProveedores(data.data || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/proveedores/${editingId}` : '/api/proveedores';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setForm(emptyForm);
    setEditingId(null);
    loadData();
  };

  const remove = async (id: number) => {
    if (!confirm('Eliminar proveedor?')) return;
    await fetch(`/api/proveedores/${id}`, { method: 'DELETE' });
    loadData();
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Proveedores" description="Gestión de proveedores" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-semibold mb-2">{editingId ? 'Editar' : 'Nuevo'} proveedor</h3>
          <form className="space-y-2" onSubmit={handleSubmit}>
            <input className="input" placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            <input className="input" placeholder="Teléfono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
            <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="input" placeholder="Dirección" value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
            <textarea className="input" placeholder="Notas" value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} />
            <div className="flex gap-2">
              <button className="btn-primary" type="submit">
                Guardar
              </button>
              {editingId && (
                <button className="btn-secondary" type="button" onClick={() => (setForm(emptyForm), setEditingId(null))}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {proveedores.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.email}</td>
                  <td className="text-right space-x-2">
                    <button className="text-primary" onClick={() => (setEditingId(p.id), setForm({ nombre: p.nombre, telefono: p.telefono || '', email: p.email || '', direccion: p.direccion || '', notas: p.notas || '' }))}>
                      Editar
                    </button>
                    <button className="text-red-600" onClick={() => remove(p.id)}>
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
