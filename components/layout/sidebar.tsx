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
    <aside className="w-64 bg-gradient-to-b from-primary-deep via-forest to-secondary text-white min-h-screen p-5 space-y-6 shadow-xl shadow-primary/10">
      <h2 className="text-2xl font-semibold tracking-wide">Kiwi System</h2>
      <nav className="space-y-2">
        {links
          .filter((link) => !link.admin || role === 'admin')
          .map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-lg text-sm transition border border-transparent ${
                  active
                    ? 'bg-white/10 border-white/30 shadow-inner'
                    : 'hover:bg-white/5 hover:border-white/10'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
      </nav>
    </aside>
  );
}
