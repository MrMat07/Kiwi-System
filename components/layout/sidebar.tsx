'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/clientes', label: 'Clientes' },
  { href: '/productos', label: 'Productos' },
  { href: '/ventas', label: 'Ventas' },
  { href: '/compras', label: 'Compras' },
  { href: '/proveedores', label: 'Proveedores' },
  { href: '/usuarios', label: 'Usuarios', admin: true }
];

export function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState<'admin' | 'operador' | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setRole(data.data?.rol || null);
      }
    };
    fetchRole();
  }, []);

  return (
    <aside className="w-60 bg-secondary text-white min-h-screen p-4 space-y-4">
      <h2 className="text-xl font-semibold">Kiwi System</h2>
      <nav className="space-y-2">
        {links
          .filter((link) => !link.admin || role === 'admin')
          .map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-sm ${active ? 'bg-primary text-white' : 'hover:bg-gray-700'}`}
              >
                {link.label}
              </Link>
            );
          })}
      </nav>
    </aside>
  );
}
