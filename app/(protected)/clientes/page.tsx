'use client';

import { useEffect, useState } from 'react';
import { SectionHeader } from '../../../components/ui/section-header';

type Cliente = {
  id: number;
  nombre: string;
  tipo: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  notas?: string;
  createdAt: string;
};

const emptyForm = { nombre: '', tipo: 'persona', telefono: '', email: '', direccion: '', notas: '' };

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadClientes = async () => {
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    const res = await fetch('/api/clientes?' + params.toString());
    const data = await res.json();
    if (res.ok) {
      setClientes(data.data || []);
    }
  };

  useEffect(() => {
    loadClientes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/clientes/${editingId}` : '/api/clientes';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Error al guardar');
    } else {
      setForm(emptyForm);
      setEditingId(null);
      loadClientes();
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Eliminar cliente?')) return;
    await fetch(`/api/clientes/${id}`, { method: 'DELETE' });
    loadClientes();
  };

  const startEdit = (cliente: Cliente) => {
    setForm({
      nombre: cliente.nombre,
      tipo: cliente.tipo,
      telefono: cliente.telefono || '',
      email: cliente.email || '',
      direccion: cliente.direccion || '',
      notas: cliente.notas || ''
    });
    setEditingId(cliente.id);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Clientes"
        description="Gestiona tus clientes"
        action={
          <div className="flex items-center space-x-2">
            <input
              placeholder="Buscar"
              className="input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onBlur={loadClientes}
            />
            <button className="btn-secondary" onClick={loadClientes}>
              Buscar
            </button>
          </div>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-semibold mb-2">{editingId ? 'Editar cliente' : 'Nuevo cliente'}</h3>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <input className="input" placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
            <select className="input" value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
              <option value="persona">Persona</option>
              <option value="empresa">Empresa</option>
            </select>
            <input className="input" placeholder="Teléfono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
            <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="input" placeholder="Dirección" value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
            <textarea className="input" placeholder="Notas" value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} />
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <div className="flex space-x-2">
              <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar'}
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
          <h3 className="font-semibold mb-2">Listado</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Email</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.id}>
                  <td>{c.nombre}</td>
                  <td className="capitalize">{c.tipo}</td>
                  <td>{c.email}</td>
                  <td className="space-x-2 text-right">
                    <button className="text-primary" onClick={() => startEdit(c)}>
                      Editar
                    </button>
                    <button className="text-red-600" onClick={() => handleDelete(c.id)}>
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
