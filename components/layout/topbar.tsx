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
    <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-3">
      <div>
        <p className="text-sm text-gray-500">Bienvenido</p>
        <p className="font-semibold">{user?.nombre || 'Cargando...'}</p>
      </div>
      <div className="flex items-center space-x-3">
        {user && <span className="text-xs bg-gray-100 px-3 py-1 rounded-full capitalize">{user.rol}</span>}
        <button className="btn-secondary" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}
