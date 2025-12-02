'use client';

import { useEffect, useState } from 'react';
import { SectionHeader } from '../../../components/ui/section-header';

const emptyForm = { nombre: '', email: '', password: '', rol: 'operador' };

type User = { id: number; nombre: string; email: string; rol: string };

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const load = async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    if (res.ok) setUsers(data.data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) setError(data.error || 'Error');
    else {
      setForm(emptyForm);
      load();
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Eliminar usuario?')) return;
    await fetch(`/api/users/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Usuarios" description="Solo administradores" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-semibold mb-2">Crear usuario</h3>
          <form className="space-y-2" onSubmit={handleSubmit}>
            <input className="input" placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="input" type="password" placeholder="Contraseña" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <select className="input" value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}>
              <option value="admin">Admin</option>
              <option value="operador">Operador</option>
            </select>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button className="btn-primary" type="submit">
              Guardar
            </button>
          </form>
        </div>
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.nombre}</td>
                  <td>{u.email}</td>
                  <td className="capitalize">{u.rol}</td>
                  <td className="text-right">
                    <button className="text-red-600" onClick={() => remove(u.id)}>
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
