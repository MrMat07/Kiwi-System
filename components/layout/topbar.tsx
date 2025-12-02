'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function Topbar() {
  const [user, setUser] = useState<{ nombre: string; rol: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.data);
      }
    };
    loadUser();
  }, []);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <header className="flex items-center justify-between bg-white/90 backdrop-blur border-b border-slate-200 px-6 py-4 shadow-sm">
      <div>
        <p className="text-sm text-slate-500">Bienvenido</p>
        <p className="font-semibold text-secondary">{user?.nombre || 'Cargando...'}</p>
      </div>
      <div className="flex items-center space-x-3">
        {user && <span className="text-xs bg-mint/30 text-secondary px-3 py-1 rounded-full capitalize border border-mint/60">{user.rol}</span>}
        <button className="btn-secondary" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}
